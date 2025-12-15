import { supabase } from "./supabaseClient"
import { formatDateISO, createDateTimeString } from "./formatDate"
import dayjs from "dayjs"

// Opret booking
export async function createBooking(params: {
  roomid: string
  date: Date
  from: string
  to: string
  userId: string
}) {
 // Vi bruger destructuring til at hente værdier fra params-objektet, så vi kan bruge dem direkte i koden, fx til at gemme i databasen.
  const { roomid, date, from, to, userId } = params

  // Formatér dato til ISO-format (YYYY-MM-DD)
  const dateStr = formatDateISO(date)

  // Gem booking i databasen
  const { data, error } = await supabase.from("bookings").insert({
    roomid,                                           // hvilket lokale
    date: dateStr,                                    // dato for booking
    starting_at: createDateTimeString(dateStr, from), // starttidspunkt
    ending_at: createDateTimeString(dateStr, to),     // sluttidspunkt
    created_by: userId,                               // hvem har oprettet bookingen
  })


  // Databasen sikrer, at der ikke kan oprettes dobbeltbookinger
  // Her oversætter vi databasefejlen til en brugervenlig besked
  if (error) {
    if (error.message.includes("bookings_no_overlap")) {
      throw new Error("Dette tidspunkt er allerede booket. Vælg et andet tidsrum.")
    }
    throw new Error("Der opstod en fejl under booking.")
  }

  // Returnér den oprettede booking
  return data
}
// Funktion: Henter alle bookinger for en given bruger
// + slår dem sammen med mødelokalernes info
export async function getUserBookings(userId: string) {
  // Hvis der ikke er noget userId, returnér tom liste
  if (!userId) return []

  // Hent alle bookinger for brugeren
  const { data: bookingsData } = await supabase
    .from("bookings")              // fra bookings-tabellen
    .select("*")                   // hent alle felter
    .eq("created_by", userId)      // kun bookinger lavet af denne bruger

  // Hent info om mødelokaler
  const { data: roomsData } = await supabase
    .from("meetingrooms")          // fra meetingrooms-tabellen
    .select("*")                   // hent alle felter

  // Hvis der ingen bookinger er, stop og returnér en tom liste
  if (!bookingsData || bookingsData.length === 0) return []

  // Slå bookinger og lokaler sammen
  const bookings = bookingsData.map((b) => {
    // Find det lokale der matcher bookingens roomid
    const room = roomsData?.find((r) => r.roomid === b.roomid)

    // Returnér en ny booking med ekstra info
   // Returnér en ny booking med ekstra info
    return {
     ...b, // behold alle booking-data
      roomName: room ? `${room.roomid} – ${room.local}` : "Ukendt lokale", // lokalets navn eller fallback
      roomSize: room ? `${room.roomsize} personer` : "-", // antal personer eller fallback
    }

  })

  // Sortér efter created_at (nyeste først)
  const sortedByCreated = [...bookings].sort((a, b) =>
    dayjs(b.created_at).diff(dayjs(a.created_at))
  )

  // Gem den nyeste booking separat
  const [newestBooking, ...rest] = sortedByCreated

  // Sortér resten efter nærmeste starttidspunkt
  const remainingBookings = rest.sort((a, b) =>
    dayjs(a.starting_at).diff(dayjs(b.starting_at))
  )

  // Returnér: nyeste booking først, derefter kommende bookinger
  return [newestBooking, ...remainingBookings]
}




// Slet booking
export async function deleteBooking(id: number) {
  // Slet booking med matchende id
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)

  // Fejlhåndtering
  if (error) {
    throw new Error("Kunne ikke annullere booking.")
  }

  // Bekræft at sletning lykkedes
  return true
}
