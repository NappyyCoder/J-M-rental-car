import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { SITE_NAME, SITE_NAME_SHORT } from './contact'
import type { SignFormTemplate } from './signForms'

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

export async function buildSignedPdf(options: {
  form: SignFormTemplate
  fields: Record<string, string>
  signatureDataUrl: string
  signedAt: string
  retainUntil: string
  submissionId: string
}): Promise<Uint8Array> {
  const { form, fields, signatureDataUrl, signedAt, retainUntil, submissionId } =
    options

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const left = 48
  const top = 750
  const bottom = 56

  let page = doc.addPage([612, 792])
  let y = top

  const ensureSpace = (needed: number) => {
    if (y - needed >= bottom) return
    page = doc.addPage([612, 792])
    y = top
  }

  const draw = (
    text: string,
    size = 11,
    opts?: { bold?: boolean; color?: ReturnType<typeof rgb> },
  ) => {
    ensureSpace(size + 8)
    page.drawText(text, {
      x: left,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: opts?.color ?? rgb(0.1, 0.1, 0.09),
    })
    y -= size + 6
  }

  draw(SITE_NAME_SHORT.toUpperCase(), 11, { bold: true })
  draw(form.title, 18, { bold: true })
  draw(`${SITE_NAME} · ${form.version}`, 10, {
    color: rgb(0.35, 0.35, 0.32),
  })
  y -= 8

  for (const paragraph of form.body) {
    for (const line of wrapText(paragraph, 85)) {
      draw(line, 10)
    }
    y -= 6
  }

  for (const section of form.sections) {
    y -= 6
    draw(section.title, 13, { bold: true })
    for (const field of section.fields) {
      const value = fields[field.name]?.trim() || '-'
      for (const line of wrapText(`${field.label}: ${value}`, 85)) {
        draw(line, 11)
      }
    }
  }

  y -= 10
  draw('Electronic signature', 13, { bold: true })

  const base64 = signatureDataUrl.replace(/^data:image\/png;base64,/, '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)

  const signatureImage = await doc.embedPng(bytes)
  const sigDims = signatureImage.scale(0.35)
  const sigHeight = Math.min(sigDims.height, 80)
  const sigWidth = (sigDims.width / sigDims.height) * sigHeight

  ensureSpace(sigHeight + 28)
  page.drawRectangle({
    x: left,
    y: y - sigHeight - 8,
    width: Math.max(sigWidth + 16, 220),
    height: sigHeight + 16,
    borderColor: rgb(0.75, 0.75, 0.72),
    borderWidth: 1,
  })
  page.drawImage(signatureImage, {
    x: left + 8,
    y: y - sigHeight,
    width: sigWidth,
    height: sigHeight,
  })
  y -= sigHeight + 36

  draw('Audit / retention', 13, { bold: true })
  draw(`Submission ID: ${submissionId}`, 10)
  draw(`Signed at (UTC): ${signedAt}`, 10)
  draw(`Retain until (UTC): ${retainUntil}`, 10)
  draw('Retention policy: 3 years from signature date', 10)
  draw(
    'Signer confirmed: I agree to sign electronically and have read this document.',
    10,
  )

  return doc.save()
}

export function pdfBytesToDataUrl(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return `data:application/pdf;base64,${btoa(binary)}`
}

export function downloadPdf(dataUrl: string, fileName: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = fileName
  a.click()
}
