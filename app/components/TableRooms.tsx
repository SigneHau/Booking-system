"use client"

import { Table } from "@mantine/core"
import { modals } from "@mantine/modals"
import { IconAlertCircle } from "@tabler/icons-react"
import BookingContentModal from "./BookingContentModal"
import { supabase } from "@/lib/supabaseClient"

//
// -------------------------------------------------------------
// Typedefs – struktur for data
// -------------------------------------------------------------
//

// Room indeholder alle felter + bookings-array (alle bookinger for valgt dag)
type Room = {
  id: number
  roomid: string
  local: string
  roomsize: number
  floor: number
  availability: string
  booked: boolean // ← true hvis det valgte tidsrum er optaget
  bookings: any[] // ← alle booking-intervaller på den valgte dag
}

// Brugte filterværdier fra filterkortet
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

// Props sendt fra dashboard → AvailableRoomsCard → TableRooms
type TableRoomsProps = {
  rooms: Room[]
  userId: string | null
  filters: Filters
  fetchRooms: () => Promise<void> // ← opdaterer UI efter booking
}

//
// -------------------------------------------------------------
// Helper: Formatér dato pænt (DK)
// 2025-12-01 → 01-12-2025
// -------------------------------------------------------------
//
function formatDateDK(date: Date) {
  return date
    .toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\./g, "-") // 01.12.2025 → 01-12-2025
}

function TableRooms({ rooms, userId, filters, fetchRooms }: TableRoomsProps) {
  /**
   * -------------------------------------------------------------
   * Åbner booking-modal når man klikker "Book"
   * Viser: lokale, dato, tid, info
   * -------------------------------------------------------------
   */
  const handleBooking = (room: Room) => {
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
          <span className="font-semibold">Overblik over booking</span>
        </div>
      ),

      // Selve modalens indhold
      children: (
        <div className="space-y-4">
          <BookingContentModal
            floor={room.floor.toString()}
            room={room.roomid}
            date={
              filters.date
                ? formatDateDK(filters.date) // Dato pænt format
                : "Vælg dato"
            }
            timeFrom={filters.from ?? "??"}
            timeTo={filters.to ?? "??"}
          />

          {/* Handling-knapper */}
          <div className="flex gap-3 pt-4 justify-center">
            {/* Bekræft booking */}
            <button
              className="bg-blue-800 hover:bg-blue-700 cursor-pointer hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-md"
              onClick={async () => {
                await handleConfirmBooking(room)
              }}
            >
              Book
            </button>

            {/* Luk modal */}
            <button
              className="bg-red-600 hover:bg-red-500 cursor-pointer hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-md"
              onClick={() => modals.closeAll()}
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
   * Gem booking i Supabase når brugeren bekræfter
   * Indeholder også overlap-check via unikt database constraint
   * -------------------------------------------------------------
   */
  async function handleConfirmBooking(room: Room) {
    if (!userId) {
      console.error("Ingen userId – er brugeren logget ind?")
      return
    }

    const { date, from, to } = filters
    if (!date || !from || !to) {
      console.error("Manglende filterværdier (date/from/to)")
      return
    }

    // Formatér dato → "YYYY-MM-DD"
    const dateStr = date.toISOString().split("T")[0]

    // Send booking til Supabase
    const { data, error } = await supabase.from("bookings").insert({
      roomid: room.roomid,
      date: dateStr,
      starting_at: `${dateStr}T${from}`,
      ending_at: `${dateStr}T${to}`,
      created_by: userId,
    })

    //
    // -------------------------------------------------------------
    // HÅNDTERER OVERLAPPENDE BOOKINGER AUTOMATISK (nyt!)
    // Dette virker pga. vores GIST exclude-constraint i databasen.
    // -------------------------------------------------------------
    //
    if (error) {
      if (error.message.includes("bookings_no_overlap")) {
        alert("Dette tidspunkt er allerede booket. Vælg et andet tidsrum.")
      } else {
        alert("Der opstod en fejl under booking.")
      }
      return
    }

    console.log("✅ Booking oprettet:", data)

    await fetchRooms() // ← Opdaterer listen så rummet bliver “Optaget”
    modals.closeAll() // ← Luk modal
  }

  /**
   * -------------------------------------------------------------
   * Tabelrækker: viser ALLE bookinger for dagen pr. lokale
   * -------------------------------------------------------------
   */
  const rows = rooms.map((room) => (
    <Table.Tr key={room.id}>
      {/* Lokalenavn */}
      <Table.Td>
        {room.roomid} – {room.local}
      </Table.Td>

      {/* Kapacitet */}
      <Table.Td>{room.roomsize} personer</Table.Td>

      {/* Åbningstid (fra database) */}
      <Table.Td>{room.availability}</Table.Td>

      {/* STATUS (vis ALLE dagens bookinger) */}
      <Table.Td className="space-y-1">
        {room.bookings && room.bookings.length > 0 ? (
          <>
            {room.bookings.map((b: any) => {
              const start = b.starting_at.slice(11, 16) // 09:00
              const end = b.ending_at.slice(11, 16) // 12:30

              return (
                <div
                  key={b.id}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-md w-[185px] text-center"
                >
                  Optaget {start} – {end}
                </div>
              )
            })}
          </>
        ) : (
          // Ingen bookinger → hele dagen er ledig
          <div className="bg-green-200 text-green-700 px-4 py-2 rounded-md w-[185px] text-center">
            Ledigt hele dagen
          </div>
        )}
      </Table.Td>

      {/* Book-knap */}
      <Table.Td>
        <button
          disabled={room.booked} // ← Deaktiver hvis overlap med valgt tid
          className={`hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded text-white
            ${
              room.booked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-800 cursor-pointer"
            }`}
          onClick={() => handleBooking(room)}
        >
          Book
        </button>
      </Table.Td>
    </Table.Tr>
  ))

  /**
   * -------------------------------------------------------------
   * Render hele tabellen
   * -------------------------------------------------------------
   */
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

export default TableRooms
