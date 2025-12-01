"use client"

import { useState, useEffect } from "react"
import FilterCard from "../../../components/FilterCard"
import AvailableRoomsCard from "../../../components/AvailableRoomsCard"
import { supabase } from "@/lib/supabaseClient"
import RoleBadge from "@/app/components/RoleBadge"
import { useUser } from "@/app/contexts/UserContext"

// Filters fortæller hvilke kriterier brugeren har valgt
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

export default function StudentDashboard() {
  // Henter info om den logged-in bruger via UserContext
  const user = useUser()
  // State: hvilke filtre brugeren har valgt
  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "student",
  })
  // State: listen af alle lokaler + status (ledig/optaget)
  const [rooms, setRooms] = useState<any[]>([])

  //
  // -------------------------------------------------------------
  // Hver gang brugeren ændrer etage eller dato → hent nye lokaler
  // -------------------------------------------------------------
  //
  useEffect(() => {
    if (filters.floor && filters.date) {
      fetchRooms()
    }
  }, [filters])

  //
  // -------------------------------------------------------------
  // fetchRooms() → henter lokaler + bookinger for den valgte dag
  // -------------------------------------------------------------
  //
  async function fetchRooms() {
    const { floor, date, from, to, role } = filters
    // Stop hvis vigtige filtre mangler
    if (!floor || !date || !from || !to) return

    // Ensartet datoformat til databasen
    const dateStr = date.toISOString().split("T")[0]

    //
    // 1️⃣ Hent lokaler fra den valgte etage
    //
    let query = supabase.from("meetingrooms").select("*").eq("floor", floor)

    // Studerende må kun se mødelokaler → filtrér!
    if (role === "student") {
      query = query.eq("local", "Mødelokale")
    }

    const { data: roomsData } = await query
    const safeRooms = roomsData ?? []

    const results: any[] = []

    //
    // 2️⃣ For hvert lokale → hent dagens bookinger
    //
    for (const room of safeRooms) {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("roomid", room.roomid)
        .eq("date", dateStr)

      const safeBookings = bookings ?? []
      //
      // 3️⃣ Tjek om lokalet er optaget i det ønskede tidsrum
      //
      const userStart = new Date(`${dateStr}T${from}`)
      const userEnd = new Date(`${dateStr}T${to}`)

      const isBooked = safeBookings.some((b) => {
        const start = new Date(b.starting_at)
        const end = new Date(b.ending_at)

        // Tjek for overlap mellem brugerens valgte tidspunkt og eksisterende bookinger
        return (
          (userStart >= start && userStart < end) ||
          (userEnd > start && userEnd <= end) ||
          (userStart <= start && userEnd >= end)
        )
      })

      //
      // 4️⃣ Tilføj alle opdaterede oplysninger til resultaterne
      //
      results.push({
        ...room,
        booked: isBooked, // bruges til at disable “Book”-knappen
        bookings: safeBookings, // bruges til at vise ALLE bookinger i tabellen
        availability: room.availability,
      })
    }

    //
    // 5️⃣ Opdater UI med de nye resultater
    //
    setRooms(results)
  }

  //
  // -------------------------------------------------------------
  // UI Layout
  // -------------------------------------------------------------
  //
  return (
    <div>
      {/* Sideoverskrift + viser brugerens rolle */}
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        <RoleBadge role={user?.role ?? "unknown"} />
      </div>

      {/* Filter-kortet hvor brugeren vælger dato, tidspunkt, etage */}
      <FilterCard setFilters={setFilters} />

      {/* Listen over lokaler, inkl. bookinger og book-knapper */}
      <AvailableRoomsCard
        rooms={rooms}
        userId={user?.id ?? null}
        filters={filters}
        fetchRooms={fetchRooms}
      />
    </div>
  )
}
