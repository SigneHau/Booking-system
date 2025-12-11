"use client"

import { useState, useEffect } from "react"
import FilterCard from "../../components/FilterCard"
import AvailableRoomsCard from "../../components/AvailableRoomsCard"
import RoleBadge from "@/app/components/RoleBadge"
import { useUser, type User } from "@/hooks/useUser"
import { supabase } from "@/lib/supabaseClient"

type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: User["role"]
}

export default function Dashboard() {
  // -------------------------------------------
  // STATE: bruger + filtre
  // -------------------------------------------
  const { user, isStudent } = useUser() 
  // custom hook der henter den loggede bruger og om det er student/lærer

  // EFTER UX TEST - STATE: til loadingspinner
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "Teacher", // default værdi for filterkortet, ikke brugerens rolle
  })

  const [rooms, setRooms] = useState<any[]>([])
  // -------------------------------------------------------------
  // Funktion: hent lokaler
  // -------------------------------------------------------------
  async function fetchRooms() {
    const { floor, date, from, to } = filters
    
    if (!floor || !date || !from || !to) return
    setLoadingSpinner(true) // <-- START LOADING spinner mens data hentes

    const dateStr = date.toISOString().split("T")[0]

    const base = supabase
      .from("meetingrooms")
      .select("*")
      .eq("floor", floor)

    const query = isStudent
      ? base.eq("local", "Mødelokale") // Studerende: kun Mødelokale
      : base // Lærere: alle lokaler på etagen

    const { data: roomsData } = await query
    const safeRooms = roomsData ?? []
    const results: any[] = []

    for (const room of safeRooms) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("roomid", room.roomid)
        .eq("date", dateStr)

      const safeBookings = bookings ?? []

      const userStart = new Date(`${dateStr}T${from}`)
      const userEnd = new Date(`${dateStr}T${to}`)

      const isBooked = safeBookings.some((b) => {
        const start = new Date(b.starting_at)
        const end = new Date(b.ending_at)

        return (
          (userStart >= start && userStart < end) ||
          (userEnd > start && userEnd <= end) ||
          (userStart <= start && userEnd >= end)
        )
      })

      results.push({
        ...room,
        booked: isBooked, // markerer om lokalet er ledigt
        bookings: safeBookings,
        availability: room.availability,
      })
    }

    setRooms(results)
    setLoadingSpinner(false) // <-- STOP LOADING
  }

  // -------------------------------------------------------------
  // useEffect: når filtre ændres, hent lokaler igen
  // -------------------------------------------------------------
  useEffect(() => {
    if (filters.floor && filters.date) {
      fetchRooms() // automatisk hent når filtre ændres
    }
  }, [filters])

  // -------------------------------------------------------------
  // UI Layout
  // -------------------------------------------------------------
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        <RoleBadge /> {/* viser brugerens rolle */}
      </div>

      <FilterCard setFilters={setFilters} loadingSpinner={loadingSpinner} />
      {/* filterkort med valgmuligheder + spinner */}

      <AvailableRoomsCard
        rooms={rooms}
        userId={user?.id ?? null} // send userId til TableRooms
        filters={filters}
        fetchRooms={fetchRooms} // mulighed for at opdatere lokaler igen
      />
    </div>
  )
}

// -------------------------------------------------------------
// Kort opsummering til eksamen:
// - useUser: finder logget bruger og om det er student/lærer
// - filters.role: default værdi for UI, ikke faktisk brugerrolle
// - fetchRooms: henter lokaler fra supabase, tjekker bookings, bruger isStudent til permissions
// - loadingSpinner: viser spinner mens lokaler hentes
// - useEffect: automatisk opdatering når filtre ændres
// - UI: viser role badge, filterkort og tilgængelige lokaler
// -------------------------------------------------------------
