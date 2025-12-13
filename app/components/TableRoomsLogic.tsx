"use client"

import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import BookingContentModal from "./BookingContentModal"
import ModalButtons from "./ModalButtons"
import { createBooking } from "@/lib/booking"
import { formatDateDK } from "@/lib/formatDate"
import { Filters } from "@/lib/types"

// -------------------------------------------------------------
// Typedefs – struktur for data
// -------------------------------------------------------------
type Booking = {
  id: number
  starting_at: string
  ending_at: string
}

type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
  booked: boolean
  bookings: Booking[]
}

type TableRoomsProps = {
  rooms: Room[]
  userId: string | null
  filters: Filters
  fetchRooms: () => Promise<void>
}

function TableRoomsLogic({ rooms, userId, filters, fetchRooms }: TableRoomsProps) {
  if (!userId) console.warn("Ingen userId – er brugeren logget ind?")

  // -------------------------------------------------------------
  // Åbner modal når brugeren klikker “Book”
  // -------------------------------------------------------------
  const handleBooking = (room: Room) => {
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
      children: (
        <div className="space-y-4">
          <BookingContentModal
            floor={room.floor.toString()}
            room={room.roomid}
            date={filters.date ? formatDateDK(filters.date) : "Vælg dato"}
            timeFrom={filters.from ?? "??"}
            timeTo={filters.to ?? "??"}
          />
          <ModalButtons
            buttons={[
              {
                label: "Book",
                color: "blue",
                action: async () => await handleConfirmBooking(room),
              },
              {
                label: "Annuller",
                color: "red",
                action: () => modals.closeAll(),
              },
            ]}
          />
        </div>
      ),
    })
  }

  // -------------------------------------------------------------
  // Sender booking-data til Supabase
  // -------------------------------------------------------------
  async function handleConfirmBooking(room: Room) {
    if (!userId) return
    const { date, from, to } = filters
    if (!date || !from || !to) return console.error("Manglende filterværdier (date/from/to)")

    try {
      await createBooking({ roomid: room.roomid, date, from, to, userId })
      await fetchRooms()
      modals.closeAll()
      console.log("✅ Booking oprettet")
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("Der opstod en ukendt fejl")
      }
    }
  }

  // -------------------------------------------------------------
  // Generér tabelrækker
  // -------------------------------------------------------------
  const rows = rooms.map((room) => (
    <Table.Tr key={room.id}>
      <Table.Td>{room.roomid} – {room.local}</Table.Td>
      <Table.Td>{room.roomsize} personer</Table.Td>
      <Table.Td>{room.availability}</Table.Td>
      <Table.Td className="space-y-1">
        {room.bookings.length > 0 ? (
          room.bookings.map((b) => {
            const start = b.starting_at.slice(11, 16)
            const end = b.ending_at.slice(11, 16)
            return (
              <div
                key={b.id}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-md w-[185px] text-center"
              >
                Optaget {start} – {end}
              </div>
            )
          })
        ) : (
          <div className="bg-green-200 text-green-700 px-4 py-2 rounded-md w-[185px] text-center">
            Ledigt hele dagen
          </div>
        )}
      </Table.Td>
      <Table.Td>
        <button
          disabled={room.booked}
          className={`hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded text-white
            ${room.booked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 cursor-pointer"}`}
          onClick={() => handleBooking(room)}
        >
          Book
        </button>
      </Table.Td>
    </Table.Tr>
  ))

  // -------------------------------------------------------------
  // Render hele tabellen
  // -------------------------------------------------------------
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Lokale</Table.Th>
          <Table.Th>Kapacitet</Table.Th>
          <Table.Th>Åbningstid</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Booking</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}

export default TableRoomsLogic
