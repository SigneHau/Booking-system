"use client"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { Paper } from "@mantine/core"
import { useUser } from "@/app/contexts/UserContext"
import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable from "@/app/components/UserBookingsTable"

const StudentBookingPage = () => {
  // -------------------------------------------------------------
  // Hent information om den aktuelle bruger
  // -------------------------------------------------------------
  const user = useUser()

  // -------------------------------------------------------------
  // State: Alle bookinger for denne bruger (inkl. lokale-info)
  // -------------------------------------------------------------
  const [bookings, setBookings] = useState<any[]>([])

  // -------------------------------------------------------------
  // Funktion: Henter ALLE bookinger som brugeren har lavet
  // + slår dem sammen med mødelokalernes info
  // -------------------------------------------------------------
  async function fetchBookings() {
    // Brugeren er måske ikke hentet endnu
    if (!user?.id) return

    // Hent alle bookinger som brugeren selv har lavet
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("created_by", user.id) // filtrér på bruger-id
      .order("date", { ascending: true }) // sortér efter dato

    // Hent ALLE mødelokaler (navn, kapacitet osv.)
    const { data: roomsData } = await supabase.from("meetingrooms").select("*")

    // Kombinér booking + tilhørende mødelokale
    const result = bookingsData?.map((b) => {
      const room = roomsData?.find((r) => r.roomid === b.roomid)

      return {
        ...b, // alle booking-data
        roomName: room ? `${room.roomid} – ${room.local}` : "Ukendt lokale",
        roomSize: room ? `${room.roomsize} personer` : "-",
      }
    })

    // Gem det hele i state → opdater UI
    setBookings(result || [])
  }

  // -------------------------------------------------------------
  // useEffect: Når user-data er hentet → hent alle bookinger.
  // (kører automatisk når siden loader)
  // -------------------------------------------------------------
  useEffect(() => {
    fetchBookings()
  }, [user]) // kør igen hvis user ændrer sig

  // -------------------------------------------------------------
  // UI: Overskrift + RoleBadge + indrammet tabel
  // -------------------------------------------------------------
  return (
    <div>
      {/* Sideoverskrift + lille rolle-badge */}
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Mine Bookinger</h1>
        <RoleBadge role={user?.role ?? "unknown"} />
      </div>

      {/* Card-ramme rundt om tabellen */}
      <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
        <div className="font-semibold text-lg mb-4">Bookinger</div>

        {/* Selve tabellen med bookinger (+ annuller-knappen) */}
        <UserBookingsTable bookings={bookings} refresh={fetchBookings} />
      </Paper>
    </div>
  )
}

export default StudentBookingPage

/*
  Hvad gør siden “StudentBookingPage”?

  Siden henter alle bookinger, som den aktuelle bruger har oprettet,
  kombinerer dem med mødelokalernes information, og viser resultatet
  i en tabel via UserBookingsTable. Den bruger useUser() til at kende
  den aktive bruger, fetchBookings() til at hente og samle data fra
  Supabase, og opdaterer UI automatisk når data ændrer sig.

  Kort fortalt:
  StudentBookingPage er brugerens “Mine Bookinger”-side, hvor alle
  egne bookinger vises, inkl. mulighed for at annullere dem.
*/
