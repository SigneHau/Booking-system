"use client"

import { useState, useEffect, useCallback } from "react"
import FilterCard from "../../components/FilterCard"
import AvailableRoomsCard from "../../components/AvailableRoomsCard"
import RoleBadge from "@/app/components/RoleBadge"
import { useUser} from "@/hooks/useUser"
import { fetchAvailableRooms } from "@/lib/rooms"
import { Filters } from "@/lib/types"
import type { AvailableRoom } from "@/lib/rooms"


export default function DashboardPage() {
  
// STATE: gemmer brugerinfo, filtre, loading-spinner og tilgængelige lokaler
// Henter logget bruger og tjekker om det er en student eller lærer
const { user, isStudent } = useUser() 
const [loadingSpinner, setLoadingSpinner] = useState(false) // viser spinner under indlæsning
const [filters, setFilters] = useState<Filters>({            // gemmer valgte filtre
  floor: null,
  date: null,
  from: null,
  to: null,
})
const [rooms, setRooms] = useState<AvailableRoom[]>([])       // Gemmer lokaler hentet fra API, starter som tomt array


 
  // Funktion: hent lokaler via lib/rooms
  
  const fetchRooms = useCallback(async () => {
    if (!filters.floor || !filters.date || !filters.from || !filters.to) return // her stopper bare funktionen tidligt, hvis nogle af filtre mangler. 
    //Hvis alle filtre er sat, fortsætter funktionen og henter lokaler med fetchAvailableRooms.
    setLoadingSpinner(true) // Start spinner
    const data = await fetchAvailableRooms(filters, isStudent)
    setRooms(data)          // Opdater state med lokaler
    setLoadingSpinner(false) // Stop spinner - lokalerne vises
  }, [filters, isStudent])

 
  // useEffect: hent lokaler når filtre ændres
 
  useEffect(() => {
       // Vi laver en lille async funktion herinde, fordi useEffect ikke selv må være async.
// Det gør, at vi stadig kan hente data (fetchRooms)

    const fetch = async () => {
      if (filters.floor && filters.date) {
        await fetchRooms()
      }
    }

    fetch()
  },[filters, fetchRooms]) // Kør kun når filters ændres

 
  // UI Layout
  return (
    <div>
      <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
        <h1>Book et lokale</h1>
        <RoleBadge /> {/* Viser brugerens rolle */}
      </div>

      <FilterCard setFilters={setFilters}  />
      {/* Filterkort med valgmuligheder */}

      <AvailableRoomsCard
        rooms={rooms}
        userId={user?.id ?? null} // Send userId til TableRooms
        filters={filters}
        fetchRooms={fetchRooms}   // Mulighed for manuel opdatering
        loadingSpinner={loadingSpinner}
      />
    </div>
  )
}


// Kort opsummering til eksamen:
// - useUser: finder logget bruger og om det er student/lærer
// - fetchRooms: henter lokaler fra lib/rooms, tjekker bookings, bruger isStudent til permissions
// - loadingSpinner: viser spinner mens lokaler hentes
// - useEffect: automatisk opdatering når filtre ændres
// - UI: viser role badge, filterkort og tilgængelige lokaler

