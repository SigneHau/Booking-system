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

  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "Teacher",
  })

  const [rooms, setRooms] = useState<any[]>([])

  // -------------------------------------------------------------
  // 2️⃣ FLYTTET HEROP → så den bruges før useEffect
  // -------------------------------------------------------------
  async function fetchRooms() {
    const { floor, date, from, to } = filters
    
    if (!floor || !date || !from || !to) return

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
        booked: isBooked,
        bookings: safeBookings,
        availability: room.availability,
      })
    }

    setRooms(results)
  }

  // -------------------------------------------------------------
  // 3️⃣ Når filtre ændres → hent lokaler
  // -------------------------------------------------------------
  useEffect(() => {
    if (filters.floor && filters.date) {
      fetchRooms()
    }
  }, [filters])

  // -------------------------------------------------------------
  // UI Layout
  // -------------------------------------------------------------
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        {/* ⚡️ vis brugerens rolle */}
        <RoleBadge />
      </div>

      <FilterCard setFilters={setFilters} />

      <AvailableRoomsCard
        rooms={rooms}
        userId={user?.id ?? null} // 👈 send userId til TableRooms
        filters={filters}
        fetchRooms={fetchRooms}
      />
    </div>
  )
}
