import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormField, FormTemplate } from "./forms";
import {
  applyFeeFieldChange,
  feeSummaryFromFields,
  resolveAgreementFields,
} from "./fees";
import {
  inputConstraintsForField,
  validateRentalFields,
} from "./validateFields";
import { renderPdfPagesToDataUrls } from "./renderPdfPages";
import { buildFilledAgreementPdf, buildSignedPdf } from "./pdf";
import { InfoTip } from "./InfoTip";
import { EasyDateField } from "./EasyDateField";
import { CalendarDateTimeField } from "./CalendarDateTimeField";
import { PdfPageSigner } from "./PdfPageSigner";
import { saveSignedDocument } from "../lib/signCloud";
import { saveSignSubmission, type SignSubmission } from "../lib/signForms";
import { isSupabaseConfigured } from "../lib/supabase";
import { downloadPdf, pdfBytesToDataUrl } from "../lib/signPdf";
import "./agreement.css";

type Props = {
  form: FormTemplate;
};

const FEE_LIVE_FIELDS = new Set([
  "dateOut",
  "dateDue",
  "daysRate",
  "weeksCharge",
  "hoursCharge",
  "milesCharge",
  "prepaidRent",
  "deposit",
  "vehicleLicenseFee",
  "gasCharge",
  "otherCharges",
  "cdw",
  "cdwPerDay",
  "cdwCharge",
  "paiPec",
  "paiPecPerDay",
  "paiPecCharge",
  "sli",
  "sliPerDay",
  "sliCharge",
]);

function isFieldVisible(
  field: FormField,
  values: Record<string, string>,
) {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.value;
}

export function SignForm({ form }: Props) {
  const navigate = useNavigate();
  const fields = form.sections.flatMap((section) => section.fields);
  const customerSections = form.sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter((field) => !field.officeUse),
    }))
    .filter((section) => section.fields.length > 0);
  const finalStep = customerSections.length;
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, ""])),
  );
  const [page1Signature, setPage1Signature] = useState<string | null>(null);
  const [page2Signature, setPage2Signature] = useState<string | null>(null);
  const [page1AdditionalSignature, setPage1AdditionalSignature] = useState<
    string | null
  >(null);
  const [page2AdditionalSignature, setPage2AdditionalSignature] = useState<
    string | null
  >(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [previewPages, setPreviewPages] = useState<string[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const needsAdditional = Boolean(values.additionalDriverName?.trim());
  const feeSummary = useMemo(() => feeSummaryFromFields(values), [values]);

  function setFieldValue(name: string, value: string) {
    setValues((previous) => {
      if (FEE_LIVE_FIELDS.has(name)) {
        return applyFeeFieldChange(previous, name, value);
      }
      return { ...previous, [name]: value };
    });
  }

  const onPage1SignatureChange = useCallback((dataUrl: string | null) => {
    setPage1Signature(dataUrl);
  }, []);

  const onPage2SignatureChange = useCallback((dataUrl: string | null) => {
    setPage2Signature(dataUrl);
  }, []);

  const onPage1AdditionalChange = useCallback((dataUrl: string | null) => {
    setPage1AdditionalSignature(dataUrl);
  }, []);

  const onPage2AdditionalChange = useCallback((dataUrl: string | null) => {
    setPage2AdditionalSignature(dataUrl);
  }, []);

  useEffect(() => {
    if (step !== finalStep) return;

    let cancelled = false;

    async function loadFilledPreview() {
      setPreviewLoading(true);
      setPreviewError(null);
      try {
        const pdfBytes = await buildFilledAgreementPdf({
          fields: resolveAgreementFields(values),
        });
        const pages = await renderPdfPagesToDataUrls(pdfBytes, 2);
        if (!cancelled) setPreviewPages(pages);
      } catch (err) {
        if (cancelled) return;
        setPreviewPages(null);
        setPreviewError(
          err instanceof Error
            ? err.message
            : "Could not load the filled agreement preview.",
        );
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }

    void loadFilledPreview();
    return () => {
      cancelled = true;
    };
    // Rebuild when entering the sign step; values are snapshotted at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: final-step entry only
  }, [step, finalStep, form.slug]);

  function validateSection(sectionIndex: number) {
    const section = customerSections[sectionIndex];
    if (!section) return true;

    for (const field of section.fields) {
      if (!isFieldVisible(field, values)) continue;
      if (field.required && !values[field.name]?.trim()) {
        setError(`Please fill in ${field.label}.`);
        return false;
      }
    }

    const logicalError = validateRentalFields(values, {
      onlyFields: section.fields.map((field) => field.name),
    });
    if (logicalError) {
      setError(logicalError);
      return false;
    }
    return true;
  }

  function goToNextStep() {
    setError(null);
    if (validateSection(step)) {
      setStep((current) => Math.min(current + 1, finalStep));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const field of fields.filter((field) => !field.officeUse)) {
      if (!isFieldVisible(field, values)) continue;
      if (field.required && !values[field.name]?.trim()) {
        setError(`Please fill in ${field.label}.`);
        return;
      }
    }

    const logicalError = validateRentalFields(values);
    if (logicalError) {
      setError(logicalError);
      return;
    }

    if (!page1Signature) {
      setError("Please sign as Renter on page 1.");
      return;
    }
    if (!page2Signature) {
      setError("Please sign as Renter on page 2.");
      return;
    }
    if (needsAdditional && !page1AdditionalSignature) {
      setError("Please sign as Additional Driver on page 1.");
      return;
    }
    if (needsAdditional && !page2AdditionalSignature) {
      setError("Please sign as Additional Driver on page 2.");
      return;
    }
    if (!agreed) {
      setError("Please confirm you agree to sign electronically.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      const id = crypto.randomUUID();
      const signedAt = new Date();
      const retainUntil = new Date(signedAt);
      retainUntil.setFullYear(retainUntil.getFullYear() + form.retentionYears);
      const fileName = `jm-${form.slug}-${id.slice(0, 8)}.pdf`;

      const pdfBytes = await buildSignedPdf({
        form,
        fields: resolveAgreementFields(values),
        page1SignatureDataUrl: page1Signature,
        page2SignatureDataUrl: page2Signature,
        page1AdditionalSignatureDataUrl: page1AdditionalSignature,
        page2AdditionalSignatureDataUrl: page2AdditionalSignature,
        signedAt: signedAt.toISOString(),
        retainUntil: retainUntil.toISOString(),
        submissionId: id,
      });
      downloadPdf(pdfBytes, fileName);

      const pdfDataUrl = await pdfBytesToDataUrl(pdfBytes);
      const submission: SignSubmission = {
        id,
        formSlug: form.slug,
        formTitle: form.title,
        formVersion: form.version,
        fields: resolveAgreementFields(values),
        signedAt: signedAt.toISOString(),
        retainUntil: retainUntil.toISOString(),
        pdfDataUrl,
      };

      if (isSupabaseConfigured()) {
        await saveSignedDocument(submission);
      }
      saveSignSubmission(submission);
      navigate(`/sign/done/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="agreement-form space-y-8">
      <div className="rounded-[var(--radius)] border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-800">
            Step {step + 1} of {finalStep + 1}
          </span>
          <span className="text-slate-500">
            {step === finalStep ? "Review & sign both pages" : customerSections[step]?.title}
          </span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: finalStep + 1 }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= step ? "bg-ink" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {customerSections.slice(step, step + 1).map((section) => {
        const visible = section.fields.filter((field) =>
          isFieldVisible(field, values),
        );
        const primary = visible.filter((field) => !field.secondary);
        const secondary = visible.filter((field) => field.secondary);
        const isFees = section.title === "Fees";

        const renderField = (field: FormField) =>
          field.type === "choice" ? (
            <fieldset
              key={field.name}
              className="coverage-choice sm:col-span-2"
            >
              <legend className="coverage-choice-title">
                {field.label}
                {field.required ? " *" : ""}
              </legend>
              {field.description ? (
                <p className="coverage-choice-copy">{field.description}</p>
              ) : null}
              <div
                className="coverage-choice-options"
                role="radiogroup"
                aria-label={field.label}
              >
                {field.options?.map((option) => {
                  const selected = values[field.name] === option.value;
                  return (
                    <label
                      key={option.value}
                      className="coverage-option"
                      data-selected={selected ? "true" : "false"}
                      data-kind={
                        option.value === "Declined" ? "decline" : "purchase"
                      }
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        required={field.required}
                        checked={selected}
                        onChange={() => setFieldValue(field.name, option.value)}
                      />
                      <span className="coverage-option-mark" aria-hidden="true" />
                      <span className="coverage-option-text">
                        <span className="coverage-option-label">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="coverage-option-desc">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <label
              key={field.name}
              className={`block space-y-1.5${
                field.type === "textarea" ||
                field.type === "date" ||
                field.type === "datetime-local"
                  ? " sm:col-span-2"
                  : ""
              }`}
            >
              <span className="text-sm font-semibold text-slate-800">
                {field.label}
                {field.required ? " *" : ""}
                {field.helpText ? <InfoTip text={field.helpText} /> : null}
              </span>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  value={values[field.name]}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                  className="field-input text-base"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                  className="field-input min-h-24 text-base sm:col-span-2"
                />
              ) : field.type === "datetime-local" ? (
                <CalendarDateTimeField
                  name={field.name}
                  value={values[field.name]}
                  required={field.required}
                  min={inputConstraintsForField(field.name).min}
                  max={inputConstraintsForField(field.name).max}
                  onChange={(next) => setFieldValue(field.name, next)}
                />
              ) : field.type === "date" ? (
                <EasyDateField
                  name={field.name}
                  mode="date"
                  value={values[field.name]}
                  required={field.required}
                  min={inputConstraintsForField(field.name).min}
                  max={inputConstraintsForField(field.name).max}
                  onChange={(next) => setFieldValue(field.name, next)}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(e) => setFieldValue(field.name, e.target.value)}
                  className="field-input text-base"
                  step={field.type === "number" ? "0.01" : undefined}
                  {...inputConstraintsForField(field.name)}
                />
              )}
            </label>
          );

        return (
          <section key={section.title} className="panel space-y-4 p-5 sm:p-6">
            <div>
              <h2 className="font-display text-xl">{section.title}</h2>
              {section.description ? (
                <p className="mt-1 text-sm text-slate-500">
                  {section.description}
                </p>
              ) : null}
            </div>
            {isFees ? (
              <div className="fee-guide" role="note">
                <p className="fee-guide-title">Ask J &amp; M Car Rental for these amounts</p>
                <p className="fee-guide-copy">
                  Before filling this step, ask a desk staff member for the{" "}
                  <strong>daily rate</strong>, <strong>deposit</strong>,{" "}
                  <strong>vehicle license fee</strong>, and any coverage or other
                  charges. Enter only what they tell you. Days charge is calculated
                  from your booking dates × daily rate, and Virginia motor vehicle
                  rental tax (6%) is added automatically.
                </p>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {primary.map(renderField)}
            </div>
            {secondary.length > 0 ? (
              <details className="field-more">
                <summary>More details (optional)</summary>
                <div className="field-more-grid">{secondary.map(renderField)}</div>
              </details>
            ) : null}
            {isFees ? (
              <div className="fee-summary" aria-live="polite">
                <p className="fee-summary-title">Payment total (auto-calculated)</p>
                {feeSummary.rentalDays != null ? (
                  <p className="fee-summary-meta">
                    Booking length: {feeSummary.rentalDays} day
                    {feeSummary.rentalDays === 1 ? "" : "s"} (from date out → due
                    back)
                    {feeSummary.daysRate !== "0.00"
                      ? ` · $${feeSummary.daysRate}/day → $${feeSummary.daysCharge} days charge`
                      : " · enter the daily rate from J & M above"}
                  </p>
                ) : (
                  <p className="fee-summary-meta">
                    Set date out and due back on the Vehicle step, then ask J &amp; M
                    for the daily rate so days charge can calculate.
                  </p>
                )}
                <dl className="fee-summary-grid">
                  <div>
                    <dt>Days charge</dt>
                    <dd>${feeSummary.daysCharge}</dd>
                  </div>
                  <div>
                    <dt>Time &amp; mileage</dt>
                    <dd>${feeSummary.timeMileageTotal}</dd>
                  </div>
                  <div>
                    <dt>Taxable rental</dt>
                    <dd>${feeSummary.taxableBase}</dd>
                  </div>
                  <div>
                    <dt>VA rental tax (6%)</dt>
                    <dd>${feeSummary.taxAmount}</dd>
                  </div>
                  <div>
                    <dt>Subtotal (before tax + fees)</dt>
                    <dd>${feeSummary.subtotal}</dd>
                  </div>
                  <div>
                    <dt>Total due</dt>
                    <dd>${feeSummary.totalAmountDue}</dd>
                  </div>
                  <div>
                    <dt>Customer pay</dt>
                    <dd>${feeSummary.customerPay}</dd>
                  </div>
                  <div>
                    <dt>Minus deposit</dt>
                    <dd>${feeSummary.minusDeposit}</dd>
                  </div>
                  <div>
                    <dt>Net due at location</dt>
                    <dd>${feeSummary.netDueRentalLocation}</dd>
                  </div>
                  <div>
                    <dt>Net due to customer</dt>
                    <dd>${feeSummary.netDueCustomer}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </section>
        );
      })}

      {step === finalStep ? (
        <>
          <section className="panel space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl">Review the agreement</h2>
            <p className="text-sm text-slate-500">
              This is your filled rental agreement — the same output you’ll
              download after signing. Review both pages, then sign on the
              highlighted lines.
            </p>
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              {form.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            {previewLoading ? (
              <p className="rounded-[var(--radius)] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Preparing your filled agreement preview…
              </p>
            ) : null}
            {previewError ? (
              <p className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {previewError} You can still sign on the blank form pages; the
                downloaded PDF will include your answers.
              </p>
            ) : null}
          </section>

          <section className="panel space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl">Sign page 1</h2>
            <p className="text-sm text-slate-500">
              Scroll to the bottom of the form and sign on the highlighted line.
            </p>
            <PdfPageSigner
              key={previewPages?.[0] ? "filled-1" : "blank-1"}
              pageSrc={previewPages?.[0] ?? "/agreement/preview-page-1.jpg"}
              pageNumber={1}
              priority
              renterValue={page1Signature}
              additionalValue={page1AdditionalSignature}
              onRenterChange={onPage1SignatureChange}
              onAdditionalChange={onPage1AdditionalChange}
              requireAdditional={needsAdditional}
            />
          </section>

          <section className="panel space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl">Sign page 2</h2>
            <p className="text-sm text-slate-500">
              Sign the same Renter / Additional Driver lines on page 2.
            </p>
            <PdfPageSigner
              key={previewPages?.[1] ? "filled-2" : "blank-2"}
              pageSrc={previewPages?.[1] ?? "/agreement/preview-page-2.jpg"}
              pageNumber={2}
              renterValue={page2Signature}
              additionalValue={page2AdditionalSignature}
              onRenterChange={onPage2SignatureChange}
              onAdditionalChange={onPage2AdditionalChange}
              requireAdditional={needsAdditional}
            />
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 size-4 accent-[var(--ink)]"
              />
              <span>
                I have reviewed both pages and agree to sign this agreement
                electronically. I understand a PDF copy will be stored for{" "}
                {form.retentionYears} years.
              </span>
            </label>
          </section>
        </>
      ) : null}

      {error ? (
        <p className="rounded-[var(--radius)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((current) => current - 1);
            }}
            className="btn btn-outline"
          >
            Back
          </button>
        ) : null}
        {step < finalStep ? (
          <button type="button" onClick={goToNextStep} className="btn btn-primary">
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary sm:min-w-48"
          >
            {submitting ? "Saving…" : "Submit & sign both pages"}
          </button>
        )}
      </div>
    </form>
  );
}
