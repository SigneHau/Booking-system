import { supabase } from "./supabaseClient"
import { formatDateISO, createDateTime } from "./formatDate"
import { Filters } from "./types"

//Typer - typescript -  type-definitioner.
// Booking-type beskriver en booking
type Booking = { id: number; roomid: string; starting_at: string; ending_at: string }

// Room-type beskriver et lokale med basale oplysninger
type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
}

// AvailableRoom udvider Room med info om bookinger og ledighed
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

// Henter lokaler fra databasen ud fra valgt etage og brugerrolle
async function fetchRooms(floor: number, isStudent: boolean) {
  let query = supabase.from("meetingrooms").select("*").eq("floor", floor)
  if (isStudent) query = query.eq("local", "Mødelokale") // Studerende må kun se mødelokaler
  const { data, error } = await query  // udfører forespørgslen og får data eller fejl
  if (error) console.warn("fetchRooms failed:", error.message, error)
  return data ?? [] // returnerer tomt array hvis der ikke er data
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

// Henter alle tilgængelige lokaler baseret på filtre og brugerrolle
export async function fetchAvailableRooms(filters: Filters, isStudent: boolean) {
  const { floor, date, from, to } = filters
  if (!floor || !date || !from || !to) return [] // stop hvis filtre mangler

  const dateStr = formatDateISO(date)                  // formater dato til ISO
  const userStart = createDateTime(dateStr, from)      // starttidspunkt
  const userEnd = createDateTime(dateStr, to)          // sluttidspunkt

  const rooms = await fetchRooms(floor, isStudent)    // hent lokaler for etage
  if (!rooms.length) return []                        // stop hvis ingen lokaler

  const roomsIds = rooms.map((r) => r.roomid)         // hent roomIds
  const bookings = await fetchBookings(roomsIds, dateStr) // hent bookinger for disse rum

  // Kombiner rum med deres bookings og beregn ledighed
  const availableRooms: AvailableRoom[] = rooms.map((room) =>
    roomWithAvailability(room, bookings, userStart, userEnd)
  )

  return availableRooms // returner array med lokaler inkl. bookings og "booked" status
}

