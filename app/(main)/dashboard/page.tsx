"use client"

import { useState, useEffect } from "react"
import FilterCard from "../../components/FilterCard"
import AvailableRoomsCard from "../../components/AvailableRoomsCard"
import RoleBadge from "@/app/components/RoleBadge"
import { useUser} from "@/hooks/useUser"
import { fetchAvailableRooms, type Filters } from "@/lib/rooms"


export default function Dashboard() {
  // -------------------------------------------
  // STATE: bruger + filtre + spinner + lokaler
  // -------------------------------------------
  const { user, isStudent } = useUser() // Henter logget bruger og om det er student/lærer

  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    floor: null,
    date: null,
    from: null,
    to: null,
    role: "Teacher", // default værdi for UI, ikke brugerrolle
  })
  const [rooms, setRooms] = useState<any[]>([])

  // -------------------------------------------------------------
  // Funktion: hent lokaler via lib/rooms
  // -------------------------------------------------------------
  async function fetchRooms() {
    if (!filters.floor || !filters.date) return

    setLoadingSpinner(true) // Start spinner
    const data = await fetchAvailableRooms(filters, isStudent)
    setRooms(data)          // Opdater state med lokaler
    setLoadingSpinner(false) // Stop spinner
  }

  // -------------------------------------------------------------
  // useEffect: hent lokaler når filtre ændres
  // -------------------------------------------------------------
  useEffect(() => {
    // Vi laver en lille async funktion herinde, fordi useEffect ikke selv må være async.
// Det gør, at vi stadig kan hente data (fetchRooms) uden at få React-advarsler.

    const fetch = async () => {
      if (filters.floor && filters.date) {
        await fetchRooms()
      }
    }

    fetch()
  }, [filters]) // Kør kun når filters ændres

  // -------------------------------------------------------------
  // UI Layout
  // -------------------------------------------------------------
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        <RoleBadge /> {/* Viser brugerens rolle */}
      </div>

      <FilterCard setFilters={setFilters} loadingSpinner={loadingSpinner} />
      {/* Filterkort med valgmuligheder + spinner */}

      <AvailableRoomsCard
        rooms={rooms}
        userId={user?.id ?? null} // Send userId til TableRooms
        filters={filters}
        fetchRooms={fetchRooms}   // Mulighed for manuel opdatering
      />
    </div>
  )
}

// -------------------------------------------------------------
// Kort opsummering til eksamen:
// - useUser: finder logget bruger og om det er student/lærer
// - filters.role: default værdi for UI, ikke faktisk brugerrolle
// - fetchRooms: henter lokaler fra lib/rooms, tjekker bookings, bruger isStudent til permissions
// - loadingSpinner: viser spinner mens lokaler hentes
// - useEffect: automatisk opdatering når filtre ændres
// - UI: viser role badge, filterkort og tilgængelige lokaler
// -------------------------------------------------------------
