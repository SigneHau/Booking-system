import { Paper } from "@mantine/core"
import { useState } from "react"
import TableRooms from "./TableRooms"

function AvailableRoomsCard() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl" className="mt-8">
      <div className="font-semibold text-lg mb-4">Filter</div>
      <TableRooms />
    </Paper>
  )
}

export default AvailableRoomsCard
