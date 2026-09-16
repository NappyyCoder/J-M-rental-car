import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { SITE_NAME, SITE_NAME_SHORT } from "./brand";
import { resolveAgreementFields, rentalDaysFromFields } from "./fees";
import {
  AGREEMENT_FIELD_PLACEMENTS,
  COVERAGE_MARK_PLACEMENTS,
  DATETIME_AMPM_MARKS,
} from "./fieldPlacements";
import type { FormTemplate } from "./forms";
import { PAGE_SIGNATURE_SLOTS, type SignatureSlot } from "./signatureSlots";

export { resolveAgreementFields } from "./fees";

const SOURCE_PDF_URL = "/agreement/jm-rental-agreement-source.pdf";
let sourcePdfCache: Uint8Array | null = null;

async function loadSourcePdf(): Promise<Uint8Array> {
  if (!sourcePdfCache) {
    const response = await fetch(SOURCE_PDF_URL);
    if (!response.ok) {
      throw new Error("Could not load the rental agreement PDF.");
    }
    sourcePdfCache = new Uint8Array(await response.arrayBuffer());
  }
  return sourcePdfCache.slice();
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function fitText(text: string, maxWidth: number | undefined, size: number, font: PDFFont) {
  if (!maxWidth) return text;
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 1 && font.widthOfTextAtSize(`${trimmed}…`, size) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

const PHONE_FIELDS = new Set([
  "phone",
  "insurancePhone",
  "employerPhone",
  "emergencyPhone",
  "additionalDriverAgentPhone",
]);

const SHRINK_TO_FIT_FIELDS = new Set([
  ...PHONE_FIELDS,
  "email",
  "dateOfBirth",
  "licenseExpiration",
  "licensePlate",
  "yearMake",
  "employer",
  "employerAddress",
  "customerPay",
  "daysRate",
  "city",
  "homeAddress",
  "renterName",
]);

/** Prefer a full value: shrink type (and compact phones) before ellipsis. */
function fitShrinkText(
  field: string,
  text: string,
  maxWidth: number | undefined,
  size: number,
  font: PDFFont,
): { text: string; size: number } {
  if (!maxWidth) return { text, size };
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return { text, size };

  let nextSize = size;
  const minSize = field === "customerPay" ? 3.5 : 4;
  while (nextSize > minSize && font.widthOfTextAtSize(text, nextSize) > maxWidth) {
    nextSize -= 0.25;
  }
  if (font.widthOfTextAtSize(text, nextSize) <= maxWidth) {
    return { text, size: nextSize };
  }

  let candidate = text;
  if (PHONE_FIELDS.has(field)) {
    const digits = text.replace(/\D/g, "");
    candidate =
      digits.length === 10
        ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
        : digits || text;
  } else {
    candidate = text.replace(/\s+/g, "");
  }

  nextSize = size;
  while (nextSize > minSize && font.widthOfTextAtSize(candidate, nextSize) > maxWidth) {
    nextSize -= 0.25;
  }
  if (font.widthOfTextAtSize(candidate, nextSize) <= maxWidth) {
    return { text: candidate, size: nextSize };
  }

  return { text: fitText(candidate, maxWidth, nextSize, font), size: nextSize };
}

async function stampSignature(
  doc: PDFDocument,
  page: PDFPage,
  signatureDataUrl: string,
  slot: SignatureSlot,
) {
  const base64 = signatureDataUrl.replace(/^data:image\/png;base64,/, "");
  const image = await doc.embedPng(base64ToBytes(base64));
  const dims = image.scale(1);
  const scale = Math.min(slot.width / dims.width, slot.height / dims.height);
  const width = dims.width * scale;
  const height = dims.height * scale;

  page.drawImage(image, {
    x: slot.x + (slot.width - width) / 2,
    y: slot.y,
    width,
    height,
  });
}

const MONEY_FIELDS = new Set([
  "prepaidRent",
  "deposit",
  "milesRateCents",
  "milesCharge",
  "hoursRate",
  "hoursCharge",
  "daysRate",
  "daysCharge",
  "weeksRate",
  "weeksCharge",
  "timeMileageTotal",
  "cdwPerDay",
  "cdwCharge",
  "vehicleLicenseFee",
  "sliPerDay",
  "sliCharge",
  "paiPecPerDay",
  "paiPecCharge",
  "gasCharge",
  "otherCharges",
  "subtotal",
  "totalTaxAmount",
  "totalAmountDue",
  "customerPay",
  "directBill1",
  "directBill2",
  "minusDeposit",
  "netDueRentalLocation",
  "netDueCustomer",
]);

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function formatMoney(n: number): string {
  return n.toFixed(2);
}

function parseFormDateTime(value: string): Date | null {
  const match = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2})?)?/);
  if (match) {
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      match[4] != null ? Number(match[4]) : 0,
      match[5] != null ? Number(match[5]) : 0,
    );
  }
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

/** Compact date + time for the Date/Time boxes (AM/PM marked separately). */
function formatAgreementDateTime(value: string): string | null {
  const date = parseFormDateTime(value);
  if (!date) return null;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${mm}/${dd}/${yy} ${hours}:${minutes}`;
}

function isAmFromValue(value: string): boolean | null {
  const date = parseFormDateTime(value);
  if (!date) return null;
  return date.getHours() < 12;
}

function formatFieldValue(
  field: string,
  value: string,
  fields?: Record<string, string>,
) {
  const dateTimeOnForm =
    field === "dateOut" ||
    field === "dateDue" ||
    field === "dateDueExt" ||
    field === "dateIn";

  if (dateTimeOnForm) {
    return formatAgreementDateTime(value) ?? value;
  }

  if (
    field === "licenseExpiration" ||
    field === "dateOfBirth" ||
    field === "additionalDriverExpiration" ||
    field === "additionalDriverDob"
  ) {
    const date = parseFormDateTime(value) ?? new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
    }
  }

  // Days @ $ blank: show rate × rental days; Charges column gets daysCharge total.
  if (field === "daysRate" && fields) {
    const rate = parseMoney(value);
    const days = rentalDaysFromFields(fields);
    if (rate != null && days != null && days > 0) {
      return `${formatMoney(rate)} × ${days}`;
    }
  }

  if (MONEY_FIELDS.has(field)) {
    const amount = parseMoney(value);
    if (amount != null) return formatMoney(amount);
  }

  return value;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function stampCoverageInitials(
  page: PDFPage,
  font: PDFFont,
  center: { x: number; y: number },
  initials: string,
) {
  const size = 7;
  const width = font.widthOfTextAtSize(initials, size);
  // Center on the underline; baseline on the rule so initials sit on the line.
  page.drawText(initials, {
    x: center.x - width / 2,
    y: center.y + 0.5,
    size,
    font,
    color: rgb(0.05, 0.1, 0.35),
  });
}

function stampFormFields(
  page: PDFPage,
  fields: Record<string, string>,
  font: PDFFont,
  pageIndex = 0,
) {
  const resolved = resolveAgreementFields(fields);
  // Optional fee lines — omit $0.00 so the Charges column stays clean for admins.
  const skipZeroIfOptional = new Set([
    "milesCharge",
    "hoursCharge",
    "weeksCharge",
    "gasCharge",
    "otherCharges",
  ]);

  for (const placement of AGREEMENT_FIELD_PLACEMENTS) {
    if (placement.page != null && placement.page !== pageIndex) continue;
    const raw = resolved[placement.field]?.trim();
    if (!raw) continue;
    // Top fee row: if deposit is set, skip prepaid so only one amount lands in Charges.
    if (placement.field === "prepaidRent" && resolved.deposit?.trim()) continue;
    if (skipZeroIfOptional.has(placement.field)) {
      const amount = parseMoney(raw);
      if (amount != null && Math.abs(amount) < 0.005) continue;
    }
    const baseSize = placement.size ?? 7;
    const formatted = formatFieldValue(placement.field, raw, resolved);
    const fitted = SHRINK_TO_FIT_FIELDS.has(placement.field)
      ? fitShrinkText(placement.field, formatted, placement.maxWidth, baseSize, font)
      : {
          text: fitText(formatted, placement.maxWidth, baseSize, font),
          size: baseSize,
        };
    page.drawText(fitted.text, {
      x: placement.x,
      y: placement.y,
      size: fitted.size,
      font,
      color: rgb(0.05, 0.1, 0.35),
    });
  }

  const initials = initialsFromName(resolved.renterName ?? "");
  if (initials) {
    for (const mark of COVERAGE_MARK_PLACEMENTS) {
      const value = resolved[mark.field]?.trim();
      if (value !== "Purchased" && value !== "Declined") continue;
      const point = value === "Purchased" ? mark.purchased : mark.declined;
      stampCoverageInitials(page, font, point, initials);
    }
  }

  for (const mark of DATETIME_AMPM_MARKS) {
    const raw = resolved[mark.field]?.trim();
    if (!raw) continue;
    const isAm = isAmFromValue(raw);
    if (isAm == null) continue;
    const point = isAm ? mark.am : mark.pm;
    page.drawText("X", {
      x: point.x,
      y: point.y,
      size: 6,
      font,
      color: rgb(0.05, 0.1, 0.35),
    });
  }
}

export async function buildSignedPdf(options: {
  form: FormTemplate;
  fields: Record<string, string>;
  page1SignatureDataUrl: string;
  page2SignatureDataUrl: string;
  page1AdditionalSignatureDataUrl?: string | null;
  page2AdditionalSignatureDataUrl?: string | null;
  signedAt: string;
  retainUntil: string;
  submissionId: string;
}): Promise<Uint8Array> {
  const {
    form,
    fields,
    page1SignatureDataUrl,
    page2SignatureDataUrl,
    page1AdditionalSignatureDataUrl,
    page2AdditionalSignatureDataUrl,
    signedAt,
    retainUntil,
    submissionId,
  } = options;

  const doc = await PDFDocument.load(await loadSourcePdf());

  if (doc.getPageCount() < 2) {
    throw new Error("Source rental agreement PDF must include two pages.");
  }

  const page1 = doc.getPage(0);
  const page2 = doc.getPage(1);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Fill blanks on the agreement pages themselves.
  stampFormFields(page1, fields, font, 0);
  stampFormFields(page2, fields, font, 1);

  await stampSignature(
    doc,
    page1,
    page1SignatureDataUrl,
    PAGE_SIGNATURE_SLOTS[1].renter,
  );
  await stampSignature(
    doc,
    page2,
    page2SignatureDataUrl,
    PAGE_SIGNATURE_SLOTS[2].renter,
  );

  if (page1AdditionalSignatureDataUrl) {
    await stampSignature(
      doc,
      page1,
      page1AdditionalSignatureDataUrl,
      PAGE_SIGNATURE_SLOTS[1].additional,
    );
  }
  if (page2AdditionalSignatureDataUrl) {
    await stampSignature(
      doc,
      page2,
      page2AdditionalSignatureDataUrl,
      PAGE_SIGNATURE_SLOTS[2].additional,
    );
  }

  // Short audit page only — filled details already appear on the form pages.
  let page = doc.addPage([612, 792]);
  let y = 750;
  const left = 48;

  const draw = (
    text: string,
    size = 11,
    opts?: { bold?: boolean; color?: ReturnType<typeof rgb> },
  ) => {
    page.drawText(text.slice(0, 110), {
      x: left,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: opts?.color ?? rgb(0.1, 0.1, 0.09),
    });
    y -= size + 6;
  };

  draw(`${SITE_NAME_SHORT.toUpperCase()} — AUDIT / RETENTION`, 11, {
    bold: true,
  });
  draw(form.title, 16, { bold: true });
  draw(`${SITE_NAME} · Version ${form.version}`, 10, {
    color: rgb(0.35, 0.35, 0.32),
  });
  draw(
    "Customer details were written onto the agreement pages above.",
    9,
    { color: rgb(0.45, 0.32, 0.08) },
  );
  y -= 8;
  draw(`Submission ID: ${submissionId}`, 10);
  draw(`Signed at (UTC): ${signedAt}`, 10);
  draw(`Retain until (UTC): ${retainUntil}`, 10);
  draw(`Retention policy: ${form.retentionYears} years from signature date`, 10);
  draw("Page 1: renter signed on the Renter line.", 10);
  draw("Page 2: renter signed on the Renter line.", 10);
  if (page1AdditionalSignatureDataUrl || page2AdditionalSignatureDataUrl) {
    draw("Additional driver signed on the Additional Driver line.", 10);
  }
  if (fields.remarks?.trim()) {
    y -= 6;
    draw("Notes", 12, { bold: true });
    for (const line of wrapText(fields.remarks, 90)) {
      draw(line, 9);
    }
  }
  y -= 6;
  draw("ALL CHARGES SUBJECT TO FINAL AUDIT.", 10, { bold: true });

  return doc.save({ useObjectStreams: false });
}

/** Field-stamped agreement only — used for the pre-sign customer preview. */
export async function buildFilledAgreementPdf(options: {
  fields: Record<string, string>;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.load(await loadSourcePdf());

  if (doc.getPageCount() < 2) {
    throw new Error("Source rental agreement PDF must include two pages.");
  }

  const font = await doc.embedFont(StandardFonts.Helvetica);
  stampFormFields(doc.getPage(0), options.fields, font, 0);
  stampFormFields(doc.getPage(1), options.fields, font, 1);
  return doc.save({ useObjectStreams: false });
}
