import { Table } from "@mantine/core"

// Definerer hvordan ét lokale (Room) skal se ud i TypeScript
type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
  booked: boolean
}

// Fortæller at TableRooms får en prop "rooms",
// som er en liste (array) af Room-objekter
function TableRooms({ rooms }: { rooms: Room[] }) {
  /**
   * -------------------------------------------------------------
   * TableRooms modtager "rooms" som en prop.
   *
   * rooms indeholder:
   *  - roomid
   *  - local (mødelokale / undervisning / open learning)
   *  - roomsize
   *  - availability (fra meetingrooms)
   *  - booked (true/false – beregnet i student-dashboard/page.tsx)
   *
   * Denne komponent skal IKKE hente data.
   * Den skal KUN vise en tabel baseret på den færdige rooms-liste.
   * -------------------------------------------------------------
   */

  // -------------------------------------------------------------
  // Vi laver en række (row) i tabellen for hvert lokale i "rooms".
  // rooms.map(...) betyder: "for hvert lokale → lav en tabelrække".
  // -------------------------------------------------------------
  const rows = rooms.map((room) => (
    // <Table.Tr> = Table Row (tabelrække)
    <Table.Tr key={room.id}>
      {/* Lokale-nummer + type (fx "3.3 – Mødelokale") 
      <Table.Td> = Table Data (celle i rækken) */}
      <Table.Td>
        {room.roomid} – {room.local}
      </Table.Td>

      {/* Kapacitet (antal personer lokalet kan rumme) */}
      <Table.Td>{room.roomsize} personer</Table.Td>

      {/* Lokalet's standard åbningstid */}
      <Table.Td>{room.availability}</Table.Td>

      {/* STATUS (Ledig / Optaget) */}
      <Table.Td>
        {room.booked ? (
          // Hvis booked = true → OPTAGET
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
            Optaget
          </span>
        ) : (
          // booked = false → LEDIG
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            Ledigt
          </span>
        )}
      </Table.Td>

      {/* BOOKING-KNAP */}
      <Table.Td>
        <button
          // Disable knappen hvis lokalet er optaget
          disabled={room.booked}
          className={`px-3 py-1 rounded text-white ${
            room.booked ? "bg-gray-400" : "bg-blue-600"
          }`}
          onClick={() => handleBooking(room)} // <-- funktion laves senere
        >
          Book
        </button>
      </Table.Td>
    </Table.Tr>
  ))

  // -------------------------------------------------------------
  // Returner den fulde tabelstruktur:
  //  - Head: Kolonneoverskrifter
  //  - Body: Alle rooms.rækker
  // -------------------------------------------------------------
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Lokale</Table.Th>
          <Table.Th>Kapacitet</Table.Th>
          <Table.Th>Ledighed</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Booking</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}

export default TableRooms
