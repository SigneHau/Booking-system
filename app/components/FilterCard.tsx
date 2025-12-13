"use client"

import { Text, Paper, Grid, Loader } from "@mantine/core"
import { useEffect, useState } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"
import { useUser } from "@/hooks/useUser"
import { getFloors } from "@/lib/rooms"
import { Filters } from "@/lib/types"
import { addDays } from "@/lib/formatDate"

type FilterCardProps = {
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  // React funktion fra parent, bruges til at sende filter-data opad
  loadingSpinner: boolean
}
//FilterCard får setFilters som prop fra Dashboard.
export default function FilterCard({ setFilters, loadingSpinner }: FilterCardProps) {
  const { user, isStudent, isTeacher } = useUser()
  const [floors, setFloors] = useState<number[]>([])
  const [floor, setFloor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(new Date())
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  // 1) Hent alle etager fra Supabase
  useEffect(() => {
    async function loadFloors() {
      const result = await getFloors()
      setFloors(result)
    }
    loadFloors()
  }, [])

  // 2) STUDENT: lås etage til 3
  useEffect(() => {
    if (isStudent) {
      setFloors([3])
      setFloor(3)
    }
  }, [isStudent])

  // 3) TEACHER: default-værdi = første etage
  useEffect(() => {
    if (isTeacher && floors.length > 0 && floor === null) {
      setFloor(floors[0])
    }
  }, [isTeacher, floors.length, floor])

  // 4) SEND FILTRE TIL PARENT
  useEffect(() => {
    setFilters({ floor, date, from, to, role: user?.role as User["role"] })
    // <-- Her bruger vi React-funktionen setFilters fra parent
    // den sender de valgte filtre op, så parent (Dashboard) kan bruge dem
  }, [floor, date, from, to, user, setFilters])

  // 5) maxDate afhænger af rollen
  const maxDate: Date = isStudent
    ? addDays(new Date(), 14) // 2 uger for student
    : addDays(new Date(), 180) // 6 mdr for lærer

  return (
    <>
      {/* Loader vises over hele siden når der hentes lokaler */}
      {loadingSpinner && (
        <div className="fixed inset-0 bg-white/70">
          <div
            className="absolute"
            style={{
              top: "35vh",
              left: "50%",
              transform: "translateX(50%)",
            }}
          >
            <Loader size="xl" />
          </div>
        </div>
      )}

      {/* Filter Paper */}
      <Paper shadow="sm" radius="lg" withBorder p="xl">
        <div className="font-semibold text-lg mb-4">Filter</div>

        <Grid gutter="xl">
          {/* Etage */}
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Text size="sm" fw={500} mb={4}>Etage</Text>
            <FloorSelector
              floors={floors}
              value={floor}
              onChange={setFloor}
              disabled={isStudent} // studerende kan ikke ændre etage
            />
          </Grid.Col>

          {/* Dato */}
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Text size="sm" fw={500} mb={4}>Dato</Text>
            <DateSelector value={date} onChange={setDate} maxDate={maxDate} />
          </Grid.Col>

          {/* Tid fra */}
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Text size="sm" fw={500} mb={4}>Tidspunkt fra</Text>
            <TimeSelector value={from} onChange={setFrom} />
          </Grid.Col>

          {/* Tid til */}
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Text size="sm" fw={500} mb={4}>Tidspunkt til</Text>
            <TimeSelector value={to} onChange={setTo} />
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  )
}

// -------------------------------------------------------------
// Kort opsummering:
// - useUser: henter logget bruger + roller
// - STUDENT: låser etage til 3, lærer kan vælge
// - setFilters: React funktion fra parent, sender filterdata opad
// - loadingSpinner: viser loader mens lokaler hentes
// - maxDate: begrænser hvor langt frem i tiden man kan booke afhængigt af rolle
// -------------------------------------------------------------
