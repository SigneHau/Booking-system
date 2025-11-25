import { Paper } from "@mantine/core"
import TableRooms from "./TableRooms"

function AvailableRoomsCard({ rooms }) {
  /**
   * -------------------------------------------------------------
   * AvailableRoomsCard modtager "rooms" som en prop.
   *
   * rooms = den filtrerede liste af lokaler,
   * som student-dashboard/page.tsx har hentet og beregnet status på.
   *
   * Denne komponent skal IKKE hente data selv.
   * Den skal KUN vise data på en pæn måde.
   *
   * Derfor sender vi "rooms" videre ned til TableRooms,
   * som står for at præsentere data i en tabel.
   * -------------------------------------------------------------
   */

  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
      {/* Overskrift for sektionen */}
      <div className="font-semibold text-lg mb-4">Ledige lokaler</div>

      {/* TableRooms modtager den færdige liste af lokaler og viser den i en tabel */}
      <TableRooms rooms={rooms} />
    </Paper>
  )
}

export default AvailableRoomsCard
