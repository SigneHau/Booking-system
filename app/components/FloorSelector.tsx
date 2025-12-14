import { Select } from "@mantine/core"

// Props: values komponenten modtager fra Filtercard (floors, value, onChange, disabled)
// TypeScript-types: beskriver hvilke typer props skal have (number[], number | null, funktion, boolean)
function FloorSelector({
  floors,
  value,
  onChange,
  disabled = false,
}: {
  floors: number[]
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <Select
      className="text-gray-400"
      placeholder="Vælg etage"
      label="Vælg den ønskede etage"
      disabled={disabled} // Studerende må ikke ændre etage
      styles={{
        input: {
          backgroundColor: "white",
          color: "black",
          opacity: 1,
          cursor: disabled ? "not-allowed" : "pointer",
        },
      }}
      data={floors.map((f) => ({
        value: f.toString(), // Konverterer tallet til string, da Mantine Select kræver strings
        label: `Etage ${f}`, // Viser teksten "Etage X" i dropdown-menuen
      }))}
      value={value !== null ? value.toString() : null} // Konverter tal til string, eller null hvis ingen valgt
      onChange={(val) => {
      if (val) onChange(Number(val)) // Konverter string tilbage til tal og opdater parent
}}
    />
  )
}

export default FloorSelector
