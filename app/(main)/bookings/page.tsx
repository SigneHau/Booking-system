"use client"
import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { Paper } from "@mantine/core"

import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable from "@/app/components/UserBookingsTable"
import { getUser } from "@/lib/auth" // ⚡️ hent getUser

const BookingPage = () => {
  // -------------------------------------------------------------
  // 1️⃣ STATE: Hent og gem den aktuelle bruger
  // -------------------------------------------------------------
  const [user, setUser] = useState<{
    id: string
    email: string
    full_name: string
    role: "student" | "teacher"
  } | null>(null)

  // -------------------------------------------------------------
  // 2️⃣ STATE: Alle bookinger for denne bruger (inkl. lokale-info)
  // -------------------------------------------------------------
  const [bookings, setBookings] = useState<any[]>([])

  // -------------------------------------------------------------
  // 3️⃣ HENT BRUGER NÅR COMPONENT MOUNTES
  // -------------------------------------------------------------
  useEffect(() => {
    async function loadUser() {
      const currentUser = await getUser()
      if (currentUser) {
        setUser(currentUser)
      }
    }
    loadUser()
  }, [])

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
      .order("date", { ascending: true })

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
        <RoleBadge role={user?.role ?? "unknown"} />
      </div>

      <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
        <div className="font-semibold text-lg mb-4">Bookinger</div>

        <UserBookingsTable bookings={bookings} refresh={fetchBookings} />
      </Paper>
    </div>
  )
}

export default BookingPage
