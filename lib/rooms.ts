import { supabase } from "./supabaseClient"
import { Filters } from "./types"

export type AvailableRoom = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
  booked: boolean
  bookings: { id: number; starting_at: string; ending_at: string }[]
}

// Hent alle etager
// -------------------------------------------------------------
export async function getFloors() {
  const { data, error } = await supabase
    .from("meetingrooms")
    .select("floor")
    .order("floor", { ascending: true })

  if (error || !data) return []

  return [...new Set(data.map((f) => f.floor))]
}

export async function fetchAvailableRooms(filters: Filters, isStudent: boolean) {
  const { floor, date, from, to } = filters
  if (!floor || !date || !from || !to) return []

  const dateStr = date.toISOString().split("T")[0]

  let base = supabase.from("meetingrooms").select("*").eq("floor", floor)
  if (isStudent) base = base.eq("local", "Mødelokale")

  const { data: roomsData } = await base
  const safeRooms = roomsData ?? []
  const results: AvailableRoom[] = []

  for (const room of safeRooms) {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("roomid", room.roomid)
      .eq("date", dateStr)

    const safeBookings = bookings ?? []

    const userStart = new Date(`${dateStr}T${from}`)
    const userEnd = new Date(`${dateStr}T${to}`)

    const isBooked = safeBookings.some((b) => {
      const start = new Date(b.starting_at)
      const end = new Date(b.ending_at)
      return (
        (userStart >= start && userStart < end) ||
        (userEnd > start && userEnd <= end) ||
        (userStart <= start && userEnd >= end)
      )
    })

    results.push({
      ...room,
      booked: isBooked,
      bookings: safeBookings,
      availability: room.availability,
    })
  }

  return results
}
