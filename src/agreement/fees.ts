/** Client-safe fee math shared by the form UI and PDF stamping. */

/**
 * Virginia rental tax applied on taxable rental proceeds.
 * Rate set to 6.0% per J & M / Virginia Beach desk guidance.
 * @see https://www.tax.virginia.gov/motor-vehicle-rental-tax-and-fee
 */
export const VA_RENTAL_TAX = {
  /** Desk-confirmed combined rate */
  combinedRate: 0.06,
  localityName: "Virginia Beach",
  localityCode: "51810",
} as const;

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function formatMoney(n: number): string {
  return n.toFixed(2);
}

function sumMoney(...values: Array<number | null>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

/** Whole rental days from out → due (min 1 when both dates exist). */
export function rentalDaysFromFields(fields: Record<string, string>): number | null {
  const out = fields.dateOut?.trim();
  const due = fields.dateDue?.trim();
  if (!out || !due) return null;
  const start = new Date(out);
  const end = new Date(due);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const ms = end.getTime() - start.getTime();
  if (ms <= 0) return 1;
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

const RATE_DRIVEN_CHARGES: Record<string, string> = {
  daysRate: "daysCharge",
  cdwPerDay: "cdwCharge",
  paiPecPerDay: "paiPecCharge",
  sliPerDay: "sliCharge",
};

const CHARGE_CLEARS_RATE: Record<string, string> = {
  cdwCharge: "cdwPerDay",
  paiPecCharge: "paiPecPerDay",
  sliCharge: "sliPerDay",
};

/**
 * Apply one field edit, then refresh derived fee totals.
 * Daily rate × booking days always drives the days charge.
 * Coverage per-day rates work the same way.
 */
export function applyFeeFieldChange(
  fields: Record<string, string>,
  name: string,
  value: string,
): Record<string, string> {
  const next: Record<string, string> = { ...fields, [name]: value };
  if (CHARGE_CLEARS_RATE[name]) {
    next[CHARGE_CLEARS_RATE[name]] = "";
  }
  return resolveAgreementFields(next);
}

/**
 * Fill derived fee totals from charge lines, booking dates, and VA tax.
 */
export function resolveAgreementFields(
  fields: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = { ...fields };
  const money = (key: string) => parseMoney(out[key]);
  const days = rentalDaysFromFields(out);

  // Rate × rental days → charge (dates from Vehicle step drive this).
  if (days != null) {
    for (const [rateKey, chargeKey] of Object.entries(RATE_DRIVEN_CHARGES)) {
      const rate = money(rateKey);
      if (rate == null || rate <= 0) continue;
      if (rateKey === "cdwPerDay" && out.cdw !== "Purchased") continue;
      if (rateKey === "paiPecPerDay" && out.paiPec !== "Purchased") continue;
      if (rateKey === "sliPerDay" && out.sli !== "Purchased") continue;
      out[chargeKey] = formatMoney(rate * days);
    }
  }

  if (out.cdw === "Declined") {
    out.cdwCharge = "";
  }
  if (out.paiPec === "Declined") {
    out.paiPecCharge = "";
  }
  if (out.sli === "Declined") {
    out.sliCharge = "";
  }

  const timeMileage = sumMoney(
    money("daysCharge"),
    money("weeksCharge"),
    money("hoursCharge"),
    money("milesCharge"),
  );
  out.timeMileageTotal =
    timeMileage > 0 || money("daysCharge") != null ? formatMoney(timeMileage) : "";

  // Taxable rental proceeds (exclude typical VA exclusions: refueling / pass-throughs).
  const taxableBase = sumMoney(
    money("timeMileageTotal") ?? timeMileage,
    money("cdwCharge"),
    money("sliCharge"),
    money("paiPecCharge"),
  );

  const subtotal = sumMoney(
    taxableBase,
    money("vehicleLicenseFee"),
    money("gasCharge"),
    money("otherCharges"),
  );
  out.subtotal = subtotal > 0 || timeMileage > 0 ? formatMoney(subtotal) : "";

  // Virginia rental tax (6%) on taxable rental proceeds (auto — not staff-entered).
  const taxAmount =
    taxableBase > 0 ? Math.round(taxableBase * VA_RENTAL_TAX.combinedRate * 100) / 100 : 0;
  out.totalTaxAmount = taxAmount > 0 ? formatMoney(taxAmount) : taxableBase > 0 ? "0.00" : "";

  const totalDue = sumMoney(money("subtotal") ?? subtotal, money("totalTaxAmount") ?? taxAmount);
  out.totalAmountDue = totalDue > 0 || subtotal > 0 ? formatMoney(totalDue) : "";

  const deposit = money("deposit");
  out.minusDeposit = deposit != null ? formatMoney(deposit) : "";
  out.customerPay = out.totalAmountDue;

  const customerPay = money("customerPay") ?? totalDue;
  const depositApplied = money("minusDeposit") ?? deposit ?? 0;
  const balance = customerPay - depositApplied;
  if (out.totalAmountDue || deposit != null) {
    if (balance > 0.009) {
      out.netDueRentalLocation = formatMoney(balance);
      out.netDueCustomer = "0.00";
    } else if (balance < -0.009) {
      out.netDueRentalLocation = "0.00";
      out.netDueCustomer = formatMoney(Math.abs(balance));
    } else {
      out.netDueRentalLocation = "0.00";
      out.netDueCustomer = "0.00";
    }
  } else {
    out.netDueRentalLocation = "";
    out.netDueCustomer = "";
  }

  return out;
}

export type FeeSummary = {
  rentalDays: number | null;
  daysRate: string;
  daysCharge: string;
  timeMileageTotal: string;
  taxableBase: string;
  taxAmount: string;
  taxLabel: string;
  subtotal: string;
  totalAmountDue: string;
  customerPay: string;
  minusDeposit: string;
  netDueRentalLocation: string;
  netDueCustomer: string;
};

export function feeSummaryFromFields(fields: Record<string, string>): FeeSummary {
  const resolved = resolveAgreementFields(fields);
  const money = (key: string) => parseMoney(resolved[key]);
  const timeMileage = money("timeMileageTotal") ?? 0;
  const taxableBase = sumMoney(
    timeMileage,
    money("cdwCharge"),
    money("sliCharge"),
    money("paiPecCharge"),
  );
  return {
    rentalDays: rentalDaysFromFields(resolved),
    daysRate: resolved.daysRate?.trim()
      ? formatMoney(money("daysRate") ?? 0)
      : "0.00",
    daysCharge: resolved.daysCharge || "0.00",
    timeMileageTotal: resolved.timeMileageTotal || "0.00",
    taxableBase: formatMoney(taxableBase),
    taxAmount: resolved.totalTaxAmount || "0.00",
    taxLabel: `VA rental tax ${(VA_RENTAL_TAX.combinedRate * 100).toFixed(1)}%`,
    subtotal: resolved.subtotal || "0.00",
    totalAmountDue: resolved.totalAmountDue || "0.00",
    customerPay: resolved.customerPay || "0.00",
    minusDeposit: resolved.minusDeposit || "0.00",
    netDueRentalLocation: resolved.netDueRentalLocation || "0.00",
    netDueCustomer: resolved.netDueCustomer || "0.00",
  };
}
