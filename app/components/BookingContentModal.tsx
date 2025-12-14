import { extractTime } from "@/lib/formatDate"
import { Text, Stack } from "@mantine/core"


// Props til modal-komponenten
// (TableRooms sender disse værdier ind i modalet)

type BookingContentModalProps = {
  floor: string
  room: string
  date: string
  timeFrom: string
  timeTo: string
}


// Modal-komponenten der viser booking-information.
// Bruges i TableRooms via modals.open(...)
const BookingContentModal = ({
  floor,
  room,
  date,
  timeFrom,
  timeTo,
}: BookingContentModalProps) => {
  return (
    // <Stack> giver automatisk pæn vertikal afstand mellem emner
    <Stack gap="xs">
      <Text>
        <strong>Etage:</strong> {floor}
      </Text>

      <Text>
        <strong>Lokale:</strong> {room}
      </Text>

      {/* Dato er allerede formateret i TableRooms (DD-MM-YYYY) */}
      <Text>
        <strong>Dato:</strong> {date}
      </Text>

      <Text>
        <strong>Tidspunkt:</strong> {extractTime(timeFrom)} –{" "}
        {extractTime(timeTo)}
      </Text>
    </Stack>
  )
}

export default BookingContentModal

/*
  Hvad gør komponentet “BookingContentModal”?

  Komponenten viser en kort opsummering af en booking i et modal.
  Den modtager etage, lokale, dato og tidsrum som props, formaterer tiden,
  og præsenterer informationen i en simpel vertikal liste via <Stack>.
  Bruges når brugeren skal se detaljer og bekræfte en booking.
*/
