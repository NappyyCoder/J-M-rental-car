import type { Vehicle } from '../types'

export function todayISO(): string {
  return toISO(new Date())
}

export function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function compareISO(a: string, b: string): number {
  return a.localeCompare(b)
}

/** Inclusive list of YYYY-MM-DD from start through end. */
export function eachDateISO(start: string, end: string): string[] {
  const from = parseISO(start)
  const to = parseISO(end)
  if (from > to) return eachDateISO(end, start)

  const dates: string[] = []
  const cur = new Date(from)
  while (cur <= to) {
    dates.push(toISO(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export type CalendarCell = {
  iso: string
  inMonth: boolean
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function weekdayLabels() {
  return WEEKDAY_LABELS
}

/** Grid of days for a month view (includes leading/trailing outside-month days). */
export function monthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month, 1)
  const startOffset = first.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  const cells: CalendarCell[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    cells.push({
      iso: toISO(d),
      inMonth: d.getMonth() === month,
    })
  }
  return cells
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

export function isAvailableOn(vehicle: Vehicle, date: string): boolean {
  return !vehicle.unavailableDates.includes(date)
}

/** First open day after fromDate, searching up to maxDays ahead. */
export function nextAvailableDate(
  vehicle: Vehicle,
  fromDate: string,
  maxDays = 120,
): string | null {
  if (isAvailableOn(vehicle, fromDate)) return null

  const blocked = new Set(vehicle.unavailableDates)
  const cursor = parseISO(fromDate)
  cursor.setDate(cursor.getDate() + 1)

  for (let i = 0; i < maxDays; i++) {
    const iso = toISO(cursor)
    if (!blocked.has(iso)) return iso
    cursor.setDate(cursor.getDate() + 1)
  }

  return null
}

export function formatDisplayDate(iso: string) {
  return parseISO(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
