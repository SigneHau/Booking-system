"use client"

import { useState, useEffect } from "react"
import { Paper } from "@mantine/core"
import { supabase } from "@/lib/supabaseClient"
import { useUser } from "@/hooks/useUser"
import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable from "@/app/components/UserBookingsTable"

const BookingPage = () => {
  const { user } = useUser()
  const [bookings, setBookings] = useState<any[]>([])

  // -------------------------------------------------------------
  // 4️⃣ Funktion: Henter ALLE bookinger som brugeren har lavet
  // + slår dem sammen med mødelokalernes info
  // -------------------------------------------------------------
  async function fetchBookings() {
    if (!user?.id) return // ⚡️ vent til user er hentet

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("created_by", user.id) // filtrér på bruger-id
      .order("starting_at", { ascending: false }) // Efter UX-TEST - Nyeste booking først - derfor bruger vi starting_at

    const { data: roomsData } = await supabase.from("meetingrooms").select("*")

    const result = bookingsData?.map((b) => {
      const room = roomsData?.find((r) => r.roomid === b.roomid)
      return {
        ...b,
        roomName: room ? `${room.roomid} – ${room.local}` : "Ukendt lokale",
        roomSize: room ? `${room.roomsize} personer` : "-",
      }
    })

    setBookings(result || [])
  }

  // -------------------------------------------------------------
  // 5️⃣ useEffect: Når user-data er hentet → hent alle bookinger
  // -------------------------------------------------------------
  useEffect(() => {
    fetchBookings()
  }, [user]) // ⚡️ kør igen når user ændres

  // -------------------------------------------------------------
  // 6️⃣ UI: Overskrift + RoleBadge + indrammet tabel
  // -------------------------------------------------------------
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Mine Bookinger</h1>
        <RoleBadge />
      </div>

      <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
        <div className="font-semibold text-lg mb-4">Bookinger</div>

        <UserBookingsTable bookings={bookings} refresh={fetchBookings} />
      </Paper>
    </div>
  )
}

export default BookingPage
