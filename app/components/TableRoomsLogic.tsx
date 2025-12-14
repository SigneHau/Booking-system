"use client"

import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import BookingContentModal from "./BookingContentModal"
import ModalButtons from "./ModalButtons"
import { createBooking } from "@/lib/booking"
import { formatDateDK, extractTime } from "@/lib/formatDate"
import type { AvailableRoom } from "@/lib/rooms"
import { Filters } from "@/lib/types"

type TableRoomsProps = {
  rooms: AvailableRoom[]
  userId: string | null
  filters: Filters
  fetchRooms: () => Promise<void>
}

function TableRoomsLogic({ rooms, userId, filters, fetchRooms }: TableRoomsProps) {
  // Åbner modal når brugeren klikker “Book”
  const handleBooking = (room: AvailableRoom) => {
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
         {/* // Viser detaljer om det valgte lokale og tidspunkt */}
          <BookingContentModal
            floor={room.floor.toString()}
            room={room.roomid}
            date={filters.date ? formatDateDK(filters.date) : "Vælg dato"}
            timeFrom={filters.from ?? "??"}
            timeTo={filters.to ?? "??"}
          />

           {/* // Viser knapperne "Book" og "Annuller" */}
          <ModalButtons
            buttons={[
              {
                label: "Book",
                color: "blue",
                action: async () => await handleConfirmBooking(room), // bekræft booking
              },
              {
                label: "Annuller",
                color: "red",
                action: () => modals.closeAll(), // luk modal uden at booke
              },
            ]}
          />
        </div>
      ),
    })
  }

 
  // Sender booking-data til Supabase
  async function handleConfirmBooking(room: AvailableRoom) {
    if (!userId) return // stop hvis ingen bruger logget ind
    const { date, from, to } = filters
    if (!date || !from || !to) return console.error("Manglende filterværdier (date/from/to)") // tjekker at alle nødvendige filtre er valgt

    try {
      await createBooking({ roomid: room.roomid, date, from, to, userId })
      await fetchRooms() // henter lokaler igen for at opdatere UI
      modals.closeAll()  // lukker booking-popup
      console.log("Booking oprettet")
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message) // viser fejl fra Supabase
      } else {
        alert("Der opstod en ukendt fejl") // fallback fejlbesked
      }
    }
  }

 
  // Generér tabelrækker for hvert lokale
const rows = rooms.map((room) => (
  <Table.Tr key={room.id}>
    {/* Viser lokale-id og navn */}
    <Table.Td>{room.roomid} – {room.local}</Table.Td>
    {/* Viser hvor mange personer lokalet kan rumme */}
    <Table.Td>{room.roomsize} personer</Table.Td>
    {/* Viser generel tilgængelighed */}
    <Table.Td>{room.availability}</Table.Td>
    
    <Table.Td className="space-y-1">
      {/* Hvis lokalet har bookings - map går igennem alle bookinger og laver en <div> for hvert booket tidsrum */}
      {room.bookings.length > 0 ? (
        room.bookings.map((b) => {
          // Konverterer start- og sluttid til HH:mm
          const start = extractTime(b.starting_at)
          const end = extractTime(b.ending_at)
          return (
            <div
              key={b.id}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-md w-[185px] text-center"
            >
              {/* Viser bookede tidsrum */}
              Optaget {start} – {end}
            </div>
          )
        })
      ) : (
        <div className="bg-green-200 text-green-700 px-4 py-2 rounded-md w-[185px] text-center">
          {/* Hvis ingen bookings */}
          Ledigt hele dagen
        </div>
      )}
    </Table.Td>

    <Table.Td>
      {/* Book-knap */}
      <button
        disabled={room.booked} // Deaktiveres hvis allerede booket
        className={`hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded text-white
          ${room.booked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800 cursor-pointer"}`}
        onClick={() => handleBooking(room)} // Kalder booking-funktion
      >
        Book
      </button>
    </Table.Td>
  </Table.Tr>
))



  // Render hele tabellen - At vise noget på skærmen
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
