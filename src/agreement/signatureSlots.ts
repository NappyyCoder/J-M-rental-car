/** PDF page size for jm-rental-agreement-source.pdf (A4 points). */
export const PDF_PAGE = { width: 595, height: 842 } as const;

export type SignatureSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Bottom signature block on both pages:
 *   X ______________ Renter
 *   X ______________ Additional Driver
 *
 * Coordinates were read off the source PDF rendered at 288dpi: the printed
 * rules sit at y=39.0/24.0 (page 1) and y=39.6/24.5 (page 2), and the body
 * text above them stops at y≈61. Each box therefore rests just above its rule
 * and stops short of the next element. Origin is bottom-left, as pdf-lib uses.
 */
export const PAGE_SIGNATURE_SLOTS: Record<
  1 | 2,
  { renter: SignatureSlot; additional: SignatureSlot }
> = {
  1: {
    renter: { x: 219.5, y: 40, width: 65, height: 20 },
    additional: { x: 219.5, y: 25, width: 65, height: 13 },
  },
  2: {
    renter: { x: 217, y: 41, width: 66.5, height: 20 },
    additional: { x: 217, y: 26, width: 66.5, height: 13 },
  },
};

/** CSS percentages for overlaying a slot on a top-left-origin page image. */
export function slotToCssPercent(slot: SignatureSlot) {
  return {
    left: `${(slot.x / PDF_PAGE.width) * 100}%`,
    top: `${((PDF_PAGE.height - slot.y - slot.height) / PDF_PAGE.height) * 100}%`,
    width: `${(slot.width / PDF_PAGE.width) * 100}%`,
    height: `${(slot.height / PDF_PAGE.height) * 100}%`,
  };
}
