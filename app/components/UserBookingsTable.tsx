"use client"

import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import ModalButtons from "./ModalButtons"
import BookingContentModal from "./BookingContentModal"
import { formatDateDK, formatTimeDK, extractTime } from "@/lib/formatDate"
import { deleteBooking } from "@/lib/booking"

// Én booking i tabellen — opretter et booking-objekt
export type Booking = {
  id: number
  roomName: string
  roomSize: string
  date: string
  starting_at: string
  ending_at: string
  roomid: string
}

// UserBookingsTable — viser alle brugerens bookinger
export default function UserBookingsTable({
  bookings,
  refresh, // funktion der reloader bookinglisten i parent
}: {
  bookings: Booking[]
  refresh: () => void  //refresh er en funktion der retunere ingenting - bruges til at opdatere/loade bookinglisten igen efter fx en sletning.
}) {
  // Åbner modal når brugeren vil annullere en booking
  function openCancelModal(b: Booking) {
    modals.open({
      centered: true,
      size: "xs",

      // Custom styling af modal
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

      // Modal titel med ikon
      title: (
        <div className="flex items-center gap-2">
          <IconAlertCircle size={20} className="text-gray-700" />
          <span className="font-semibold">Annuller booking</span>
        </div>
      ),

      children: (
        <div className="space-y-4">
          {/* Besked i modal */}
          <p className="">
            Er du sikker på, at du vil annullere denne booking?
          </p>

          {/* Vis booking-detaljer */}
          <BookingContentModal
            floor={b.roomid.slice(0, 1)}
            room={b.roomid}
            date={formatDateDK(new Date(b.date))}
            timeFrom={formatTimeDK(new Date(b.starting_at))}
            timeTo={formatTimeDK(new Date(b.ending_at))}
          />

          {/* Knapper i modal */}
          <ModalButtons
            buttons={[
              {
                label: "Ja",
                color: "red",
                action: async () => {
                  // Slet booking via Supabase
                  try {
                    await deleteBooking(b.id)
                    refresh() // genindlæs bookingliste
                    modals.closeAll() // luk modal
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Kunne ikke annullere booking."
                    alert(message) // vis fejl hvis sletning fejler
                  }
                },
              },
              {
                label: "Nej",
                color: "blue",
                action: () => modals.closeAll(), // luk modal uden ændring
              },
            ]}
          />
        </div>
      ),
    })
  }

  // Generer tabelrækker for hver booking - mapper igennem array
  const rows = bookings.map((b, index) => (
    <Table.Tr
      key={b.id}
      className={index === 0 ? "!bg-blue-50/70 border-l-4 border-blue-500" : ""} // fremhæv nyeste booking
    >
      {/* Lokale navn */}
      <Table.Td>{b.roomName}</Table.Td>

      {/* Kapacitet */}
      <Table.Td>{b.roomSize}</Table.Td>

      {/* Tidspunkt */}
      <Table.Td>
        {extractTime(b.starting_at)} – {extractTime(b.ending_at)}
      </Table.Td>

      {/* Dato */}
      <Table.Td>{formatDateDK(new Date(b.date))}</Table.Td>

      {/* Annuller-knap */}
      <Table.Td>
        <button
          className="bg-red-600 hover:bg-red-500 cursor-pointer transition-colors duration-200 px-4 py-2 rounded text-white"
          onClick={() => openCancelModal(b)} 
        >
          Annuller
        </button>
      </Table.Td>
    </Table.Tr>
  ))

  // Render tabel med headers og rækker
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Lokale</Table.Th>
          <Table.Th>Kapacitet</Table.Th>
          <Table.Th>Tidspunkt</Table.Th>
          <Table.Th>Dato</Table.Th>
          <Table.Th>Annullering</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}

/*
Hvad gør komponentet “UserBookingsTable”?

- Viser alle bookinger for den aktuelle bruger i en tabel.
- Modtager en liste af booking-objekter og en refresh()-funktion fra parent.
- Viser lokale, kapacitet, dato og tidsrum for hver booking.
- Indeholder "Annuller" knap på hver række.
- Når brugeren klikker "Annuller", åbnes en modal med bekræftelse.
- Modalet viser booking-detaljer og giver valget “Ja” eller “Nej”.
- Trykker brugeren “Ja”, slettes bookingen via deleteBooking(id) og refresh() kaldes.
- Trykker brugeren “Nej”, lukkes modalet uden ændring.
- Håndterer hele UI’et for visning og sletning af brugerens bookinger.
*/
