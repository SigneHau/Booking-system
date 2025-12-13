import { Paper, Loader, Center } from "@mantine/core"
import TableRooms from "./TableRoomsLogic"
import { Filters } from "@/lib/types"
import type { AvailableRoom } from "@/lib/rooms"

// Props sendt fra StudentDashboard → AvailableRoomsCard
type AvailableRoomsCardProps = {
  rooms: AvailableRoom[] // alle filtrerede lokaler (beregnet i dashboardet)
  userId: string | null  // aktiv bruger-id (student eller teacher)
  filters: Filters       // valgte filterværdier
  fetchRooms: () => Promise<void> // opdaterer listen efter booking
  loadingSpinner: boolean
}

// UI-kortet der indeholder tabellen over ledige lokaler
function AvailableRoomsCard({
  rooms,
  userId,
  filters,
  fetchRooms,
  loadingSpinner
}: AvailableRoomsCardProps) {
  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
      {/* Titel på kortet */}
      <div className="font-semibold text-lg mb-4">Ledige lokaler</div>

       {/* Loader vises over hele siden når der hentes lokaler */}
      {loadingSpinner ? (
        <Center >
          <Loader size="lg" />
        </Center>
      ) : (
        // Tabellen hvor hvert lokale vises, inkl. booking-knap
        <TableRooms
          rooms={rooms}
          userId={userId}
          filters={filters}
          fetchRooms={fetchRooms}
        />
      )}
    </Paper>
  )
}

export default AvailableRoomsCard


// AvailableRoomsCard = UI-kort der viser ledige lokaler.
// Props = data og funktioner fra parent (Dashboard).
// Typerne (Filters + AvailableRoomsCardProps) sikrer, at du kun sender gyldige data.
// Selve bookingen håndteres i TableRooms.
