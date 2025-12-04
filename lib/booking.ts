import { supabase } from "./supabaseClient"

//
// -------------------------------------------------------------
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
  const dateStr = date.toISOString().split("T")[0]

  const { data, error } = await supabase.from("bookings").insert({
    roomid,
    date: dateStr,
    starting_at: `${dateStr}T${from}`,
    ending_at: `${dateStr}T${to}`,
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
