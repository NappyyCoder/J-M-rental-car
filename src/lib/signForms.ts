export type SignFieldOption = {
  label: string
  value: string
}

export type SignField = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'date' | 'datetime-local' | 'number' | 'select' | 'choice'
  required: boolean
  placeholder?: string
  helpText?: string
  wide?: boolean
  options?: SignFieldOption[]
}

export type SignSection = {
  title: string
  description?: string
  fields: SignField[]
}

export type SignFormTemplate = {
  slug: string
  title: string
  version: string
  description: string
  body: string[]
  sections: SignSection[]
  retentionYears: number
}

export const SIGN_FORMS: SignFormTemplate[] = [
  {
    slug: 'rental-agreement',
    title: 'J&M Rental Agreement',
    version: '2026.09',
    description:
      'Fill the same paper rental agreement, then sign on page 1 and page 2. Used at the desk. Open this page by typing the URL.',
    retentionYears: 3,
    body: [
      'Absolutely no drivers under 21 years of age.',
      'This agreement offers, for an additional charge, collision damage waiver to cover your responsibility for damage to the vehicle. Before deciding whether to purchase the collision damage waiver, you may wish to determine whether your own vehicle insurance affords you coverage for damage to the rental vehicle and the amount of the deductible under your insurance coverage. The purchase of collision damage waiver is not mandatory and may be waived.',
      'Purchase of optional insurance products is not required to rent a vehicle from us. Our optional insurance products may duplicate coverage already available to you under your personal auto, personal liability, or other sources of coverage.',
      'You understand that you are not an additional insured under our coverage for collision, upset, and comprehensive damage to the vehicle. The vehicle may be driven or used only in the State of Virginia or within the radius of the renting location, or as otherwise permitted in writing. In case of accident, contact 911, then contact our office immediately.',
      'By choosing the coverage options below, you agree to purchase or decline Collision Damage Waiver, Personal Accident Insurance / Personal Effects Coverage, and Supplemental Liability Insurance. By signing, you agree to this Rental Agreement and the terms explained at pickup.',
    ],
    sections: [
      {
        title: 'Renter',
        fields: [
          { name: 'renterName', label: 'Renter (print)', type: 'text', required: true, wide: true },
          { name: 'phone', label: 'Phone', type: 'tel', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'homeAddress', label: 'Home address', type: 'text', required: true, wide: true },
          { name: 'city', label: 'City', type: 'text', required: true },
          { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'VA' },
          { name: 'zip', label: 'ZIP', type: 'text', required: true },
        ],
      },
      {
        title: 'Driver license',
        fields: [
          { name: 'driversLicense', label: "Driver's license #", type: 'text', required: true },
          { name: 'licenseState', label: 'License state', type: 'text', required: true, placeholder: 'VA' },
          { name: 'licenseExpiration', label: 'License expiration', type: 'date', required: true },
          {
            name: 'dateOfBirth',
            label: 'Date of birth',
            type: 'date',
            required: true,
            helpText: 'Must be 21 or older.',
          },
          { name: 'insuranceCompany', label: 'Insurance company', type: 'text', required: false },
          { name: 'policyNumber', label: 'Policy number', type: 'text', required: false },
        ],
      },
      {
        title: 'Emergency contact',
        fields: [
          { name: 'emergencyContact', label: 'Emergency contact', type: 'text', required: true },
          { name: 'emergencyPhone', label: 'Emergency phone', type: 'tel', required: true },
        ],
      },
      {
        title: 'Vehicle',
        description: 'Ask the front desk if you are unsure.',
        fields: [
          { name: 'yearMake', label: 'Year / make', type: 'text', required: true, placeholder: '2014 Chevrolet' },
          { name: 'model', label: 'Model', type: 'text', required: true },
          { name: 'licensePlate', label: 'License plate #', type: 'text', required: true },
          { name: 'odometerOut', label: 'Odometer out', type: 'number', required: true },
          {
            name: 'fuelOut',
            label: 'Fuel out',
            type: 'select',
            required: true,
            options: [
              { label: 'Empty (E)', value: 'E' },
              { label: '1/4', value: '1/4' },
              { label: '1/2', value: '1/2' },
              { label: '3/4', value: '3/4' },
              { label: 'Full (F)', value: 'F' },
            ],
          },
          { name: 'dateOut', label: 'Date / time out', type: 'datetime-local', required: true },
          { name: 'dateDue', label: 'Date / time due back', type: 'datetime-local', required: true },
        ],
      },
      {
        title: 'Coverage',
        description: 'Optional. You do not have to buy coverage to rent.',
        fields: [
          {
            name: 'cdw',
            label: 'Collision Damage Waiver (CDW)',
            type: 'choice',
            required: true,
            wide: true,
            options: [
              { label: 'Decline CDW', value: 'Declined' },
              { label: 'Purchase CDW', value: 'Purchased' },
            ],
          },
          {
            name: 'paiPec',
            label: 'Personal Accident / Personal Effects (PAI / PEC)',
            type: 'choice',
            required: true,
            wide: true,
            options: [
              { label: 'Decline PAI / PEC', value: 'Declined' },
              { label: 'Purchase PAI / PEC', value: 'Purchased' },
            ],
          },
          {
            name: 'sli',
            label: 'Supplemental Liability Insurance (SLI)',
            type: 'choice',
            required: true,
            wide: true,
            options: [
              { label: 'Decline SLI', value: 'Declined' },
              { label: 'Purchase SLI', value: 'Purchased' },
            ],
          },
        ],
      },
      {
        title: 'Office use',
        description: 'Staff fills these at the desk.',
        fields: [
          { name: 'dailyRate', label: 'Daily rate ($)', type: 'number', required: false, placeholder: '0.00' },
          { name: 'deposit', label: 'Deposit ($)', type: 'number', required: false, placeholder: '0.00' },
        ],
      },
    ],
  },
]

export function getSignForm(slug: string): SignFormTemplate | undefined {
  if (slug === 'waiver') return SIGN_FORMS[0]
  return SIGN_FORMS.find((form) => form.slug === slug)
}

export function allSignFields(form: SignFormTemplate): SignField[] {
  return form.sections.flatMap((section) => section.fields)
}

export type SignSubmission = {
  id: string
  formSlug: string
  formTitle: string
  formVersion: string
  fields: Record<string, string>
  signedAt: string
  retainUntil: string
  pdfDataUrl: string
}

const STORAGE_KEY = 'jm-sign-submissions'
const pdfById = new Map<string, string>()

function withCachedPdf(submission: SignSubmission): SignSubmission {
  return {
    ...submission,
    pdfDataUrl: pdfById.get(submission.id) || submission.pdfDataUrl,
  }
}

export function listSignSubmissions(): SignSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SignSubmission[]
    return parsed
      .map(withCachedPdf)
      .sort(
        (a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime(),
      )
  } catch {
    return []
  }
}

export function getSignSubmission(id: string): SignSubmission | null {
  return listSignSubmissions().find((s) => s.id === id) ?? null
}

export function saveSignSubmission(submission: SignSubmission) {
  pdfById.set(submission.id, submission.pdfDataUrl)
  const all = listSignSubmissions()
    .filter((s) => s.id !== submission.id)
    .map((s) => ({ ...s, pdfDataUrl: '' }))
  all.unshift({ ...submission, pdfDataUrl: '' })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 20)))
}
