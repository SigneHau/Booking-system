import { supabase } from "./supabaseClient"
import { formatDateISO, createDateTime } from "./formatDate"
import { Filters } from "./types"

// TypeScript typer

// Booking-type: én booking i databasen
type Booking = {
  id: number
  roomid: string
  starting_at: string
  ending_at: string
}

// Room-type: grunddata om et lokale
type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
}

// AvailableRoom: lokale udvidet med booking-status
export type AvailableRoom = Room & {
  booked: boolean        // true hvis lokalet er optaget i tidsrummet
  bookings: Booking[]   // alle bookinger for lokalet
}

// Hent alle etager fra databasen
export async function getFloors() {
  const { data, error } = await supabase
    .from("meetingrooms")
    .select("floor")                     // hent kun etage
    .order("floor", { ascending: true }) // sorter stigende

  if (error || !data) return []

  // Fjern dubletter og returnér unikke etager
  return [...new Set(data.map((f) => f.floor))]
}

// Henter lokaler baseret på etage og brugerrolle
async function fetchRooms(floor: number, isStudent: boolean) {
  let query = supabase
    .from("meetingrooms")
    .select("*")
    .eq("floor", floor)                  // filtrér på etage

  // Studerende må kun se mødelokaler
  if (isStudent) query = query.eq("local", "Mødelokale")

  const { data, error } = await query    // udfør forespørgslen
  if (error) console.warn("fetchRooms failed:", error.message, error)

  return data ?? []                      // fallback til tom liste
}

// Henter bookinger for valgte rum og dato
async function getRoomBookings(roomIds: string[], dateStr: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .in("roomid", roomIds)               // kun disse rum
    .eq("date", dateStr)                 // kun valgt dato

  if (error) console.warn("getRoomBookings failed:", error.message, error)

  return data ?? []
}

// Tjekker om brugerens tidsrum overlapper en booking
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

// Udvider et lokale med booking-liste og booked-status
function roomWithAvailability(
  room: Room,
  allBookings: Booking[],
  userStart: Date,
  userEnd: Date
): AvailableRoom {
  // Find bookinger der hører til dette lokale
  const roomBookings = allBookings.filter((b) => b.roomid === room.roomid)

  return {
    ...room,                                                  // behold lokalets data
    booked: hasTimeConflict(roomBookings, userStart, userEnd), // true ved overlap
    bookings: roomBookings,                                  // bookinger for lokalet
  }
}

// Henter alle lokaler med ledighed baseret på filtre og rolle
export async function fetchAvailableRooms(filters: Filters, isStudent: boolean) {
  const { floor, date, from, to } = filters

  // Stop hvis et filter mangler
  if (!floor || !date || !from || !to) return []

  const dateStr = formatDateISO(date)            // dato i ISO-format
  const userStart = createDateTime(dateStr, from) // starttidspunkt
  const userEnd = createDateTime(dateStr, to)     // sluttidspunkt

  const rooms = await fetchRooms(floor, isStudent)
  if (!rooms.length) return [] // Hvis ingen lokaler findes, stop funktionen og returnér tom liste

  const roomsIds = rooms.map((r) => r.roomid)     // hent roomIds
  const bookings = await getRoomBookings(roomsIds, dateStr) //getRoomBookings - en funktion ovenover på denne side

  // Kombinér lokaler med deres bookinger og ledighed
  const availableRooms: AvailableRoom[] = rooms.map((room) =>
    roomWithAvailability(room, bookings, userStart, userEnd)
  )

  return availableRooms
}

/*
Kort opsamling:

- getFloors(): Henter unikke etager fra meetingrooms-tabellen.
- fetchRooms(): Henter lokaler på en given etage; studerende ser kun mødelokaler.
- getRoomBookings(): Henter alle bookinger for udvalgte rum på en given dato.
- hasTimeConflict(): Tjekker om brugerens valgte tidsrum overlapper eksisterende bookinger.
- roomWithAvailability(): Udvider et lokale med booking-liste og booked-status.
- fetchAvailableRooms(): Henter alle lokaler med ledighed baseret på filtre og brugerrolle; kombinerer lokaler med bookinger og markerer, om de er bookede i det valgte tidsrum.

Kort sagt: Funktionen håndterer filtrering, tjek af overlap og giver en liste af lokaler med info om deres tilgængelighed.
*/