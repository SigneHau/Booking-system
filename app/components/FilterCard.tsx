"use client"
// Gør komponentet client-side, så vi kan bruge Hooks (useState/useEffect)

import { Text, Paper, Grid } from "@mantine/core"
import { useState, useEffect } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"
import { supabase } from "@/lib/supabaseClient"

// Beskriver strukturen af vores filter-objekt
type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

// FilterCard modtager setFilters fra parent → sender brugerens valg op
function FilterCard({
  setFilters,
}: {
  setFilters: (filters: Filters) => void
}) {
  // Liste over alle etager hentet fra databasen
  const [floors, setFloors] = useState<number[]>([])

  // Brugerens rolle (student/teacher) – bestemmer hvilke etager og datoer man må vælge
  const [userRole, setUserRole] = useState<"student" | "teacher">("student")

  // Lokalt state for brugerens filtervalg
  const [floor, setFloor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  // -----------------------------------------------------------
  // 1️⃣ HENT ETAGER FRA SUPABASE
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadFloors() {
      const { data, error } = await supabase
        .from("meetingrooms")
        .select("floor")
        .order("floor", { ascending: true })

      if (error || !data) return

      // Fjerner dubletter (så vi får fx [1,2,3,4])
      const uniqueFloors = [...new Set(data.map((f) => f.floor))]

      setFloors(uniqueFloors) // lærere skal bruge disse
    }

    loadFloors()
  }, [])

  // -----------------------------------------------------------
  // 2️⃣ HENT BRUGERENS ROLLE (student eller teacher)
  // -----------------------------------------------------------
  useEffect(() => {
    async function getRole() {
      const { data: auth } = await supabase.auth.getUser()
      const user = auth?.user
      if (!user) return

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error || !profile) return

      setUserRole(profile.role)
    }

    getRole()
  }, [])

  // -----------------------------------------------------------
  // 3️⃣ STUDENT-BEHAVIOUR: Studerende må KUN vælge etage 3
  // -----------------------------------------------------------
  useEffect(() => {
    if (userRole === "student") {
      setFloors([3]) // Studerende må kun se denne etage
      setFloor(3) // Vælg automatisk etage 3
    }
    // Lærere → behold alle etager (fra loadFloors)
  }, [userRole])

  // -----------------------------------------------------------
  // 4️⃣ SEND FILTER-STATE OP TIL PARENT COMPONENT
  // -----------------------------------------------------------
  useEffect(() => {
    setFilters({ floor, date, from, to, role: userRole })
  }, [floor, date, from, to, userRole])

  // -----------------------------------------------------------
  // 5️⃣ UI – VIS HELE FILTER-BOKSEN
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
            floors={floors} // hvilke etager vises
            value={floor} // valgt etage
            onChange={setFloor} // opdater floor-state
            disabled={userRole === "student"} // studerende må ikke ændre
          />
        </Grid.Col>

        {/* Dato */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Dato
          </Text>

          <DateSelector
            value={date}
            onChange={setDate}
            maxDate={
              userRole === "student"
                ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dage frem
                : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 måneder frem
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
