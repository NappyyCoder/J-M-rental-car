import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  PAGE_SIGNATURE_SLOTS,
  PDF_PAGE,
  type SignatureSlot,
} from "./signatureSlots";
import { PdfSignatureSlot } from "./PdfSignatureSlot";
import { SignatureModal } from "./SignatureModal";

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const PAGE_ASPECT = PDF_PAGE.height / PDF_PAGE.width;
/** Rendered height we aim for when the user chooses to zoom to a line. */
const COMFORTABLE_SLOT_PX = 46;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Props = {
  pageSrc: string;
  pageNumber: 1 | 2;
  priority?: boolean;
  renterValue: string | null;
  additionalValue: string | null;
  onRenterChange: (dataUrl: string | null) => void;
  onAdditionalChange: (dataUrl: string | null) => void;
  requireAdditional?: boolean;
};

export function PdfPageSigner({
  pageSrc,
  pageNumber,
  renterValue,
  additionalValue,
  onRenterChange,
  onAdditionalChange,
  requireAdditional = false,
}: Props) {
  const slots = PAGE_SIGNATURE_SLOTS[pageNumber];

  const frameRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const pendingScrollRef = useRef<{ left: number; top: number } | null>(null);
  const didScrollRef = useRef(false);

  const [zoom, setZoom] = useState(1);
  const [fitWidth, setFitWidth] = useState(0);
  const [modal, setModal] = useState<null | "renter" | "additional">(null);

  const applyPendingScroll = useCallback(() => {
    const frame = frameRef.current;
    const pending = pendingScrollRef.current;
    if (!frame || !pending) return;
    frame.scrollLeft = pending.left;
    frame.scrollTop = pending.top;
    pendingScrollRef.current = null;
  }, []);

  useLayoutEffect(applyPendingScroll, [zoom, fitWidth, applyPendingScroll]);

  const zoomAround = useCallback(
    (next: number, clientX?: number, clientY?: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      const previous = zoomRef.current;
      const target = clamp(next, MIN_ZOOM, MAX_ZOOM);
      if (Math.abs(target - previous) < 0.0005) return;

      const rect = frame.getBoundingClientRect();
      const focalX = (clientX ?? rect.left + rect.width / 2) - rect.left;
      const focalY = (clientY ?? rect.top + rect.height / 2) - rect.top;
      const ratio = target / previous;

      pendingScrollRef.current = {
        left: (frame.scrollLeft + focalX) * ratio - focalX,
        top: (frame.scrollTop + focalY) * ratio - focalY,
      };
      zoomRef.current = target;
      setZoom(target);
    },
    [],
  );

  const scrollToSlot = useCallback(
    (slot: SignatureSlot, nextZoom = zoomRef.current) => {
      const frame = frameRef.current;
      const width = frame?.clientWidth ?? 0;
      if (!frame || !width) return;

      const canvasWidth = width * nextZoom;
      const canvasHeight = canvasWidth * PAGE_ASPECT;

      pendingScrollRef.current = {
        left:
          ((slot.x + slot.width / 2) / PDF_PAGE.width) * canvasWidth -
          frame.clientWidth / 2,
        top:
          ((PDF_PAGE.height - slot.y - slot.height / 2) / PDF_PAGE.height) *
            canvasHeight -
          frame.clientHeight / 2,
      };
      applyPendingScroll();
    },
    [applyPendingScroll],
  );

  const zoomToSlot = useCallback(
    (slot: SignatureSlot) => {
      const frame = frameRef.current;
      const width = frame?.clientWidth ?? 0;
      if (!frame || !width) return;

      const target = clamp(
        (COMFORTABLE_SLOT_PX * PDF_PAGE.width) / (slot.height * width),
        MIN_ZOOM,
        MAX_ZOOM,
      );

      if (Math.abs(target - zoomRef.current) < 0.0005) {
        scrollToSlot(slot, target);
        return;
      }

      const canvasWidth = width * target;
      const canvasHeight = canvasWidth * PAGE_ASPECT;
      pendingScrollRef.current = {
        left:
          ((slot.x + slot.width / 2) / PDF_PAGE.width) * canvasWidth -
          frame.clientWidth / 2,
        top:
          ((PDF_PAGE.height - slot.y - slot.height / 2) / PDF_PAGE.height) *
            canvasHeight -
          frame.clientHeight / 2,
      };
      zoomRef.current = target;
      setZoom(target);
    },
    [scrollToSlot],
  );

  const fitPage = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    pendingScrollRef.current = { left: 0, top: 0 };
    zoomRef.current = MIN_ZOOM;
    setZoom(MIN_ZOOM);
    applyPendingScroll();
  }, [applyPendingScroll]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setFitWidth(frame.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    measure();
    return () => observer.disconnect();
  }, []);

  // Scroll to the signature block at the current (fit) zoom — do not auto-zoom.
  useEffect(() => {
    if (didScrollRef.current || !fitWidth) return;
    didScrollRef.current = true;
    scrollToSlot(slots.renter, MIN_ZOOM);
  }, [fitWidth, slots.renter, scrollToSlot]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let pinchDistance = 0;
    let pinchZoom = 1;
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    const touchDistance = (touches: TouchList) =>
      Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      pinchDistance = touchDistance(event.touches);
      pinchZoom = zoomRef.current;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !pinchDistance) return;
      event.preventDefault();
      zoomAround(
        pinchZoom * (touchDistance(event.touches) / pinchDistance),
        (event.touches[0].clientX + event.touches[1].clientX) / 2,
        (event.touches[0].clientY + event.touches[1].clientY) / 2,
      );
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length < 2) pinchDistance = 0;

      const touch = event.changedTouches[0];
      if (!touch || event.touches.length > 0) return;
      if ((event.target as Element | null)?.closest?.("[data-sign-slot]")) {
        return;
      }

      const now = Date.now();
      const isDoubleTap =
        now - lastTapAt < 320 &&
        Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY) < 30;

      if (isDoubleTap) {
        event.preventDefault();
        zoomAround(
          zoomRef.current > MIN_ZOOM + 0.05 ? MIN_ZOOM : 3,
          touch.clientX,
          touch.clientY,
        );
        lastTapAt = 0;
        return;
      }
      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    };

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomAround(
        zoomRef.current * Math.exp(-event.deltaY / 180),
        event.clientX,
        event.clientY,
      );
    };

    const onGesture = (event: Event) => event.preventDefault();

    let panX = 0;
    let panY = 0;
    let panning = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if ((event.target as Element | null)?.closest?.("[data-sign-slot]")) return;
      panning = true;
      panX = event.clientX;
      panY = event.clientY;
      frame.setPointerCapture(event.pointerId);
      frame.classList.add("is-panning");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!panning) return;
      frame.scrollLeft -= event.clientX - panX;
      frame.scrollTop -= event.clientY - panY;
      panX = event.clientX;
      panY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!panning) return;
      panning = false;
      if (frame.hasPointerCapture(event.pointerId)) {
        frame.releasePointerCapture(event.pointerId);
      }
      frame.classList.remove("is-panning");
    };

    const onDoubleClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.("[data-sign-slot]")) return;
      zoomAround(
        zoomRef.current > MIN_ZOOM + 0.05 ? MIN_ZOOM : 3,
        event.clientX,
        event.clientY,
      );
    };

    frame.addEventListener("touchstart", onTouchStart, { passive: true });
    frame.addEventListener("touchmove", onTouchMove, { passive: false });
    frame.addEventListener("touchend", onTouchEnd, { passive: false });
    frame.addEventListener("touchcancel", onTouchEnd, { passive: false });
    frame.addEventListener("wheel", onWheel, { passive: false });
    frame.addEventListener("gesturestart", onGesture);
    frame.addEventListener("gesturechange", onGesture);
    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerup", onPointerUp);
    frame.addEventListener("pointercancel", onPointerUp);
    frame.addEventListener("dblclick", onDoubleClick);

    return () => {
      frame.removeEventListener("touchstart", onTouchStart);
      frame.removeEventListener("touchmove", onTouchMove);
      frame.removeEventListener("touchend", onTouchEnd);
      frame.removeEventListener("touchcancel", onTouchEnd);
      frame.removeEventListener("wheel", onWheel);
      frame.removeEventListener("gesturestart", onGesture);
      frame.removeEventListener("gesturechange", onGesture);
      frame.removeEventListener("pointerdown", onPointerDown);
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerup", onPointerUp);
      frame.removeEventListener("pointercancel", onPointerUp);
      frame.removeEventListener("dblclick", onDoubleClick);
    };
  }, [zoomAround]);

  const canvasWidth = fitWidth ? Math.round(fitWidth * zoom) : undefined;

  const lines = [
    {
      key: "renter" as const,
      label: "Renter",
      slot: slots.renter,
      value: renterValue,
      onChange: onRenterChange,
      required: true,
    },
    {
      key: "additional" as const,
      label: "Additional driver",
      slot: slots.additional,
      value: additionalValue,
      onChange: onAdditionalChange,
      required: requireAdditional,
    },
  ];

  return (
    <div className="pdf-signer">
      <div className="pdf-signer-toolbar">
        <div className="pdf-zoom-group">
          <button
            type="button"
            className="pdf-zoom-btn"
            aria-label="Zoom out"
            disabled={zoom <= MIN_ZOOM + 0.005}
            onClick={() => zoomAround(zoomRef.current / 1.4)}
          >
            −
          </button>
          <span className="pdf-zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="pdf-zoom-btn"
            aria-label="Zoom in"
            disabled={zoom >= MAX_ZOOM - 0.005}
            onClick={() => zoomAround(zoomRef.current * 1.4)}
          >
            +
          </button>
        </div>
        <button type="button" className="btn btn-outline btn-small" onClick={fitPage}>
          Whole page
        </button>
        <button
          type="button"
          className="btn btn-outline btn-small"
          onClick={() => zoomToSlot(slots.renter)}
        >
          Zoom to sign
        </button>
      </div>

      <div className="pdf-signer-frame" ref={frameRef}>
        <div
          className="pdf-signer-canvas"
          style={
            canvasWidth
              ? { width: canvasWidth, height: Math.round(canvasWidth * PAGE_ASPECT) }
              : undefined
          }
        >
          <img
            src={pageSrc}
            alt={`Rental agreement page ${pageNumber}`}
            width={PDF_PAGE.width}
            height={PDF_PAGE.height}
            className="pdf-signer-page"
            draggable={false}
          />
          {lines.map((line) => (
            <PdfSignatureSlot
              key={line.key}
              slot={line.slot}
              lineName={line.label}
              value={line.value}
              onSign={() => setModal(line.key)}
            />
          ))}
        </div>
      </div>

      <p className="pdf-signer-hint">
        Tap <strong>Tap to sign</strong> on the Renter
        {requireAdditional ? (
          <>
            {" "}
            and Additional Driver
          </>
        ) : null}{" "}
        line
        {requireAdditional ? "s" : ""}. Use zoom if you want a closer look.
      </p>

      <ul className="pdf-line-list">
        {lines.map((line) => (
          <li key={line.key} className="pdf-line-row">
            <span className="pdf-line-name">
              {line.label}
              {line.required ? null : " (if any)"}
            </span>
            <span
              className="pdf-line-status"
              data-signed={line.value ? "true" : "false"}
            >
              {line.value ? "Signed" : "Not signed"}
            </span>
            <span className="pdf-line-actions">
              <button
                type="button"
                className="btn btn-outline btn-small"
                onClick={() => setModal(line.key)}
              >
                {line.value ? "Redo" : "Sign"}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-small"
                disabled={!line.value}
                onClick={() => line.onChange(null)}
              >
                Clear
              </button>
            </span>
          </li>
        ))}
      </ul>

      {modal ? (
        <SignatureModal
          title={`${modal === "renter" ? "Renter" : "Additional driver"} signature — page ${pageNumber}`}
          slot={modal === "renter" ? slots.renter : slots.additional}
          onCancel={() => setModal(null)}
          onApply={(dataUrl) => {
            if (modal === "renter") onRenterChange(dataUrl);
            else onAdditionalChange(dataUrl);
            setModal(null);
          }}
        />
      ) : null}
    </div>
  );
}
