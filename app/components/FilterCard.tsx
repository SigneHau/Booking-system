import { Text, Paper } from "@mantine/core"
import { Grid } from "@mantine/core"

function FilterCard() {
  return (
    <Paper shadow="sm" radius="lg" withBorder p="xl">
      <div className="font-semibold text-lg">Filter</div>
      <Grid
        type="container"
        breakpoints={{
          xs: "100px",
          sm: "200px",
          md: "300px",
          lg: "400px",
          xl: "500px",
        }}
      >
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>Etage</Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>Dato</Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>Tidspunkt fra</Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>Tidspunkt til</Grid.Col>
      </Grid>
    </Paper>
  )
}
export default FilterCard
