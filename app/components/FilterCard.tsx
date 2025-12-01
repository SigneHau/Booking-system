"use client"
// FilterCard - bruger UserContext (useUser) i stedet for at hente role fra Supabase.
// Sender: { floor, date, from, to, role } op til parent via setFilters.

import { Text, Paper, Grid } from "@mantine/core"
import { useEffect, useState } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"
import { useUser } from "@/app/contexts/UserContext" // genbrug UserContext
import { supabase } from "@/lib/supabaseClient"

// Eksporteret type så Dashboards kan importere den hvis ønsket
export type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: "student" | "teacher"
}

function FilterCard({ setFilters }: { setFilters: (f: Filters) => void }) {
  // LISTE: alle etager fra DB (for teacher)
  const [floors, setFloors] = useState<number[]>([])

  // Henter brugerinfo (inkl. role) fra context — ingen ekstra supabase-kald her
  const user = useUser()
  // Hvis user er null (ikke loadet) => fallback "student" for sikkerhed, men vi forsøger at bruge user.role
  const userRole: "student" | "teacher" = (user?.role === "teacher" ? "teacher" : "student")

  // LOKALT FILTER-STATE
  const [floor, setFloor] = useState<number | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [from, setFrom] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)

  // -----------------------------------------------------------
  // 1) Hent alle etager fra Supabase (kør kun én gang ved mount)
  // -----------------------------------------------------------
  useEffect(() => {
    async function loadFloors() {
      const { data, error } = await supabase
        .from("meetingrooms")
        .select("floor")
        .order("floor", { ascending: true })

      if (error || !data) return
      const uniqueFloors = [...new Set(data.map((f) => f.floor))]
      setFloors(uniqueFloors)
    }
    loadFloors()
  }, [])

  // -----------------------------------------------------------
  // 2) STUDENT: Lås etage til 3
  // - Kører når userRole ændres; userRole er en primitive (stabil dependency)
  // -----------------------------------------------------------
  useEffect(() => {
    if (userRole === "student") {
      // Studerende SKAL kun bruge etage 3
      setFloors([3]) // vis kun 3 i selector
      setFloor(3) // defaultværdien
    }
    // Hvis teacher => do nothing her; teacher-håndtering sker i næste effect
  }, [userRole])

  // -----------------------------------------------------------
  // 3) TEACHER: når floors er hentet, sæt default floor hvis ikke valgt
  // - Bruger floors.length (primitive) i dependency for at undgå problems med arrays
  // - Tjekker floor === null så vi kun sætter default EN gang
  // -----------------------------------------------------------
  useEffect(() => {
    if (userRole === "teacher" && floors.length > 0 && floor === null) {
      setFloor(floors[0]) // default til første etage
    }
  }, [userRole, floors.length, floor])

  // -----------------------------------------------------------
  // 4) Send filter-state op til parent
  // - Inkluderer role fra context (ikke fra asynkrone kald)
  // - Dependecy array indeholder kun primitive værdier og setFilters reference
  // -----------------------------------------------------------
  useEffect(() => {
    setFilters({ floor, date, from, to, role: userRole })
  }, [floor, date, from, to, userRole, setFilters])

  // -----------------------------------------------------------
  // 5) UI
  // - disabled for studerende
  // - maxDate sættes ud fra role (14 dage vs 6 måneder)
  // -----------------------------------------------------------
  const maxDate =
    userRole === "student"
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dage frem
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 måneder frem

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
            // Disabled kun for student; teacher kan vælge frit (og floors er tilgængelige efter load)
            disabled={userRole === "student"}
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


// Hvad jeg gjorde i FilterCard (kort):

// Brugte useUser() fra context i stedet for at hente role fra Supabase.

// Fjernede lokale async role-kald. Rolle er nu stabil fra context.

// Brugte floors.length i useEffect-deps for at undgå React-fejl når array ændrer størrelse.

// Sætter role i setFilters direkte fra context, så parent får den korrekte rolle uden at ændre objektets “form” over tid.