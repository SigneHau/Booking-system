"use client"
// Gør komponentet client-side, så vi kan bruge Hooks (useState/useEffect)

import { Text, Paper, Grid } from "@mantine/core"
import { useState, useEffect } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"
import { supabase } from "@/lib/supabaseClient"

// Definerer hvordan vores filter-objekt ser ud, så TypeScript kender strukturen
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

// FilterCard modtager funktionen setFilters fra parent-componentet.
// setFilters bruges til at sende de valgte filterværdier OP til parent.
function FilterCard({
  setFilters,
}: {
  setFilters: (filters: Filters) => void
}) {
  // Liste over etager hentet fra databasen (fx [1,2,3])
  const [floors, setFloors] = useState<number[]>([])

  // Brugerens rolle – bruges til at begrænse dato-valg
  const [userRole, setUserRole] = useState<"student" | "teacher">("student")

  // De 4 filtre som brugeren vælger
  const [floor, setFloor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  // -----------------------------------------------------------
  // 1️⃣ HENT ETAGER FRA SUPABASE (kører kun én gang)
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadFloors() {
      // Hent kolonnen "floor" fra meetingrooms
      const { data, error } = await supabase
        .from("meetingrooms")
        .select("floor")
        .order("floor", { ascending: true })

      // Hvis fejl eller ingen data → stop (beskytter mod null)
      if (error || !data) return

      // Fjerner dubletter (så vi kun viser unikke etager)
      const uniqueFloors = [...new Set(data.map((f) => f.floor))]

      // Gemmer etager i state
      setFloors(uniqueFloors)
    }

    loadFloors()
  }, []) // [] betyder: kør kun ved første render

  // -----------------------------------------------------------
  // 2️⃣ HENT BRUGERENS ROLLE (student/teacher)
  // -----------------------------------------------------------
  useEffect(() => {
    async function getRole() {
      // Hent auth-bruger
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Hvis ingen bruger er logget ind → stop
      if (!user) return

      // Hent rollen fra profiles-tabellen
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      // Beskyt mod null hvis profilen ikke findes
      if (error || !profile) return

      setUserRole(profile.role) // opdater brugerrollen
    }

    getRole()
  }, []) // kører kun én gang

  // -----------------------------------------------------------
  // 3️⃣ SEND FILTRE OP TIL PARENT-COMPONENTET
  // -----------------------------------------------------------
  useEffect(() => {
    // Hver gang et filter ændrer sig → send nyt filter-objekt op
    setFilters({ floor, date, from, to, role: userRole })
  }, [floor, date, from, to, userRole])
  // useEffect lytter på alle 5 værdier

  // -----------------------------------------------------------
  // 4️⃣ UI — VIS FILTER-BOKSEN
  // -----------------------------------------------------------
  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl">
      <div className="font-semibold text-lg mb-4">Filter</div>

      <Grid gutter="xl">
        {/* Etage-vælger */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Etage
          </Text>
          <FloorSelector
            floors={floors} // listen af etager
            value={floor} // den valgte etage
            onChange={setFloor} // opdater state når brugeren vælger
          />
        </Grid.Col>

        {/* Dato-vælger */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Dato
          </Text>
          <DateSelector
            value={date} // valgt dato
            onChange={setDate} // opdater datoen
            maxDate={
              // maks hvor langt frem man må vælge
              userRole === "student"
                ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // studerende: 14 dage
                : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // lærere: 6 måneder
            }
          />
        </Grid.Col>

        {/* Tidspunkt fra */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Tidspunkt fra
          </Text>
          <TimeSelector value={from} onChange={setFrom} />
        </Grid.Col>

        {/* Tidspunkt til */}
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
