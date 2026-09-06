export type SignField = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel'
  required: boolean
  placeholder?: string
}

export type SignFormTemplate = {
  slug: string
  title: string
  version: string
  description: string
  body: string[]
  fields: SignField[]
  retentionYears: number
}

export const SIGN_FORMS: SignFormTemplate[] = [
  {
    slug: 'waiver',
    title: 'Sample Rental Agreement Acknowledgment',
    version: '1.0.0-demo',
    description:
      'Demo form for client review. Replace this copy when the real rental paperwork arrives.',
    retentionYears: 3,
    body: [
      'This is a SAMPLE document for demonstration only. It is not a binding rental contract.',
      'By signing below, the renter acknowledges they have reviewed this demo form for J&M Car Rental LLC (Virginia Beach), understand that a real agreement will replace it later, and agree that their signature, name, and submission metadata may be stored for three (3) years to test the retention workflow.',
      'J&M Car Rental may store a PDF copy of this submission, a timestamp, and basic device information for audit purposes.',
      'If you do not wish to participate in this demo, do not sign or submit this form. For bookings call (703) 563 1125.',
    ],
    fields: [
      {
        name: 'fullName',
        label: 'Full legal name',
        type: 'text',
        required: true,
        placeholder: 'Jane Doe',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'jane@example.com',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        required: false,
        placeholder: '(555) 123-4567',
      },
    ],
  },
]

export function getSignForm(slug: string): SignFormTemplate | undefined {
  return SIGN_FORMS.find((form) => form.slug === slug)
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

export function listSignSubmissions(): SignSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SignSubmission[]
    return parsed.sort(
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
  const all = listSignSubmissions().filter((s) => s.id !== submission.id)
  all.unshift(submission)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
