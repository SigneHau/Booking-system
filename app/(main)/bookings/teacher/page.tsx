"use client"

import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { Paper } from "@mantine/core"
import { useUser } from "@/app/contexts/UserContext"
import RoleBadge from "@/app/components/RoleBadge"
import UserBookingsTable from "@/app/components/UserBookingsTable"

const TeacherBookingPage = () => {
  const user = useUser()
  const [bookings, setBookings] = useState<any[]>([])

  // Funktion: Hent ALLE bookinger for den aktuelle bruger
  // ÆNDRING TIL TEACHER: Tillad bookinger op til et halvt år frem
  async function fetchBookings() {
    if (!user?.id) return

    const today = new Date()
    const sixMonthsAhead = new Date()
    sixMonthsAhead.setMonth(today.getMonth() + 6)

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("created_by", user.id)
      .gte("date", today.toISOString().split("T")[0]) // Start fra i dag
      .lte("date", sixMonthsAhead.toISOString().split("T")[0]) // Op til 6 måneder frem
      .order("date", { ascending: true })

    // Hent info om alle lokaler
    const { data: roomsData } = await supabase.from("meetingrooms").select("*")

    // Kombiner booking + lokale-info
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

  // useEffect: hent bookinger når user-data er tilgængelig
  useEffect(() => {
    fetchBookings()
  }, [user])

  // UI Layout
  return (
    <div>
      {/* Sideoverskrift + RoleBadge */}
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Mine Bookinger</h1>
        <RoleBadge role={user?.role ?? "unknown"} />
      </div>

      {/* Card-ramme rundt om tabellen */}
      <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
        <div className="font-semibold text-lg mb-4">Bookinger</div>

        {/* Tabel med alle bookinger + mulighed for at annullere */}
        <UserBookingsTable bookings={bookings} refresh={fetchBookings} />
      </Paper>
    </div>
  )
}

export default TeacherBookingPage
