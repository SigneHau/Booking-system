import { Text, Stack } from "@mantine/core"

// Definerer hvilke data (props) dette component forventer at modtage
type BookingContentModalProps = {
  floor: string
  room: string
  date: string
  timeFrom: string
  timeTo: string
}

// Viser booking-overblikket - indeholder kun præsentation – ingen modal-logik
const BookingContentModal = ({
  floor,
  room,
  date,
  timeFrom,
  timeTo,
}: BookingContentModalProps) => {
  return (
    // Stack sørger for flot vertikal afstand mellem hver tekstlinje
    <Stack gap="xs">
      <Text>
        <strong>Etage:</strong> {floor}
      </Text>

      <Text>
        <strong>Lokal:</strong> {room}
      </Text>

      <Text>
        <strong>Dato:</strong> {date}
      </Text>

      <Text>
        <strong>Tidspunkt:</strong> {timeFrom} - {timeTo}
      </Text>
    </Stack>
  )
}

export default BookingContentModal