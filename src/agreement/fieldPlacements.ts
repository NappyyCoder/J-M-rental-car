/**
 * Text fill positions for jm-rental-agreement-source.pdf.
 * Coordinates are pdf-lib points, origin bottom-left (595×842).
 * Tuned from OCR label edges + visual stamp/diff passes.
 */
export type FieldPlacement = {
  field: string;
  x: number;
  y: number;
  size?: number;
  maxWidth?: number;
  /** 0-based page index; omit to stamp on every page. */
  page?: number;
};

export const AGREEMENT_FIELD_PLACEMENTS: FieldPlacement[] = [
  // Left column: values centered in each cell (between top labels and bottom rule).
  // Bottom rules: renter 582 · address 567 · license 552 · insurance 537 ·
  // employer 522 · emp address 507 · emergency ~492.

  // Renter / Phone / EMAIL
  { field: "renterName", x: 96, y: 588, size: 8, maxWidth: 118 },
  { field: "phone", x: 222, y: 588, size: 5.5, maxWidth: 52 },
  { field: "email", x: 298, y: 588, size: 4.75, maxWidth: 58 },

  // Home Address / City / State / Zip — City cell is tiny; put value under the label.
  { field: "homeAddress", x: 98, y: 572, size: 6.5, maxWidth: 150 },
  { field: "city", x: 260, y: 570, size: 5, maxWidth: 26 },
  { field: "state", x: 304, y: 572, size: 7, maxWidth: 18 },
  { field: "zip", x: 338, y: 572, size: 7, maxWidth: 16 },

  // Driver's License # / State / Exp. Date / DOB
  { field: "driversLicense", x: 104, y: 559, size: 7, maxWidth: 100 },
  { field: "licenseState", x: 226, y: 559, size: 7, maxWidth: 26 },
  { field: "licenseExpiration", x: 290, y: 557, size: 5.25, maxWidth: 32 },
  { field: "dateOfBirth", x: 338, y: 557, size: 5, maxWidth: 28 },

  // Insurance
  { field: "insuranceCompany", x: 112, y: 544, size: 7, maxWidth: 90 },
  { field: "policyNumber", x: 228, y: 544, size: 7, maxWidth: 36 },
  { field: "insuranceAgent", x: 278, y: 544, size: 6.5, maxWidth: 32 },
  { field: "insurancePhone", x: 328, y: 542, size: 4.5, maxWidth: 32 },

  // Employer / Title
  { field: "employer", x: 88, y: 529, size: 7, maxWidth: 165 },
  { field: "jobTitle", x: 274, y: 529, size: 7, maxWidth: 70 },

  // Employer's Address / Phone / Supervisor
  { field: "employerAddress", x: 112, y: 514, size: 7, maxWidth: 145 },
  { field: "employerPhone", x: 278, y: 514, size: 4.75, maxWidth: 40 },
  { field: "supervisor", x: 328, y: 514, size: 6.5, maxWidth: 28 },

  // Emergency Contact / Phone
  { field: "emergencyContact", x: 112, y: 499, size: 7, maxWidth: 195 },
  { field: "emergencyPhone", x: 322, y: 499, size: 4.75, maxWidth: 34 },

  // Vehicle column — labels top-left; values in cell body on the same baselines as left column.
  { field: "yearMake", x: 380, y: 586, size: 6, maxWidth: 68 },
  { field: "vehicleNumber", x: 462, y: 586, size: 7, maxWidth: 75 },
  { field: "model", x: 390, y: 571, size: 7, maxWidth: 34 },
  { field: "tag", x: 428, y: 571, size: 6.5, maxWidth: 20 },
  { field: "licensePlate", x: 462, y: 571, size: 7, maxWidth: 75 },
  { field: "vin", x: 400, y: 559, size: 6, maxWidth: 70 },
  { field: "odometerOut", x: 400, y: 538, size: 7, maxWidth: 48 },
  { field: "fuelOut", x: 529, y: 543, size: 8, maxWidth: 12 },
  // Date/Time boxes — under the Date/Time label, left side of the blank.
  { field: "dateDue", x: 455, y: 510, size: 5.25, maxWidth: 72 },
  { field: "dateDueExt", x: 455, y: 495, size: 5.25, maxWidth: 72 },
  { field: "dateOut", x: 455, y: 480, size: 5.25, maxWidth: 72 },
  // dateIn stays blank at checkout; staff fills it on return (office-use field).
  { field: "dateIn", x: 455, y: 465, size: 5.25, maxWidth: 72 },
  { field: "milesAllowed", x: 412, y: 493, size: 7, maxWidth: 40 },

  // Additional driver — bottom rules ~461.5 / 446.5
  { field: "additionalDriverName", x: 104, y: 464, size: 7, maxWidth: 98 },
  { field: "additionalDriverLicense", x: 230, y: 464, size: 6, maxWidth: 22 },
  { field: "additionalDriverState", x: 272, y: 464, size: 7, maxWidth: 12 },
  { field: "additionalDriverExpiration", x: 300, y: 464, size: 5.5, maxWidth: 22 },
  { field: "additionalDriverDob", x: 328, y: 464, size: 5, maxWidth: 28 },
  { field: "additionalDriverInsurance", x: 112, y: 449, size: 6, maxWidth: 88 },
  { field: "additionalDriverPolicy", x: 246, y: 449, size: 6, maxWidth: 28 },
  { field: "additionalDriverAgent", x: 294, y: 449, size: 6, maxWidth: 20 },
  { field: "additionalDriverAgentPhone", x: 320, y: 449, size: 5, maxWidth: 36 },

  // Fees — amounts go under the "Charges" header (middle column ≈ 451–494).
  // Deposit sits in the top row’s right box beside the printed "Deposit" label.
  { field: "prepaidRent", x: 508, y: 451, size: 7, maxWidth: 28 },
  { field: "deposit", x: 508, y: 451, size: 7, maxWidth: 28 },
  { field: "milesCharge", x: 458, y: 421, size: 7, maxWidth: 32 },
  { field: "hoursCharge", x: 458, y: 406, size: 7, maxWidth: 32 },
  // Days @ $ ____ → "50.00 × 4" in Rates; days charge total in Charges to the right.
  { field: "daysRate", x: 418, y: 391, size: 6, maxWidth: 38 },
  { field: "daysCharge", x: 470, y: 391, size: 7, maxWidth: 32 },
  { field: "weeksCharge", x: 458, y: 376, size: 7, maxWidth: 32 },
  // timeMileageTotal intentionally left blank on the paper (staff totals if needed).
  { field: "cdwCharge", x: 458, y: 346, size: 7, maxWidth: 32 },
  { field: "otherCharges", x: 458, y: 331, size: 7, maxWidth: 32 },
  { field: "vehicleLicenseFee", x: 458, y: 316, size: 7, maxWidth: 32 },
  { field: "subtotal", x: 458, y: 301, size: 7, maxWidth: 32 },
  { field: "totalTaxAmount", x: 458, y: 286, size: 7, maxWidth: 32 },
  { field: "gasCharge", x: 458, y: 255, size: 7, maxWidth: 32 },
  { field: "subtotal", x: 458, y: 240, size: 7, maxWidth: 32 },
  { field: "sliCharge", x: 458, y: 210, size: 7, maxWidth: 32 },
  { field: "paiPecCharge", x: 458, y: 194, size: 7, maxWidth: 32 },
  { field: "subtotal", x: 458, y: 164, size: 7, maxWidth: 32 },
  { field: "totalAmountDue", x: 458, y: 148, size: 8, maxWidth: 32 },
  // Customer Pay on the printed blank after the label (page 2 scan drifts ~1.5pt up).
  // Customer Pay underline ~397–412 @ y≈136 (p1) / ~398–413 @ y≈137.7 (p2).
  { field: "customerPay", x: 400, y: 136.2, size: 4.5, maxWidth: 14, page: 0 },
  { field: "customerPay", x: 400, y: 137.9, size: 4.5, maxWidth: 14, page: 1 },
  { field: "minusDeposit", x: 458, y: 118, size: 7, maxWidth: 32 },
  { field: "netDueRentalLocation", x: 458, y: 103, size: 7, maxWidth: 32 },
  { field: "netDueCustomer", x: 458, y: 88, size: 7, maxWidth: 32 },
];

/**
 * Coverage initial blanks — CENTER of each printed underline (scan-measured).
 * Stamped with the renter’s initials (from renterName), not an “X”.
 */
export const COVERAGE_MARK_PLACEMENTS: {
  field: string;
  purchased: { x: number; y: number };
  declined: { x: number; y: number };
}[] = [
  { field: "cdw", purchased: { x: 208, y: 392 }, declined: { x: 208, y: 347 } },
  { field: "paiPec", purchased: { x: 205, y: 281 }, declined: { x: 205, y: 251 } },
  { field: "sli", purchased: { x: 204, y: 221 }, declined: { x: 204, y: 160 } },
];

/** AM/PM stacked labels on Date/Time rows — mark the matching one. */
export const DATETIME_AMPM_MARKS: {
  field: string;
  am: { x: number; y: number };
  pm: { x: number; y: number };
}[] = [
  { field: "dateDue", am: { x: 545, y: 516 }, pm: { x: 545, y: 508 } },
  { field: "dateDueExt", am: { x: 545, y: 501 }, pm: { x: 545, y: 493 } },
  { field: "dateOut", am: { x: 545, y: 486 }, pm: { x: 545, y: 478 } },
  { field: "dateIn", am: { x: 545, y: 471 }, pm: { x: 545, y: 463 } },
];
