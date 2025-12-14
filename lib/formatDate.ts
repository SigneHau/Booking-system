import dayjs from "dayjs" // dato/tid-hjælper
import "dayjs/locale/da"
dayjs.locale("da") // sætter dansk lokalitet til dansk

// Formaterer en Date til dansk klokkeslæt (HH:mm)
export const formatTimeDK = (date: Date): string => {
  return dayjs(date).format("HH:mm") // fx 09:30
}

// Formaterer en Date til dansk datoformat (DD-MM-YYYY)
export const formatDateDK = (date: Date): string => {
  return dayjs(date).format("DD-MM-YYYY") // fx 01-12-2025
}

// Tager en ISO- eller almindelig tidstreng og returnerer kun HH:mm
export const extractTime = (timeStr: string): string => {
  if (timeStr.includes("T")) {
    return dayjs(timeStr).format("HH:mm") // ISO-streng → 08:00
  }

  return timeStr.slice(0, 5) // fx 09:30:00 → 09:30
}

// Formaterer en Date til ISO-dato (YYYY-MM-DD)
export const formatDateISO = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD") // fx 2025-12-01
}

// Opretter en Date ud fra dato + tid-strenge
export const createDateTime = (dateStr: string, timeStr: string): Date => {
  return dayjs(`${dateStr}T${timeStr}`).toDate()
}

// Kombinerer dato + tid til ISO-string
export const createDateTimeString = (dateStr: string, timeStr: string): string => {
  return `${dateStr}T${timeStr}` // fx 2025-12-01T09:30
}

// Lægger X antal dage til en Date
export const addDays = (date: Date, days: number): Date => {
  return dayjs(date).add(days, "day").toDate()
}
