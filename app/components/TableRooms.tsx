import { Table } from "@mantine/core"

function TableRooms() {
  // const rows = elements.map((meetingrooms) => (
    // <Table.Tr key={meetingrooms.local}>
    //   <Table.Td>{meetingrooms.roomsize}</Table.Td>
    //   <Table.Td>{meetingrooms.availability}</Table.Td>
  //   </Table.Tr>
  // ))

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
      {/* <Table.Tbody>{rows}</Table.Tbody> */}
    </Table>
  )
}

export default TableRooms
