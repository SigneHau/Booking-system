import dayjs from "dayjs" // dato/tid-hjælper
import "dayjs/locale/da"
dayjs.locale("da")

export const formatTimeDK = (date: Date): string => {
  return dayjs(date).format("HH:mm") // fx 09:30
}

export const formatDateDK = (date: Date): string => {
  return dayjs(date).format("DD-MM-YYYY") // fx 01-12-2025
}

export const extractTime = (timeStr: string): string => {
  if (timeStr.includes("T")) {
    return dayjs(timeStr).format("HH:mm") // ISO-dato/tid: 2025-11-20T08:00:00 → 08:00
  }

  return timeStr.slice(0, 5) // tid: 09:30:00 → 09:30
}

export const formatDateISO = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD") // fx 2025-12-01
}

export const createDateTime = (dateStr: string, timeStr: string): Date => {
  return dayjs(`${dateStr}T${timeStr}`).toDate() // laver Date ud fra dato + tid
}

export const createDateTimeString = (dateStr: string, timeStr: string): string => {
  return `${dateStr}T${timeStr}` // fx 2025-12-01T09:30
}

export const addDays = (date: Date, days: number): Date => {
  return dayjs(date).add(days, "day").toDate() // læg X dage til
}
