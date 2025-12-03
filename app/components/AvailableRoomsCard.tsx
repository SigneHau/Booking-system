import { Paper } from "@mantine/core"
import TableRooms from "./TableRooms"
import type { User } from "@/hooks/useUser"

// Filtrene brugeren har valgt (etage, dato, tidsrum, rolle)
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: User["role"]
}

// Props der sendes fra StudentDashboard → AvailableRoomsCard
type AvailableRoomsCardProps = {
  rooms: any[] // alle lokaler filtreret og behandlet i dashboardet
  userId: string | null // id på den aktuelle bruger (student eller teacher)
  filters: Filters // valgte filterværdier
  fetchRooms: () => Promise<void> // funktion til at opdatere listen efter booking
}

// Kortet der viser selve tabellen med ledige lokaler
function AvailableRoomsCard({
  rooms,
  userId,
  filters,
  fetchRooms,
}: AvailableRoomsCardProps) {
  return (
    // Mantine Paper = pænt indrammet boks med skalérbar styling
    <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
      {/* Titel på boksen */}
      <div className="font-semibold text-lg mb-4">Ledige lokaler</div>

      {/* Selve tabellen med alle lokaler og deres status */}
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
