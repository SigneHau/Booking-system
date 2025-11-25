import { Select } from "@mantine/core"

// Modtager 3 ting fra FilterCard:
// floors = en liste af etager fra databasen (fx [1,2,3])
// value = den etage brugeren har valgt
// onChange = funktionen som opdaterer valgt etage
function FloorSelector({ floors, value, onChange }) {
  return (
    <Select
      placeholder="Vælg etage" // Tekst der vises før noget er valgt
      value={value} // Den etage der er valgt lige nu
      onChange={(v) => onChange(Number(v))}
      // Når brugeren vælger en etage → send den tilbage til FilterCard

      data={floors.map((f) => ({
        label: `Sal ${f}`, // Teksten brugeren ser i dropdown
        value: String(f), // Værdien der sendes videre (skal være string)
      }))}
    />
  )
}

export default FloorSelector
