import { useCallback, useEffect, useRef, useState } from "react";
import SignaturePadLib from "signature_pad";
import type { SignatureSlot } from "./signatureSlots";

type Props = {
  title: string;
  slot: SignatureSlot;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

export function SignatureModal({ title, slot, onCancel, onApply }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePadLib(canvas, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      penColor: "rgb(17, 17, 24)",
      minWidth: 1.4,
      maxWidth: 3.2,
    });
    padRef.current = pad;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      setHasInk(false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const handleEnd = () => setHasInk(!pad.isEmpty());
    pad.addEventListener("endStroke", handleEnd);

    return () => {
      observer.disconnect();
      pad.removeEventListener("endStroke", handleEnd);
      pad.off();
      padRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const apply = useCallback(() => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    onApply(pad.toDataURL("image/png"));
  }, [onApply]);

  return (
    <div
      className="sig-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="sig-modal">
        <div className="sig-modal-head">
          <h3>{title}</h3>
          <p>Draw your signature with a finger, stylus, or mouse.</p>
        </div>

        <div
          className="sig-modal-pad"
          style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
        >
          <canvas ref={canvasRef} />
          <span className="sig-modal-rule" aria-hidden="true" />
        </div>

        <div className="sig-modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              padRef.current?.clear();
              setHasInk(false);
            }}
          >
            Clear
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!hasInk}
            onClick={apply}
          >
            Apply signature
          </button>
        </div>
      </div>
    </div>
  );
}
