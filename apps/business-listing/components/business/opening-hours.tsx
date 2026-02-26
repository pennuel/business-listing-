"use client"

// ─── Constants ────────────────────────────────────────────────────────────────

export const DAY_ENTRIES = [
  { key: "monday",    cap: "Monday",    group: "weekday" },
  { key: "tuesday",   cap: "Tuesday",   group: "weekday" },
  { key: "wednesday", cap: "Wednesday", group: "weekday" },
  { key: "thursday",  cap: "Thursday",  group: "weekday" },
  { key: "friday",    cap: "Friday",    group: "weekday" },
  { key: "saturday",  cap: "Saturday",  group: "weekend" },
  { key: "sunday",    cap: "Sunday",    group: "weekend" },
]

/** Maps day key → JS getDay() index (0 = Sunday) */
export const DAY_KEY_TO_INDEX: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Reads the schedule string for a given day from the business object.
 * Handles both lowercase keys ("thursday") and capitalized keys ("Thursday")
 * stored by the DB, as well as plain-string schedules.
 */
export function getScheduleForDay(business: any, dayKey: string): string | null {
  const wd = business.weekdaySchedule ?? business.schedule?.weekday
  const we = business.weekendSchedule ?? business.schedule?.weekend
  const isWeekend = dayKey === "saturday" || dayKey === "sunday"
  const capitalKey = dayKey.charAt(0).toUpperCase() + dayKey.slice(1)
  const src = isWeekend ? we : wd
  if (typeof src === "object" && src !== null) {
    return src[dayKey] ?? src[capitalKey] ?? null
  }
  if (typeof src === "string") return src
  return null
}

/**
 * Parses a time string to minutes since midnight.
 * Supports 24-hour format ("09:00", "17:30") and 12-hour format ("9:00 AM", "5:00 PM").
 */
export function parseTimeToMinutes(timeStr: string): number {
  const str = timeStr.trim()
  // 24-hour: "09:00"
  const match24 = str.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) return parseInt(match24[1]) * 60 + parseInt(match24[2])
  // 12-hour: "9:00 AM" / "5:00 PM"
  const match12 = str.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)$/i)
  if (!match12) return -1
  let h = parseInt(match12[1])
  const m = parseInt(match12[2] ?? "0")
  const ampm = match12[3]?.toUpperCase()
  if (ampm === "PM" && h !== 12) h += 12
  if (ampm === "AM" && h === 12) h = 0
  return h * 60 + m
}

/**
 * Returns the live open/closed status + a human-readable message for the business.
 */
export function getCurrentStatus(business: any): { isOpen: boolean; message: string } {
  if (business.isManuallyOpen === true)  return { isOpen: true,  message: "Open Now (Owner set)" }
  if (business.isManuallyOpen === false) return { isOpen: false, message: "Closed (Owner set)" }

  try {
    const now = new Date()
    const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayKey = dayKeys[now.getDay()]
    const schedStr = getScheduleForDay(business, todayKey)

    if (!schedStr || schedStr.toLowerCase() === "closed") {
      return { isOpen: false, message: "Closed Today" }
    }

    const parts = schedStr.split("-").map((s: string) => s.trim())
    if (parts.length < 2) return { isOpen: true, message: schedStr }

    const openMin  = parseTimeToMinutes(parts[0])
    const closeMin = parseTimeToMinutes(parts[1])
    const nowMin   = now.getHours() * 60 + now.getMinutes()

    if (openMin < 0 || closeMin < 0) return { isOpen: true, message: schedStr }
    if (nowMin >= openMin && nowMin <= closeMin) return { isOpen: true,  message: `Open · Closes at ${parts[1]}` }
    if (nowMin < openMin)                        return { isOpen: false, message: `Closed · Opens at ${parts[0]}` }
    return { isOpen: false, message: "Closed" }
  } catch {
    return { isOpen: false, message: "Hours not available" }
  }
}

// ─── Components ───────────────────────────────────────────────────────────────

interface OpeningHoursProps {
  business: any
}

/**
 * Renders the full 7-day opening hours table.
 * Today's row is highlighted in blue; closed days are shown in red.
 */
export function OpeningHours({ business }: OpeningHoursProps) {
  const todayIndex = new Date().getDay()

  return (
    <div className="space-y-2.5">
      {DAY_ENTRIES.map(({ key, cap }) => {
        const schedStr = getScheduleForDay(business, key)
        const isClosed = !schedStr || schedStr.toLowerCase() === "closed"
        const isToday  = DAY_KEY_TO_INDEX[key] === todayIndex

        return (
          <div
            key={key}
            className={`flex justify-between items-center text-sm ${isToday ? "font-semibold" : ""}`}
          >
            <span className={isToday ? "text-blue-600" : "text-gray-500"}>
              {cap}{isToday && " ·"}
            </span>
            <span className={isClosed ? "text-red-500 font-medium" : "text-gray-900"}>
              {isClosed ? "Closed" : schedStr}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Renders the open/closed status badge (the pulsing dot + message).
 * Designed for use on hero / banner sections.
 */
export function BusinessStatusBadge({ business }: { business: any }) {
  const status = getCurrentStatus(business)
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
      <span>{status.message}</span>
    </div>
  )
}
