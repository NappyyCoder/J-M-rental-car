import { tryGetSupabase } from './supabase'
import type { SignSubmission } from './signForms'

const TABLE = 'signed_documents'

type SignedDocumentRow = {
  id: string
  form_slug: string
  form_title: string
  form_version: string
  fields: Record<string, string>
  signed_at: string
  retain_until: string
  pdf_base64: string
}

function rowToSubmission(row: SignedDocumentRow): SignSubmission {
  return {
    id: row.id,
    formSlug: row.form_slug,
    formTitle: row.form_title,
    formVersion: row.form_version,
    fields: row.fields ?? {},
    signedAt: row.signed_at,
    retainUntil: row.retain_until,
    pdfDataUrl: row.pdf_base64,
  }
}

export async function saveSignedDocument(submission: SignSubmission): Promise<void> {
  const supabase = tryGetSupabase()
  if (!supabase) return

  const { error } = await supabase.from(TABLE).insert({
    id: submission.id,
    form_slug: submission.formSlug,
    form_title: submission.formTitle,
    form_version: submission.formVersion,
    fields: submission.fields,
    signed_at: submission.signedAt,
    retain_until: submission.retainUntil,
    pdf_base64: submission.pdfDataUrl,
  })

  if (error) throw error
}

export async function listSignedDocuments(): Promise<SignSubmission[]> {
  const supabase = tryGetSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, form_slug, form_title, form_version, fields, signed_at, retain_until, pdf_base64')
    .order('signed_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as SignedDocumentRow[]).map(rowToSubmission)
}
