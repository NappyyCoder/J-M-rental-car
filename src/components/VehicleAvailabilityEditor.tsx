import { useState } from 'react'
import { formatDisplayDate, todayISO } from '../lib/dates'

type Props = {
  vehicleId: string
  vehicleTitle: string
  unavailableDates: string[]
  disabled?: boolean
  onAddDate: (date: string) => Promise<void>
  onAddRange: (start: string, end: string) => Promise<void>
  onRemoveDate: (date: string) => Promise<void>
  onClearAll: () => Promise<void>
  onDelete: () => void
}

export function VehicleAvailabilityEditor({
  vehicleId,
  vehicleTitle,
  unavailableDates,
  disabled = false,
  onAddDate,
  onAddRange,
  onRemoveDate,
  onClearAll,
  onDelete,
}: Props) {
  const [singleDate, setSingleDate] = useState('')
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')
  const [busy, setBusy] = useState(false)

  const sortedDates = [...unavailableDates].sort()

  async function run(action: () => Promise<void>) {
    setBusy(true)
    try {
      await action()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="avail-editor">
      <p className="avail-editor-intro">
        Enter the date or dates when <strong>{vehicleTitle}</strong> should be unavailable.
      </p>

      <div className="avail-editor-section">
        <p className="avail-editor-label">Single day</p>
        <div className="avail-editor-row">
          <div className="field">
            <label htmlFor={`unavail-date-${vehicleId}`}>Unavailable date</label>
            <input
              id={`unavail-date-${vehicleId}`}
              type="date"
              value={singleDate}
              min={todayISO()}
              onChange={(e) => setSingleDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={disabled || busy || !singleDate}
            onClick={() => {
              if (!singleDate) return
              void run(async () => {
                await onAddDate(singleDate)
                setSingleDate('')
              })
            }}
          >
            Mark unavailable
          </button>
        </div>
      </div>

      <div className="avail-editor-section">
        <p className="avail-editor-label">Multiple days</p>
        <div className="avail-editor-range">
          <div className="field">
            <label htmlFor={`unavail-from-${vehicleId}`}>From</label>
            <input
              id={`unavail-from-${vehicleId}`}
              type="date"
              value={rangeStart}
              min={todayISO()}
              onChange={(e) => setRangeStart(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor={`unavail-to-${vehicleId}`}>To</label>
            <input
              id={`unavail-to-${vehicleId}`}
              type="date"
              value={rangeEnd}
              min={rangeStart || todayISO()}
              onChange={(e) => setRangeEnd(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={disabled || busy || !rangeStart || !rangeEnd}
            onClick={() => {
              if (!rangeStart || !rangeEnd) return
              void run(async () => {
                await onAddRange(rangeStart, rangeEnd)
                setRangeStart('')
                setRangeEnd('')
              })
            }}
          >
            Mark range unavailable
          </button>
        </div>
      </div>

      <div className="avail-editor-section">
        <p className="avail-editor-label">
          Currently unavailable ({sortedDates.length})
        </p>
        {sortedDates.length === 0 ? (
          <p className="avail-editor-empty">No booked dates yet. This car is open every day.</p>
        ) : (
          <ul className="avail-editor-dates">
            {sortedDates.map((blockedDate) => (
              <li key={blockedDate}>
                <span>{formatDisplayDate(blockedDate)}</span>
                <button
                  type="button"
                  className="admin-date-remove"
                  disabled={disabled || busy}
                  onClick={() => void run(() => onRemoveDate(blockedDate))}
                >
                  Make available
                </button>
              </li>
            ))}
          </ul>
        )}
        {sortedDates.length > 0 && (
          <button
            type="button"
            className="btn btn-sm btn-outline avail-clear-btn"
            disabled={disabled || busy}
            onClick={() => {
              if (!confirm(`Clear all unavailable dates for ${vehicleTitle}?`)) return
              void run(onClearAll)
            }}
          >
            Clear all dates
          </button>
        )}
      </div>

      <div className="avail-editor-footer">
        <button
          type="button"
          className="btn btn-sm btn-danger"
          disabled={disabled || busy}
          onClick={onDelete}
        >
          Delete car
        </button>
      </div>
    </div>
  )
}
