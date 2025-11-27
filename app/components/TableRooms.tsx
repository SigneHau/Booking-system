"use client"

import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import BookingContentModal from "./BookingContentModal"

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
   * Funktion der åbner booking-modal'en.
   * Den modtager det lokale som brugeren har klikket på.
   * -------------------------------------------------------------
   */
  const handleBooking = (room: Room) => {
    // Åbner en modal med detaljer om det valgte lokale
    modals.open({
      centered: true,
      size: "xs",

      styles: {
        content: {
          width: "280px",
          padding: "14px 16px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "white",
          transform: "translate(-50%, -55%)",
        },
      },

      title: (
        <div className="flex items-center gap-2">
          <IconAlertCircle size={20} className="text-gray-700" />
          <span className="font-semibold">Overblik over booking</span>
        </div>
      ),

      // Indsætter BookingConfirmModal component som modal-indhold
      // Indholdet der vises inde i modal-vinduet
      children: (
        <div className="space-y-4">
          <BookingContentModal
            floor={room.floor.toString()}
            room={room.roomid}
            date="Vælg dato"
            timeFrom="08:00"
            timeTo="16:00"
          />

          <div className="flex gap-3 pt-4 justify-center">
            <button
              className="bg-blue-800 text-white px-4 py-2 rounded-md"
              onClick={() => {
                console.log("Booking bekræftet")
                modals.closeAll()
              }}
            >
              Book
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => {
                console.log("Booking annulleret")
                modals.closeAll()
              }}
            >
              Annuller
            </button>
          </div>
        </div>
      ),
    })
  }

  /**
   * -------------------------------------------------------------
   * Vi laver en tabelrække for hvert lokale i "rooms".
   * rooms.map(): "for hvert lokale → lav en tabelrække".
   * -------------------------------------------------------------
   */
  const rows = rooms.map((room) => (
    // <Table.Tr> = Table Row (tabelrække)
    <Table.Tr key={room.id}>
      {/* Table.Td = celle i rækken */}
      <Table.Td>
        {room.roomid} – {room.local}
      </Table.Td>

      <Table.Td>{room.roomsize} personer</Table.Td>

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
          <span className="bg-green-200 text-green-700 px-2 py-1 rounded">
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
            room.booked ? "bg-gray-400" : "bg-blue-800"
          }`}
          onClick={() => handleBooking(room)} // Kør modal-funktionen
        >
          Book
        </button>
      </Table.Td>
    </Table.Tr>
  ))

  /**
   * -------------------------------------------------------------
   * Returner den fulde tabelstruktur:
   *  - Head: Kolonneoverskrifter
   *  - Body: Alle rooms.rækker
   * -------------------------------------------------------------
   */
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
