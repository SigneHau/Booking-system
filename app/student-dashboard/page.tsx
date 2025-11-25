"use client"
// Next.js skal vide at denne side bruger React hooks (kører i browseren)

import { useState, useEffect } from "react"
import DashboardLayout from "../dashboard/layout"
import FilterCard from "../components/FilterCard"
import AvailableRoomsCard from "../components/AvailableRoomsCard"
import { supabase } from "@/lib/supabaseClient"

// Type for filters (så setFilters ikke giver TS-fejl)
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

export default function StudentDashboard() {
  /**
   * FILTER STATE
   * Her gemmes alle brugerens valg fra FilterCard.
   */
  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "student", // Overskrives af FilterCard
  })

  /**
   * ROOMS STATE
   * Liste som UI viser → opdateres efter fetchRooms().
   */
  const [rooms, setRooms] = useState<any[]>([])

  /**
   * Når filtre ændres → hent nye lokaler.
   */
  useEffect(() => {
    if (filters.floor && filters.date) {
      fetchRooms()
    }
  }, [filters])

  /**
   * HENT LOKALER FRA SUPABASE BASERET PÅ FILTRE
   */
  async function fetchRooms() {
    const { floor, date, from, to, role } = filters

    // Stop hvis brugeren ikke har valgt alt endnu
    if (!floor || !date || !from || !to) return

    // -------------------------
    // 1️⃣ FIND LOKALER PÅ ETAGE
    // -------------------------
    let query = supabase.from("meetingrooms").select("*").eq("floor", floor)

    // Studerende må kun se mødelokaler
    if (role === "student") {
      query = query.eq("local", "Mødelokale")
    }

    // Hent lokaler
    const { data: roomsData } = await query

    // Supabase kan returnere null → lav fallback
    const safeRooms = roomsData ?? []

    // Tom liste som vi fylder med lokaler + status
    let results: any[] = []

    // -------------------------------
    // 2️⃣ TJEK BOOKING-OVERLAP
    // -------------------------------
    for (const room of safeRooms) {
      // Hent bookinger for lokalet på valgt dato
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("roomid", room.roomid)
        .eq("date", date)

      // Hvis ingen bookinger → tom liste
      const safeBookings = bookings ?? []

      // Tjek om lokale allerede er booket i valgt tidsrum
      const isBooked = safeBookings.some((b) => {
        const start = new Date(b.starting_at)
        const end = new Date(b.ending_at)

        const userStart = new Date(`${date}T${from}`)
        const userEnd = new Date(`${date}T${to}`)

        return (
          (userStart >= start && userStart < end) || // Bruger starter midt i booking
          (userEnd > start && userEnd <= end) || // Bruger slutter midt i booking
          (userStart <= start && userEnd >= end) // Bruger overlapper hele booking
        )
      })

      // Tilføj lokale med booket-status
      results.push({
        ...room,
        booked: isBooked,
        availability: room.availability,
      })
    }

    // -------------------------------
    // 3️⃣ SEND RESULTATER TIL UI
    // -------------------------------
    setRooms(results)
  }

  return (
    <DashboardLayout>
      <div className="flex font-semibold mt-4 mb-24 text-3xl">
        <h1>Book lokaler</h1>
      </div>

      {/* FilterCard sender brugerens valg op via setFilters */}
      <FilterCard setFilters={setFilters} />

      {/* Viser de lokaler der matcher filtrene */}
      <AvailableRoomsCard rooms={rooms} />
    </DashboardLayout>
  )
}
