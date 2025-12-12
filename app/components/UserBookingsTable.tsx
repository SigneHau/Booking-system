"use client"


import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import ModalButtons from "./ModalButtons"
import BookingContentModal from "./BookingContentModal"
import { formatDateDK } from "@/lib/formatDate"
import { deleteBooking } from "@/lib/booking"


//
// -------------------------------------------------------------
// Én booking i tabellen
// -------------------------------------------------------------
type Booking = {
  id: number
  roomName: string
  roomSize: string
  date: string
  starting_at: string
  ending_at: string
  roomid: string
  floor: string
}

//
// -------------------------------------------------------------
// UserBookingsTable — viser ALLE brugerens bookinger
// -------------------------------------------------------------
export default function UserBookingsTable({
  bookings,
  refresh, // funktion der reloader bookinglisten i parent
}: {
  bookings: Booking[]
  refresh: () => void
}) {
  console.log(" UserBookingsTable ~ bookings:", bookings)

  //
  // -------------------------------------------------------------
  // Helper: formatér klokkeslæt "2025-11-20T08:00:00" → "08:00"
  // -------------------------------------------------------------
  //
  const time = (t: string) => t.slice(11, 16)

  // -------------------------------------------------------------
  // Åbner modal
  // -------------------------------------------------------------
  //
  function openCancelModal(b: Booking) {
    modals.open({
      centered: true,
      size: "xs",

      // Same custom styling as TableRooms
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

      // Same title design with icon
      title: (
        <div className="flex items-center gap-2">
          <IconAlertCircle size={20} className="text-gray-700" />
          <span className="font-semibold">Annuller booking</span>
        </div>
      ),

      children: (
        <div className="space-y-4">
          {/* Message */}
          <p className="">
            Er du sikker på, at du vil annullere denne booking?
          </p>

          <BookingContentModal
            floor={b.roomid.slice(0, 1)}
            room={b.roomid}
            date={formatDateDK(new Date(b.date))}
            timeFrom={new Date(b.starting_at).toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            timeTo={new Date(b.ending_at).toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />

          {/* Reusable button component
          Efter UX-test - er farverne på knapperne byttet om på knapperne  */}
          <ModalButtons
            buttons={[
              {
                label: "Ja",
                color: "red",
                action: async () => {
                  // ✔️ HER bruger vi deleteBooking fra /lib/bookings
                  try {
                    await deleteBooking(b.id)
                    refresh()
                    modals.closeAll()
                  } catch (err: any) {
                    alert(err.message)
                  }
                },
              },
              {
                label: "Nej",
                color: "blue",
                action: () => modals.closeAll(),
              },
            ]}
          />
        </div>
      ),
    })
  }

  //
  // -------------------------------------------------------------
  // Generér tabel-rækker
  // -------------------------------------------------------------
  //
  const rows = bookings.map((b, index) => (
    <Table.Tr
     key={b.id}
       // EFTER UX_TEST: Fremhæv den første række (den nyeste booking )
       className={index === 0 ? "!bg-blue-50/70 border-l-4 border-blue-500" : ""}
      >
      {/* Lokale navn */}
      <Table.Td>{b.roomName}</Table.Td>

      {/* Kapacitet */}
      <Table.Td>{b.roomSize}</Table.Td>

      {/* Tidspunkt */}
      <Table.Td>
        {time(b.starting_at)} – {time(b.ending_at)}
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

  //
  // -------------------------------------------------------------
  // Render — komplet tabel med headers
  // -------------------------------------------------------------
  //
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

  Komponenten viser alle bookinger for den aktuelle bruger i en tabel.
  Den modtager en liste af booking-objekter samt en refresh()-funktion
  fra parent-komponenten.

  Funktionalitet:
  - Viser lokale, kapacitet, dato og tidsrum for hver booking.
  - Indeholder en "Annuller" knap på hver række.
  - Når brugeren klikker "Annuller", åbnes en bekræftelsesmodal
    (via Mantine modals).
  - Modalet viser booking-detaljer og giver valget “Ja” eller “Nej”.
  - Trykker brugeren “Ja”, kaldes deleteBooking(id), som sletter
    bookingen i Supabase og derefter kalder refresh() for at
    hente de opdaterede bookinger.
  - Trykker brugeren “Nej”, lukkes modalet uden at ændre noget.

  Kort sagt:
  UserBookingsTable håndterer hele UI’et for at vise og slette
  brugerens bookinger, inkl. modal-dialog, supabase delete og
  genindlæsning af data.
*/
