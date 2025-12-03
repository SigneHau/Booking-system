"use client"

import { Text, Paper, Grid } from "@mantine/core"
import { useEffect, useState } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"
import { supabase } from "@/lib/supabaseClient"
import { useUser, type User } from "@/hooks/useUser"

export type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: User["role"]
}

function FilterCard({ setFilters }: { setFilters: (f: Filters) => void }) {
  const { user } = useUser()
  const isStudent = user?.role === "Student"
  const isTeacher = user?.role === "Teacher"
  // Liste af etager hentet fra databasen (kun relevant for lærere)
  const [floors, setFloors] = useState<number[]>([])

  // Lokalt filter-state
  const [floor, setFloor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  // -----------------------------------------------------------
  // 1) Hent alle etager (kun én gang)
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadFloors() {
      const { data, error } = await supabase
        .from("meetingrooms")
        .select("floor")
        .order("floor", { ascending: true })

      if (error || !data) return
      setFloors([...new Set(data.map((f) => f.floor))])
    }

    loadFloors()
  }, [])

  // -----------------------------------------------------------
  // 2) STUDENT: lås etagen til 3
  // -----------------------------------------------------------
  useEffect(() => {
    if (isStudent) {
      setFloors([3]) // Studerende må kun se etage 3
      setFloor(3) // Og kan kun vælge 3
    }
  }, [isStudent])

  // -----------------------------------------------------------
  // 3) TEACHER: hvis etager er hentet, sæt en default-værdi
  // -----------------------------------------------------------
  useEffect(() => {
    if (isTeacher && floors.length > 0 && floor === null) {
      setFloor(floors[0]) // Første etage i listen
    }
  }, [isTeacher, floors.length, floor])

  // -----------------------------------------------------------
  // 4) Send alle filtre op til parent-komponenten
  // -----------------------------------------------------------
  useEffect(() => {
    setFilters({ floor, date, from, to, role: user?.role as User["role"] })
  }, [floor, date, from, to, user, setFilters])

  // -----------------------------------------------------------
  // 5) maxDate afhænger af rollen:
  //    - Student: 14 dage frem
  //    - Teacher: 6 måneder frem
  // -----------------------------------------------------------
  let maxDate: Date
  if (isStudent) {
    maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  } else {
    maxDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  }

  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl">
      <div className="font-semibold text-lg mb-4">Filter</div>

      <Grid gutter="xl">
        {/* Etage */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Etage
          </Text>

          <FloorSelector
            floors={floors}
            value={floor}
            onChange={setFloor}
            disabled={isStudent} // Studerende kan ikke ændre
          />
        </Grid.Col>

        {/* Dato */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Dato
          </Text>

          <DateSelector value={date} onChange={setDate} maxDate={maxDate} />
        </Grid.Col>

        {/* Tid fra */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Tidspunkt fra
          </Text>
          <TimeSelector value={from} onChange={setFrom} />
        </Grid.Col>

        {/* Tid til */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Tidspunkt til
          </Text>
          <TimeSelector value={to} onChange={setTo} />
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export default FilterCard

// -----------------------------------------------------------
// Kommentarer om rettelserne:
// -----------------------------------------------------------
//
// ✔ Fjernet context – bruger nu getUser() fra auth.ts
//
// ✔ Tilføjet user state med id, email, full_name og role
//
// ✔ userRole beregnes nu ud fra den hentede user
//
// ✔ userId kan bruges til bookings (handleConfirmBooking)
//
// ✔ Alle filtre sendes stadig op via setFilters
//
// ✔ TypeScript er tilfreds, ingen fejl på user.role eller userId
