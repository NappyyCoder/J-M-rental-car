export type FormFieldOption = {
  label: string;
  value: string;
  description?: string;
};

export type FormField = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "time"
    | "datetime-local"
    | "number"
    | "textarea"
    | "select"
    | "choice";
  required: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  description?: string;
  helpText?: string;
  officeUse?: boolean;
  /** Hidden behind “More details” so the main step stays short. */
  secondary?: boolean;
  /** Only show when another field has this value. */
  showWhen?: { field: string; value: string };
};

export type FormSection = {
  title: string;
  description?: string;
  fields: FormField[];
};

export type FormTemplate = {
  slug: string;
  title: string;
  version: string;
  description: string;
  body: string[];
  sections: FormSection[];
  retentionYears: number;
};

export const FORMS: FormTemplate[] = [
  {
    slug: "rental-agreement",
    title: "J & M Rental Agreement",
    version: "2026.08-va-tax-6",
    description:
      "Digital J & M rental agreement — vehicle, coverage, fees, and signatures.",
    retentionYears: 3,
    body: [
      "ABSOLUTELY NO DRIVERS UNDER 21 YEARS OF AGE.",
      "This agreement offers, for an additional charge, collision damage waiver to cover your responsibility for damage to the vehicle before deciding whether to purchase the collision damage waiver, you may wish to determine whether your own vehicle insurance affords you coverage for damage to the rental vehicle and the amount of the deductible under your insurance coverage. The purchase of collision damage waiver is not mandatory and may be waived.",
      "Purchase of optional insurance products is not required to rent a vehicle from us. Our optional insurance products may duplicate coverage already available to you under your personal auto, personal liability, or other sources of coverage.",
      "You understand that you are not an additional insured under our coverage for collision, upset and comprehensive damage to the vehicle. The vehicle may be driven or used only in the State of Virginia or within the radius of the renting location, or as otherwise permitted in writing. In case of accident, contact 911, then contact our office immediately.",
      "By initialing the coverage options below, you agree to purchase or decline Collision Damage Waiver, Personal Accident Insurance / Personal Effects Coverage, and Supplemental Liability Insurance, subject to the exclusions and terms described in the applicable brochure. By signing below, you agree to the Rental Agreement, the Terms & Conditions on the back side of the original agreement, and any signed addenda.",
    ],
    sections: [
      {
        title: "Your contact information",
        fields: [
          { name: "renterName", label: "Renter (print)", type: "text", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "homeAddress", label: "Home address", type: "text", required: true },
          { name: "city", label: "City", type: "text", required: true },
          { name: "state", label: "State", type: "text", required: true },
          { name: "zip", label: "Zip", type: "text", required: true },
        ],
      },
      {
        title: "Driver license and insurance",
        description: "Your license details are required. Insurance details are optional.",
        fields: [
          {
            name: "driversLicense",
            label: "Driver's license #",
            type: "text",
            required: true,
            helpText: "Letters and numbers only, exactly as printed on your license (4–20 characters).",
          },
          { name: "licenseState", label: "License state", type: "text", required: true, placeholder: "VA", helpText: "2-letter state code." },
          {
            name: "licenseExpiration",
            label: "License expiration",
            type: "date",
            required: true,
            helpText: "Must still be valid through your rental due-back date.",
          },
          {
            name: "dateOfBirth",
            label: "Date of birth",
            type: "date",
            required: true,
            helpText: "You must be at least 21. Absolutely no drivers under 21.",
          },
          { name: "insuranceCompany", label: "Insurance company", type: "text", required: false },
          { name: "policyNumber", label: "Policy number", type: "text", required: false },
          { name: "insuranceAgent", label: "Insurance agent", type: "text", required: false },
          { name: "insurancePhone", label: "Agent phone", type: "tel", required: false },
        ],
      },
      {
        title: "Employment and emergency contact",
        description: "Employment details are optional. An emergency contact is required.",
        fields: [
          { name: "employer", label: "Employer", type: "text", required: false },
          { name: "jobTitle", label: "Title", type: "text", required: false },
          { name: "employerPhone", label: "Employer phone", type: "tel", required: false },
          { name: "employerAddress", label: "Employer address", type: "text", required: false },
          { name: "supervisor", label: "Supervisor", type: "text", required: false },
          { name: "emergencyContact", label: "Emergency contact", type: "text", required: true },
          { name: "emergencyPhone", label: "Emergency contact phone", type: "tel", required: true },
        ],
      },
      {
        title: "Additional driver",
        description: "Leave blank if no additional driver will operate the vehicle.",
        fields: [
          { name: "additionalDriverName", label: "Additional driver (print)", type: "text", required: false },
          { name: "additionalDriverLicense", label: "Driver's license #", type: "text", required: false },
          { name: "additionalDriverState", label: "License state", type: "text", required: false },
          { name: "additionalDriverExpiration", label: "License expiration", type: "date", required: false },
          { name: "additionalDriverDob", label: "Date of birth", type: "date", required: false },
          { name: "additionalDriverInsurance", label: "Insurance company", type: "text", required: false },
          { name: "additionalDriverPolicy", label: "Policy number", type: "text", required: false },
          { name: "additionalDriverAgent", label: "Insurance agent", type: "text", required: false },
          { name: "additionalDriverAgentPhone", label: "Agent phone", type: "tel", required: false },
        ],
      },
      {
        title: "Vehicle",
        description: "The car you’re renting. Ask the front desk if you’re unsure.",
        fields: [
          { name: "yearMake", label: "Year / make", type: "text", required: true, placeholder: "e.g. 2022 Toyota" },
          { name: "model", label: "Model", type: "text", required: true },
          { name: "licensePlate", label: "License plate #", type: "text", required: true },
          { name: "odometerOut", label: "Odometer out", type: "number", required: true },
          {
            name: "fuelOut",
            label: "Fuel out",
            type: "select",
            required: true,
            options: [
              { label: "Empty (E)", value: "E" },
              { label: "1/4", value: "1/4" },
              { label: "1/2", value: "1/2" },
              { label: "3/4", value: "3/4" },
              { label: "Full (F)", value: "F" },
            ],
          },
          { name: "dateOut", label: "Date / time out", type: "datetime-local", required: true },
          { name: "dateDue", label: "Date / time due back", type: "datetime-local", required: true },
          { name: "vehicleNumber", label: "Vehicle #", type: "text", required: false, secondary: true },
          { name: "tag", label: "Tag", type: "text", required: false, secondary: true },
          { name: "vin", label: "VIN #", type: "text", required: false, secondary: true },
          {
            name: "dateDueExt",
            label: "Extended due date / time",
            type: "datetime-local",
            required: false,
            secondary: true,
          },
          {
            name: "milesAllowed",
            label: "Miles allowed",
            type: "number",
            required: false,
            secondary: true,
          },
        ],
      },
      {
        title: "Coverage choices",
        description:
          "These are optional. Choose Decline or Purchase for each one — you are not required to buy coverage to rent. Your initials (from your printed name) will be placed on the matching line of the agreement.",
        fields: [
          {
            name: "cdw",
            label: "Collision Damage Waiver (CDW)",
            type: "choice",
            required: true,
            description:
              "May reduce your responsibility for damage to the rental vehicle. It can duplicate coverage you already have.",
            options: [
              {
                label: "Decline CDW",
                value: "Declined",
                description: "I do not want Collision Damage Waiver.",
              },
              {
                label: "Purchase CDW",
                value: "Purchased",
                description: "I want CDW for an added charge.",
              },
            ],
          },
          {
            name: "cdwPerDay",
            label: "CDW rate ($ per day)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "cdw", value: "Purchased" },
            helpText:
              "Ask J & M for the CDW daily rate. Charge = rate × booking days.",
          },
          {
            name: "cdwCharge",
            label: "CDW charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "cdw", value: "Purchased" },
            helpText:
              "Auto-filled from the CDW daily rate × booking days. Ask J & M before overriding.",
          },
          {
            name: "paiPec",
            label: "Personal Accident / Personal Effects (PAI / PEC)",
            type: "choice",
            required: true,
            description:
              "Optional accident and personal-effects coverage. It may duplicate protection you already have.",
            options: [
              {
                label: "Decline PAI / PEC",
                value: "Declined",
                description: "I do not want PAI / PEC.",
              },
              {
                label: "Purchase PAI / PEC",
                value: "Purchased",
                description: "I want PAI / PEC for an added charge.",
              },
            ],
          },
          {
            name: "paiPecPerDay",
            label: "PAI / PEC rate ($ per day)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "paiPec", value: "Purchased" },
            helpText:
              "Ask J & M for the PAI / PEC daily rate. Charge = rate × booking days.",
          },
          {
            name: "paiPecCharge",
            label: "PAI / PEC charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "paiPec", value: "Purchased" },
            helpText:
              "Auto-filled from the daily rate × booking days. Ask J & M before overriding.",
          },
          {
            name: "sli",
            label: "Supplemental Liability Insurance (SLI)",
            type: "choice",
            required: true,
            description:
              "Optional extra liability coverage. Ask the front desk if you need the limits explained.",
            options: [
              {
                label: "Decline SLI",
                value: "Declined",
                description: "I do not want SLI.",
              },
              {
                label: "Purchase SLI",
                value: "Purchased",
                description: "I want SLI for an added charge.",
              },
            ],
          },
          {
            name: "sliPerDay",
            label: "SLI rate ($ per day)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "sli", value: "Purchased" },
            helpText:
              "Ask J & M for the SLI daily rate. Charge = rate × booking days.",
          },
          {
            name: "sliCharge",
            label: "SLI charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            showWhen: { field: "sli", value: "Purchased" },
            helpText:
              "Auto-filled from the daily rate × booking days. Ask J & M before overriding.",
          },
        ],
      },
      {
        title: "Fees",
        description:
          "Ask a J & M Car Rental staff member for every rate and fee below. Days charge and Virginia tax are calculated automatically from your booking dates and the amounts they give you.",
        fields: [
          {
            name: "prepaidRent",
            label: "Prepaid rent ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            helpText: "Ask J & M what prepaid rent amount to enter, if any.",
          },
          {
            name: "deposit",
            label: "Deposit ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            helpText: "Ask J & M how much deposit is required.",
          },
          {
            name: "daysRate",
            label: "Daily rate ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            helpText:
              "Ask J & M for the daily rate. Days charge = this rate × the number of days between date out and due back.",
          },
          {
            name: "vehicleLicenseFee",
            label: "Vehicle license fee ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            helpText: "Ask J & M for the vehicle license fee amount.",
          },
          {
            name: "remarks",
            label: "Fee notes",
            type: "textarea",
            required: false,
            placeholder: "Anything else about rates or fees from the desk.",
          },
          {
            name: "weeksRate",
            label: "Weekly rate ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M before entering a weekly rate.",
          },
          {
            name: "weeksCharge",
            label: "Weeks charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M for this amount if it applies.",
          },
          {
            name: "hoursRate",
            label: "Hourly rate ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M before entering an hourly rate.",
          },
          {
            name: "hoursCharge",
            label: "Hours charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M for this amount if it applies.",
          },
          {
            name: "milesRateCents",
            label: "Miles rate (¢ per mile)",
            type: "number",
            required: false,
            secondary: true,
            helpText: "Ask J & M for the per-mile rate if excess miles apply.",
          },
          {
            name: "milesCharge",
            label: "Miles charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M for this amount if it applies.",
          },
          {
            name: "gasCharge",
            label: "Gas charge ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M for any fuel charge (not included in VA rental tax).",
          },
          {
            name: "otherCharges",
            label: "Other charges ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M before entering any other charges.",
          },
          {
            name: "directBill1",
            label: "Direct bill 1 ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M if a direct bill amount applies.",
          },
          {
            name: "directBill2",
            label: "Direct bill 2 ($)",
            type: "number",
            required: false,
            placeholder: "0.00",
            secondary: true,
            helpText: "Ask J & M if a second direct bill amount applies.",
          },
        ],
      },
      {
        title: "Return details",
        description: "Completed by J & M staff when the vehicle is returned.",
        fields: [
          { name: "odometerIn", label: "Odometer in", type: "number", required: false, officeUse: true },
          {
            name: "fuelIn",
            label: "Fuel in",
            type: "select",
            required: false,
            officeUse: true,
            options: [
              { label: "Empty (E)", value: "E" },
              { label: "1/4", value: "1/4" },
              { label: "1/2", value: "1/2" },
              { label: "3/4", value: "3/4" },
              { label: "Full (F)", value: "F" },
            ],
          },
          { name: "dateIn", label: "Date / time in", type: "datetime-local", required: false, officeUse: true },
          { name: "milesDriven", label: "Miles driven", type: "number", required: false, officeUse: true },
          { name: "excessMiles", label: "Excess miles", type: "number", required: false, officeUse: true },
        ],
      },
    ],
  },
];

export function getForm(slug: string): FormTemplate | undefined {
  return FORMS.find((form) => form.slug === slug);
}
