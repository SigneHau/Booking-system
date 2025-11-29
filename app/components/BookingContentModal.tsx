import { Text, Stack } from "@mantine/core"

//
// -------------------------------------------------------------
// Props til modal-komponenten
// (det som TableRooms sender ind i modalet)
// -------------------------------------------------------------
//
type BookingContentModalProps = {
  floor: string
  room: string
  date: string
  timeFrom: string
  timeTo: string
}

//
// -------------------------------------------------------------
// Formatér klokkeslæt:
// "09:30:00" → "09:30"
// -------------------------------------------------------------
//
const formatTime = (timeStr: string) => {
  if (!timeStr) return "" // beskyttelse hvis der mangler data
  return timeStr.slice(0, 5) // behold kun “HH:MM”
}

//
// -------------------------------------------------------------
// Selve modal-komponenten som viser booking-info
// Bruges inde i TableRooms → modals.open(...)
// -------------------------------------------------------------
//
const BookingContentModal = ({
  floor,
  room,
  date,
  timeFrom,
  timeTo,
}: BookingContentModalProps) => {
  return (
    // Mantine <Stack> giver flot vertikal spacing mellem elementerne
    <Stack gap="xs">
      {/* Vis valgt etage */}
      <Text>
        <strong>Etage:</strong> {floor}
      </Text>

      {/* Vis lokale-id */}
      <Text>
        <strong>Lokal:</strong> {room}
      </Text>

      {/* Datoen er allerede formateret i TableRooms (DD-MM-YYYY)
        Derfor SKAL vi ikke formatere den igen.
      */}
      <Text>
        <strong>Dato:</strong> {date}
      </Text>

      {/* Vis det valgte tidsinterval, pænt formateret */}
      <Text>
        <strong>Tidspunkt:</strong> {formatTime(timeFrom)} -{" "}
        {formatTime(timeTo)}
      </Text>
    </Stack>
  )
}

export default BookingContentModal
