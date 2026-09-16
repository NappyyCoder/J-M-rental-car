import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  mode: "date" | "datetime-local";
  value: string;
  required?: boolean;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
};

type Draft = {
  year: string;
  month: string;
  day: string;
  hour12: string;
  minute: string;
  ampm: "AM" | "PM";
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EMPTY: Draft = {
  year: "",
  month: "",
  day: "",
  hour12: "",
  minute: "",
  ampm: "AM",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/** Parse stored ISO values without timezone day-shift bugs. */
function parseParts(value: string, mode: Props["mode"]): Draft {
  if (!value?.trim()) return { ...EMPTY };

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(value.trim());
  if (!match) return { ...EMPTY };

  const hour24 = match[4] != null ? Number(match[4]) : 0;
  const ampm: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return {
    year: match[1],
    month: String(Number(match[2])),
    day: String(Number(match[3])),
    hour12: mode === "datetime-local" ? String(hour12) : "",
    minute: mode === "datetime-local" ? String(Number(match[5] ?? "0")) : "",
    ampm,
  };
}

function buildValue(mode: Props["mode"], draft: Draft): string {
  if (!draft.year || !draft.month || !draft.day) return "";
  const y = Number(draft.year);
  const m = Number(draft.month);
  const d = Number(draft.day);
  if (!y || !m || !d) return "";

  const safeDay = Math.min(d, daysInMonth(y, m));
  const datePart = `${y}-${pad(m)}-${pad(safeDay)}`;
  if (mode === "date") return datePart;

  if (!draft.hour12 || draft.minute === "") return "";
  let h = Number(draft.hour12);
  const min = Number(draft.minute);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return "";
  if (draft.ampm === "AM") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${datePart}T${pad(h)}:${pad(min)}`;
}

function yearOptions(min?: string, max?: string) {
  const now = new Date().getFullYear();
  let start = now - 100;
  let end = now + 20;
  if (min) {
    const y = Number(min.slice(0, 4));
    if (Number.isFinite(y)) start = y;
  }
  if (max) {
    const y = Number(max.slice(0, 4));
    if (Number.isFinite(y)) end = y;
  }
  if (start > end) [start, end] = [end, start];
  const years: number[] = [];
  for (let y = end; y >= start; y--) years.push(y);
  return years;
}

export function EasyDateField({
  name,
  mode,
  value,
  required,
  min,
  max,
  onChange,
}: Props) {
  const [draft, setDraft] = useState<Draft>(() => parseParts(value, mode));

  // Sync from parent only when it has a real stored value (avoid wiping in-progress picks).
  useEffect(() => {
    if (!value?.trim()) return;
    setDraft((current) => {
      if (buildValue(mode, current) === value) return current;
      return parseParts(value, mode);
    });
  }, [value, mode]);

  const maxDay = useMemo(() => {
    if (draft.year && draft.month) {
      return daysInMonth(Number(draft.year), Number(draft.month));
    }
    return 31;
  }, [draft.year, draft.month]);

  function update(patch: Partial<Draft>) {
    setDraft((previous) => {
      const next: Draft = { ...previous, ...patch };
      if (next.year && next.month && next.day) {
        const limit = daysInMonth(Number(next.year), Number(next.month));
        if (Number(next.day) > limit) next.day = String(limit);
      }
      const built = buildValue(mode, next);
      // Push up only when complete; clear parent if we just broke a complete value.
      if (built) onChange(built);
      else if (value?.trim()) onChange("");
      return next;
    });
  }

  const years = useMemo(() => yearOptions(min, max), [min, max]);

  return (
    <div className="easy-date" data-mode={mode}>
      <div className="easy-date-row" role="group" aria-label={name}>
        <div className="easy-date-part">
          <span className="easy-date-label">Month</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} month`}
            value={draft.month}
            onChange={(e) => update({ month: e.target.value })}
          >
            <option value="">Month</option>
            {MONTHS.map((label, index) => (
              <option key={label} value={String(index + 1)}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="easy-date-part easy-date-part-day">
          <span className="easy-date-label">Day</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} day`}
            value={draft.day}
            onChange={(e) => update({ day: e.target.value })}
          >
            <option value="">Day</option>
            {Array.from({ length: maxDay }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="easy-date-part easy-date-part-year">
          <span className="easy-date-label">Year</span>
          <select
            className="field-input"
            required={required}
            aria-label={`${name} year`}
            value={draft.year}
            onChange={(e) => update({ year: e.target.value })}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mode === "datetime-local" ? (
        <div
          className="easy-date-row easy-date-time"
          role="group"
          aria-label={`${name} time`}
        >
          <div className="easy-date-part easy-date-part-hour">
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

          <div className="easy-date-part easy-date-part-minute">
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
                <option value={draft.minute}>
                  {pad(Number(draft.minute))}
                </option>
              ) : null}
            </select>
          </div>

          <div className="easy-date-part easy-date-part-ampm">
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
      ) : null}
    </div>
  );
}
