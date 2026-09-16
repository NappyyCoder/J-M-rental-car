/** Customer-facing rental form validation (client + API). */

export const MIN_DRIVER_AGE = 21;

const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]);

function parseDateOnly(value?: string): Date | null {
  if (!value?.trim()) return null;
  // date input: YYYY-MM-DD
  const dayOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (dayOnly) {
    const date = new Date(
      Number(dayOnly[1]),
      Number(dayOnly[2]) - 1,
      Number(dayOnly[3]),
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function ageOnDate(dob: Date, on: Date): number {
  let age = on.getFullYear() - dob.getFullYear();
  const month = on.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && on.getDate() < dob.getDate())) age -= 1;
  return age;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function looksLikePhone(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

function looksLikeZip(value: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

function looksLikeState(value: string): boolean {
  return US_STATE_CODES.has(value.trim().toUpperCase());
}

function looksLikeLicenseNumber(value: string): boolean {
  const cleaned = value.trim().toUpperCase().replace(/[\s-]/g, "");
  // US licenses vary widely; require a plausible alphanumeric ID.
  return /^[A-Z0-9]{4,20}$/.test(cleaned);
}

function looksLikePlate(value: string): boolean {
  const cleaned = value.trim().toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z0-9]{2,10}$/.test(cleaned);
}

function looksLikeVin(value: string): boolean {
  const cleaned = value.trim().toUpperCase().replace(/\s+/g, "");
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned);
}

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function hasAny(fields: Record<string, string>, names: string[]): boolean {
  return names.some((name) => fields[name]?.trim());
}

export type FieldValidationOptions = {
  /** When set, only validate these field names (plus cross-field rules that touch them). */
  onlyFields?: Set<string> | string[];
};

function includesField(
  only: Set<string> | undefined,
  ...names: string[]
): boolean {
  if (!only) return true;
  return names.some((name) => only.has(name));
}

/**
 * Returns the first validation error message, or null when the values look OK.
 */
export function validateRentalFields(
  fields: Record<string, string>,
  options: FieldValidationOptions = {},
): string | null {
  const only = options.onlyFields
    ? options.onlyFields instanceof Set
      ? options.onlyFields
      : new Set(options.onlyFields)
    : undefined;

  const asOf = parseDateOnly(fields.dateOut) ?? new Date();
  const rentalEnd = parseDateOnly(fields.dateDue) ?? asOf;

  // --- Contact ---
  if (includesField(only, "renterName") && fields.renterName?.trim()) {
    const parts = fields.renterName.trim().split(/\s+/);
    if (parts.length < 2 || fields.renterName.trim().length < 3) {
      return "Enter your full name (first and last).";
    }
  }

  if (includesField(only, "email") && fields.email?.trim()) {
    if (!looksLikeEmail(fields.email)) {
      return "Enter a valid email address.";
    }
  }

  if (includesField(only, "phone") && fields.phone?.trim()) {
    if (!looksLikePhone(fields.phone)) {
      return "Enter a valid 10-digit phone number.";
    }
  }

  if (includesField(only, "state") && fields.state?.trim()) {
    if (!looksLikeState(fields.state)) {
      return "Enter a valid 2-letter U.S. state code (for example VA).";
    }
  }

  if (includesField(only, "zip") && fields.zip?.trim()) {
    if (!looksLikeZip(fields.zip)) {
      return "Enter a valid ZIP code (12345 or 12345-6789).";
    }
  }

  // --- Driver license / DOB ---
  if (includesField(only, "driversLicense") && fields.driversLicense?.trim()) {
    if (!looksLikeLicenseNumber(fields.driversLicense)) {
      return "Driver’s license number should be 4–20 letters or numbers (no special characters).";
    }
  }

  if (includesField(only, "licenseState") && fields.licenseState?.trim()) {
    if (!looksLikeState(fields.licenseState)) {
      return "License state must be a valid 2-letter U.S. code (for example VA).";
    }
  }

  if (includesField(only, "dateOfBirth") && fields.dateOfBirth?.trim()) {
    const dob = parseDateOnly(fields.dateOfBirth);
    if (!dob) return "Enter a valid date of birth.";
    if (dob > startOfDay(new Date())) {
      return "Date of birth cannot be in the future.";
    }
    const age = ageOnDate(dob, startOfDay(asOf));
    if (age < MIN_DRIVER_AGE) {
      return `Drivers must be at least ${MIN_DRIVER_AGE} years old. Absolutely no drivers under ${MIN_DRIVER_AGE}.`;
    }
    if (age > 100) {
      return "Please check the date of birth — that age doesn’t look right.";
    }
  }

  if (includesField(only, "licenseExpiration") && fields.licenseExpiration?.trim()) {
    const exp = parseDateOnly(fields.licenseExpiration);
    if (!exp) return "Enter a valid license expiration date.";
    if (startOfDay(exp) < startOfDay(rentalEnd)) {
      return "Driver’s license must still be valid through the rental due-back date.";
    }
  }

  if (includesField(only, "insurancePhone") && fields.insurancePhone?.trim()) {
    if (!looksLikePhone(fields.insurancePhone)) {
      return "Enter a valid insurance agent phone number.";
    }
  }

  // --- Emergency / employer phones ---
  if (includesField(only, "emergencyPhone") && fields.emergencyPhone?.trim()) {
    if (!looksLikePhone(fields.emergencyPhone)) {
      return "Enter a valid emergency contact phone number.";
    }
  }
  if (includesField(only, "employerPhone") && fields.employerPhone?.trim()) {
    if (!looksLikePhone(fields.employerPhone)) {
      return "Enter a valid employer phone number.";
    }
  }

  if (
    includesField(only, "emergencyContact", "renterName") &&
    fields.emergencyContact?.trim() &&
    fields.renterName?.trim()
  ) {
    if (
      fields.emergencyContact.trim().toLowerCase() ===
      fields.renterName.trim().toLowerCase()
    ) {
      return "Emergency contact should be someone other than the renter.";
    }
  }

  // --- Additional driver (if started, require the core license details) ---
  const additionalStarted = hasAny(fields, [
    "additionalDriverName",
    "additionalDriverLicense",
    "additionalDriverState",
    "additionalDriverExpiration",
    "additionalDriverDob",
  ]);

  if (additionalStarted && (!only || includesField(only,
    "additionalDriverName",
    "additionalDriverLicense",
    "additionalDriverState",
    "additionalDriverExpiration",
    "additionalDriverDob",
  ))) {
    if (!fields.additionalDriverName?.trim()) {
      return "Enter the additional driver’s full name, or clear the other additional-driver fields.";
    }
    if (!fields.additionalDriverLicense?.trim()) {
      return "Enter the additional driver’s license number.";
    }
    if (!looksLikeLicenseNumber(fields.additionalDriverLicense)) {
      return "Additional driver’s license number should be 4–20 letters or numbers.";
    }
    if (!fields.additionalDriverState?.trim()) {
      return "Enter the additional driver’s license state.";
    }
    if (!looksLikeState(fields.additionalDriverState)) {
      return "Additional driver’s license state must be a valid 2-letter U.S. code.";
    }
    if (!fields.additionalDriverDob?.trim()) {
      return "Enter the additional driver’s date of birth.";
    }
    const addDob = parseDateOnly(fields.additionalDriverDob);
    if (!addDob) return "Enter a valid additional-driver date of birth.";
    if (addDob > startOfDay(new Date())) {
      return "Additional driver’s date of birth cannot be in the future.";
    }
    const addAge = ageOnDate(addDob, startOfDay(asOf));
    if (addAge < MIN_DRIVER_AGE) {
      return `Additional drivers must also be at least ${MIN_DRIVER_AGE} years old.`;
    }
    if (!fields.additionalDriverExpiration?.trim()) {
      return "Enter the additional driver’s license expiration date.";
    }
    const addExp = parseDateOnly(fields.additionalDriverExpiration);
    if (!addExp) return "Enter a valid additional-driver license expiration.";
    if (startOfDay(addExp) < startOfDay(rentalEnd)) {
      return "Additional driver’s license must still be valid through the rental due-back date.";
    }
  }

  if (
    includesField(only, "additionalDriverAgentPhone") &&
    fields.additionalDriverAgentPhone?.trim()
  ) {
    if (!looksLikePhone(fields.additionalDriverAgentPhone)) {
      return "Enter a valid additional-driver agent phone number.";
    }
  }

  // --- Vehicle / dates ---
  if (includesField(only, "licensePlate") && fields.licensePlate?.trim()) {
    if (!looksLikePlate(fields.licensePlate)) {
      return "Enter a valid license plate (2–10 letters or numbers).";
    }
  }

  if (includesField(only, "vin") && fields.vin?.trim()) {
    if (!looksLikeVin(fields.vin)) {
      return "VIN must be exactly 17 characters (letters/numbers; no I, O, or Q).";
    }
  }

  if (includesField(only, "odometerOut") && fields.odometerOut?.trim()) {
    const odo = Number(fields.odometerOut);
    if (!Number.isFinite(odo) || odo < 0) {
      return "Odometer out must be zero or a positive number.";
    }
    if (odo > 1_000_000) {
      return "Please check the odometer reading — that number looks too high.";
    }
  }

  if (includesField(only, "milesAllowed") && fields.milesAllowed?.trim()) {
    const miles = Number(fields.milesAllowed);
    if (!Number.isFinite(miles) || miles < 0) {
      return "Miles allowed must be zero or a positive number.";
    }
  }

  if (includesField(only, "dateOut", "dateDue")) {
    const out = parseDateOnly(fields.dateOut);
    const due = parseDateOnly(fields.dateDue);
    if (fields.dateOut?.trim() && !out) {
      return "Enter a valid date / time out.";
    }
    if (fields.dateDue?.trim() && !due) {
      return "Enter a valid date / time due back.";
    }
    if (out && due && due.getTime() <= out.getTime()) {
      return "Due-back date/time must be after the date/time out.";
    }
  }

  if (includesField(only, "dateDueExt", "dateDue", "dateOut")) {
    const ext = parseDateOnly(fields.dateDueExt);
    if (fields.dateDueExt?.trim()) {
      if (!ext) return "Enter a valid extended due date / time.";
      const due = parseDateOnly(fields.dateDue) ?? parseDateOnly(fields.dateOut);
      if (due && ext.getTime() <= due.getTime()) {
        return "Extended due date/time must be after the original due-back time.";
      }
    }
  }

  // --- Money / rates (non-negative) ---
  const moneyFields: Array<{ name: string; label: string }> = [
    { name: "daysRate", label: "Daily rate" },
    { name: "deposit", label: "Deposit" },
    { name: "prepaidRent", label: "Prepaid rent" },
    { name: "vehicleLicenseFee", label: "Vehicle license fee" },
    { name: "cdwPerDay", label: "CDW rate" },
    { name: "cdwCharge", label: "CDW charge" },
    { name: "paiPecPerDay", label: "PAI / PEC rate" },
    { name: "paiPecCharge", label: "PAI / PEC charge" },
    { name: "sliPerDay", label: "SLI rate" },
    { name: "sliCharge", label: "SLI charge" },
    { name: "weeksRate", label: "Weekly rate" },
    { name: "weeksCharge", label: "Weeks charge" },
    { name: "hoursRate", label: "Hours rate" },
    { name: "hoursCharge", label: "Hours charge" },
    { name: "milesCharge", label: "Miles charge" },
    { name: "gasCharge", label: "Gas charge" },
    { name: "otherCharges", label: "Other charges" },
  ];

  for (const field of moneyFields) {
    if (!includesField(only, field.name)) continue;
    const raw = fields[field.name]?.trim();
    if (!raw) continue;
    const amount = parseMoney(raw);
    if (amount == null) {
      return `${field.label} must be a valid dollar amount.`;
    }
    if (amount < 0) {
      return `${field.label} cannot be negative.`;
    }
  }

  // Purchased coverage should have a rate (or charge) from the desk.
  if (includesField(only, "cdw", "cdwPerDay", "cdwCharge") && fields.cdw === "Purchased") {
    const rate = parseMoney(fields.cdwPerDay);
    const charge = parseMoney(fields.cdwCharge);
    if ((rate == null || rate <= 0) && (charge == null || charge <= 0)) {
      return "CDW was purchased — enter the CDW daily rate from J & M.";
    }
  }
  if (
    includesField(only, "paiPec", "paiPecPerDay", "paiPecCharge") &&
    fields.paiPec === "Purchased"
  ) {
    const rate = parseMoney(fields.paiPecPerDay);
    const charge = parseMoney(fields.paiPecCharge);
    if ((rate == null || rate <= 0) && (charge == null || charge <= 0)) {
      return "PAI / PEC was purchased — enter the daily rate from J & M.";
    }
  }
  if (includesField(only, "sli", "sliPerDay", "sliCharge") && fields.sli === "Purchased") {
    const rate = parseMoney(fields.sliPerDay);
    const charge = parseMoney(fields.sliCharge);
    if ((rate == null || rate <= 0) && (charge == null || charge <= 0)) {
      return "SLI was purchased — enter the SLI daily rate from J & M.";
    }
  }

  return null;
}

/** HTML input hints for common fields (min/max/pattern/inputMode). */
export function inputConstraintsForField(name: string): Record<string, string> {
  const today = new Date();
  const maxDob = new Date(
    today.getFullYear() - MIN_DRIVER_AGE,
    today.getMonth(),
    today.getDate(),
  );
  const maxDobStr = maxDob.toISOString().slice(0, 10);
  const minExpStr = today.toISOString().slice(0, 10);
  const minDobStr = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);

  switch (name) {
    case "dateOfBirth":
    case "additionalDriverDob":
      return { max: maxDobStr, min: minDobStr };
    case "licenseExpiration":
    case "additionalDriverExpiration":
      return { min: minExpStr };
    case "state":
    case "licenseState":
    case "additionalDriverState":
      return { maxLength: "2", pattern: "[A-Za-z]{2}", title: "2-letter state code" };
    case "zip":
      return {
        pattern: "\\d{5}(-\\d{4})?",
        inputMode: "numeric",
        title: "12345 or 12345-6789",
      };
    case "phone":
    case "emergencyPhone":
    case "employerPhone":
    case "insurancePhone":
    case "additionalDriverAgentPhone":
      return { inputMode: "tel", autoComplete: "tel" };
    case "email":
      return { autoComplete: "email", inputMode: "email" };
    case "driversLicense":
    case "additionalDriverLicense":
      return {
        minLength: "4",
        maxLength: "20",
        pattern: "[A-Za-z0-9][A-Za-z0-9\\s-]{3,19}",
        title: "4–20 letters or numbers",
      };
    case "odometerOut":
    case "milesAllowed":
      return { min: "0", step: "1", inputMode: "numeric" };
    case "vin":
      return {
        minLength: "17",
        maxLength: "17",
        pattern: "[A-HJ-NPR-Za-hj-npr-z0-9]{17}",
        title: "17-character VIN",
      };
    default:
      return {};
  }
}
