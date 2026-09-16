import { useEffect, useState } from "react";

type Props = {
  name: string;
  value: string;
  required?: boolean;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
};

type Draft = {
  date: string;
  hour12: string;
  minute: string;
  ampm: "AM" | "PM";
};

const EMPTY: Draft = { date: "", hour12: "", minute: "", ampm: "AM" };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseValue(value: string): Draft {
  if (!value?.trim()) return { ...EMPTY };
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2}))?/.exec(value.trim());
  if (!match) return { ...EMPTY };

  const hour24 = match[2] != null ? Number(match[2]) : 9;
  const ampm: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return {
    date: match[1],
    hour12: String(hour12),
    minute: String(Number(match[3] ?? "0")),
    ampm,
  };
}

function buildValue(draft: Draft): string {
  if (!draft.date || !draft.hour12 || draft.minute === "") return "";
  let h = Number(draft.hour12);
  const min = Number(draft.minute);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return "";
  if (draft.ampm === "AM") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${draft.date}T${pad(h)}:${pad(min)}`;
}

/** Calendar date picker + simple time dropdowns for out / due back / in. */
export function CalendarDateTimeField({
  name,
  value,
  required,
  min,
  max,
  onChange,
}: Props) {
  const [draft, setDraft] = useState<Draft>(() => parseValue(value));

  useEffect(() => {
    if (!value?.trim()) return;
    setDraft((current) => {
      if (buildValue(current) === value) return current;
      return parseValue(value);
    });
  }, [value]);

  function update(patch: Partial<Draft>) {
    setDraft((previous) => {
      const next = { ...previous, ...patch };
      const built = buildValue(next);
      if (built) onChange(built);
      else if (value?.trim()) onChange("");
      return next;
    });
  }

  const dateMin = min?.slice(0, 10);
  const dateMax = max?.slice(0, 10);

  return (
    <div className="cal-datetime">
      <div className="cal-datetime-date">
        <span className="easy-date-label">Date</span>
        <input
          type="date"
          className="field-input text-base"
          name={`${name}-date`}
          aria-label={`${name} date`}
          required={required}
          value={draft.date}
          min={dateMin}
          max={dateMax}
          onChange={(e) => update({ date: e.target.value })}
        />
      </div>

      <div className="cal-datetime-time" role="group" aria-label={`${name} time`}>
        <div className="easy-date-part">
          <span className="easy-date-label">Hour</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} hour`}
            value={draft.hour12}
            onChange={(e) => update({ hour12: e.target.value })}
          >
            <option value="">Hour</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="easy-date-part">
          <span className="easy-date-label">Minute</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} minute`}
            value={draft.minute}
            onChange={(e) => update({ minute: e.target.value })}
          >
            <option value="">Min</option>
            {[0, 15, 30, 45].map((n) => (
              <option key={n} value={String(n)}>
                {pad(n)}
              </option>
            ))}
            {draft.minute !== "" &&
            ![0, 15, 30, 45].includes(Number(draft.minute)) ? (
              <option value={draft.minute}>{pad(Number(draft.minute))}</option>
            ) : null}
          </select>
        </div>

        <div className="easy-date-part">
          <span className="easy-date-label">AM / PM</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} AM or PM`}
            value={draft.ampm}
            onChange={(e) =>
              update({ ampm: e.target.value === "PM" ? "PM" : "AM" })
            }
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
