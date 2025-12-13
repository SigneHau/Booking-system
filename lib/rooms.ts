import { supabase } from "./supabaseClient"
import { formatDateISO, createDateTime } from "./formatDate"
import { Filters } from "./types"

type Booking = { id: number; roomid: string; starting_at: string; ending_at: string }

type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
}

export type AvailableRoom = Room & {
  booked: boolean
  bookings: Booking[]
}

// Hent alle etager
export async function getFloors() {
  const { data, error } = await supabase
    .from("meetingrooms")
    .select("floor")
    .order("floor", { ascending: true })

  if (error || !data) return []

  return [...new Set(data.map((f) => f.floor))]
}

async function fetchRooms(floor: number, isStudent: boolean) {
  let query = supabase.from("meetingrooms").select("*").eq("floor", floor)
  if (isStudent) query = query.eq("local", "Mødelokale")
  const { data, error } = await query
  if (error) console.warn("fetchRooms failed:", error.message, error)
  return data ?? []
}

async function fetchBookings(roomIds: string[], dateStr: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .in("roomid", roomIds)
    .eq("date", dateStr)
  if (error) console.warn("fetchBookings failed:", error.message, error)
  return data ?? []
}

// Returnerer true hvis brugerens tidsrum (userStart→userEnd) overlapper med en eksisterende booking.
function hasTimeConflict(roomBookings: Booking[], userStart: Date, userEnd: Date) {
  return roomBookings.some((b) => {
    const start = new Date(b.starting_at)
    const end = new Date(b.ending_at)
    return (
      (userStart >= start && userStart < end) ||
      (userEnd > start && userEnd <= end) ||
      (userStart <= start && userEnd >= end)
    )
  })
}

/**
 * Returnerer et rum udvidet med booking-liste og en samlet "booked" status
 */
function roomWithAvailability(room: Room, allBookings: Booking[], userStart: Date, userEnd: Date): AvailableRoom {
  const roomBookings = allBookings.filter((b) => b.roomid === room.roomid)

  return {
    ...room,
    booked: hasTimeConflict(roomBookings, userStart, userEnd),
    bookings: roomBookings,
  }
}

export async function fetchAvailableRooms(filters: Filters, isStudent: boolean) {
  const { floor, date, from, to } = filters
  if (!floor || !date || !from || !to) return []

  const dateStr = formatDateISO(date)
  const userStart = createDateTime(dateStr, from)
  const userEnd = createDateTime(dateStr, to)

  const rooms = await fetchRooms(floor, isStudent)
  if (!rooms.length) return []

  const roomsIds = rooms.map((r) => r.roomid)
  const bookings = await fetchBookings(roomsIds, dateStr)

  const availableRooms: AvailableRoom[] = rooms.map((room) =>
    roomWithAvailability(room, bookings, userStart, userEnd)
  )
  return availableRooms
}
