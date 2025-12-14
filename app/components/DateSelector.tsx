import { DateInput } from "@mantine/dates"

// Props FilterCard sender ned til DateSelector:
// - value: den dato brugeren har valgt
// - onChange: funktion der opdaterer datoen i FilterCard
// - maxDate: hvor langt frem brugeren må vælge dato
//typescipt hjælper med at se hvilke typer propsense har
type DateSelectorProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  maxDate: Date
}

function DateSelector({ value, onChange, maxDate }: DateSelectorProps) {
  return (
    <DateInput
      className="text-gray-400"
      label="Vælg den ønskede dato"
      placeholder="Vælg dato"
      value={value ?? new Date()} // fallback til dags dato
      minDate={new Date()}        // kan ikke vælge dage før i dag
      maxDate={maxDate}           // maks baseret på rolle
      valueFormat="DD/MM/YYYY"
      onChange={(val) => {
        if (!val) return onChange(null)
        onChange(new Date(val))
      }}
    />
  )
}




export default DateSelector
