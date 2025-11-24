import { Text, Paper, Grid } from "@mantine/core"
import { useState } from "react"
import FloorSelector from "./FloorSelector"
import DateSelector from "./DateSelector"
import TimeSelector from "./TimeSelector"

function FilterCard() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl">
      <div className="font-semibold text-lg mb-4">Filter</div>

      <Grid gutter="xl">
        {/* Etage */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Etage
          </Text>
          <FloorSelector />
        </Grid.Col>

        {/* Dato */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Dato
          </Text>
          <DateSelector />
        </Grid.Col>

        {/* Tidspunkt fra */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Tidspunkt fra
          </Text>
          <TimeSelector />
        </Grid.Col>

        {/* Tidspunkt til */}
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Text size="sm" fw={500} mb={4}>
            Tidspunkt til
          </Text>
          <TimeSelector />
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export default FilterCard
