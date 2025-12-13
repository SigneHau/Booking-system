import { supabase } from "./supabaseClient"
import { formatDateISO, createDateTimeString } from "./formatDate"
import dayjs from "dayjs"

//
// -------------------------------------------------------------
// Opret booking
// -------------------------------------------------------------
export async function createBooking(params: {
  roomid: string
  date: Date
  from: string
  to: string
  userId: string
}) {
  const { roomid, date, from, to, userId } = params
  const dateStr = formatDateISO(date)

  const { data, error } = await supabase.from("bookings").insert({
    roomid,
    date: dateStr,
    starting_at: createDateTimeString(dateStr, from),
    ending_at: createDateTimeString(dateStr, to),
    created_by: userId,
  })

  if (error) {
    if (error.message.includes("bookings_no_overlap")) {
      throw new Error("Dette tidspunkt er allerede booket. Vælg et andet tidsrum.")
    }
    throw new Error("Der opstod en fejl under booking.")
  }

  return data
}


// -------------------------------------------------------------
// Funktion: Henter alle bookinger for en given bruger
// + slår dem sammen med mødelokalernes info
// -------------------------------------------------------------
export async function getUserBookings(userId: string) {
  // ⚡️ Hvis der ikke er noget userId, returnér tom liste
  if (!userId) return []

  // Hent alle bookinger for brugeren
  const { data: bookingsData } = await supabase
    .from("bookings")
    .select("*")
    .eq("created_by", userId)

  // Hent info om mødelokaler
  const { data: roomsData } = await supabase.from("meetingrooms").select("*")

  if (!bookingsData || bookingsData.length === 0) return []

  // Slå bookinger og lokaler sammen
  const bookings = bookingsData.map((b) => {
    const room = roomsData?.find((r) => r.roomid === b.roomid)
    return {
      ...b,
      roomName: room ? `${room.roomid} – ${room.local}` : "Ukendt lokale",
      roomSize: room ? `${room.roomsize} personer` : "-",
    }
  })

  // Sortér efter created_at (nyeste først) for at finde seneste booking
  const sortedByCreated = [...bookings].sort((a, b) =>
    dayjs(b.created_at).diff(dayjs(a.created_at))
  )

  const [newestBooking, ...rest] = sortedByCreated

  // Sortér resten efter nærmeste dato (ascending)
  const remainingBookings = rest.sort((a, b) =>
    dayjs(a.starting_at).diff(dayjs(b.starting_at))
  )

  // Returner: senest oprettede først, derefter sorteret efter nærmeste dato
  return [newestBooking, ...remainingBookings]
}


//
// -------------------------------------------------------------
// Slet booking
// -------------------------------------------------------------
export async function deleteBooking(id: number) {
  const { error } = await supabase.from("bookings").delete().eq("id", id)

  if (error) {
    throw new Error("Kunne ikke annullere booking.")
  }

  return true
}
