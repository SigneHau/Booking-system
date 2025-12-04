import { Paper } from "@mantine/core"
import TableRooms from "./TableRooms"
import type { User } from "@/hooks/useUser"

// Filtrene valgt af brugeren (etage, dato, tidsrum, rolle)
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: User["role"]
}

// Props sendt fra StudentDashboard → AvailableRoomsCard
type AvailableRoomsCardProps = {
  rooms: any[]              // alle filtrerede lokaler (beregnet i dashboardet)
  userId: string | null     // aktiv bruger-id (student eller teacher)
  filters: Filters          // valgte filterværdier
  fetchRooms: () => Promise<void> // opdaterer listen efter booking
}

// UI-kortet der indeholder tabellen over ledige lokaler
function AvailableRoomsCard({
  rooms,
  userId,
  filters,
  fetchRooms,
}: AvailableRoomsCardProps) {
  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
      {/* Titel på kortet */}
      <div className="font-semibold text-lg mb-4">Ledige lokaler</div>

      {/* Tabellen hvor hvert lokale vises, inkl. booking-knap */}
      <TableRooms
        rooms={rooms}
        userId={userId}
        filters={filters}
        fetchRooms={fetchRooms}
      />
    </Paper>
  )
}

export default AvailableRoomsCard
