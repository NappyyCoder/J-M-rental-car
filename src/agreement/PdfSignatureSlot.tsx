import { slotToCssPercent, type SignatureSlot } from "./signatureSlots";

type Props = {
  slot: SignatureSlot;
  lineName: string;
  value: string | null;
  onSign: () => void;
};

export function PdfSignatureSlot({ slot, lineName, value, onSign }: Props) {
  return (
    <button
      type="button"
      className="pdf-sign-slot"
      data-sign-slot
      data-signed={value ? "true" : "false"}
      style={slotToCssPercent(slot)}
      aria-label={
        value
          ? `${lineName} signature applied. Tap to redo.`
          : `Tap to sign the ${lineName} line`
      }
      onClick={onSign}
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="pdf-sign-slot-ink" />
      ) : (
        <span className="pdf-sign-slot-cue">Tap to sign</span>
      )}
    </button>
  );
}
