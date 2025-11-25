import { Select } from "@mantine/core"

// FloorSelector viser valg af etage.
// Den modtager:
//  - floors: listen over etager der må vælges
//  - value: den nuværende valgte etage
//  - onChange: funktion der opdaterer valgt etage
//  - disabled: true/false → om feltet må ændres
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
      // 👇 Fjern disabled-grå styling, så feltet stadig ligner de andre
      styles={{
        input: {
          backgroundColor: "white",
          color: "black",
          opacity: 1,
          cursor: disabled ? "not-allowed" : "pointer",
        },
      }}
      // Mantine Select tager strings, så vi konverterer tal → tekst
      data={floors.map((f) => ({
        value: f.toString(),
        label: `Etage ${f}`,
      }))}
      // value skal også være en string
      value={value !== null ? value.toString() : null}
      // onChange returnerer en string → konverter tilbage til tal
      onChange={(val) => {
        if (val) onChange(Number(val))
      }}
    />
  )
}

export default FloorSelector
