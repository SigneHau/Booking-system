import { DateInput } from "@mantine/dates"

// Props FilterCard sender ned til DateSelector:
// - value: den dato brugeren har valgt
// - onChange: funktion der opdaterer datoen i FilterCard
// - maxDate: hvor langt frem brugeren må vælge dato
type DateSelectorProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  maxDate: Date
}

function DateSelector({ value, onChange, maxDate }: DateSelectorProps) {
  return (
    <DateInput
      className="text-gray-400"
      label="Vælg den ønskede dato" // Tekst over inputfeltet
      placeholder="Vælg dato" // Tekst inde i feltet før valg
      value={value} // Den valgte dato (kommer fra FilterCard)
      maxDate={maxDate} // Begrænser dato-valg afhængigt af rolle
      valueFormat="DD/MM/YYYY" // Formatet som datoen vises i
      // Mantine giver en STRING når brugeren vælger en dato.
      // FilterCard forventer en DATE → derfor laver vi konvertering her.
      onChange={(val) => {
        if (!val) return onChange(null) // Hvis brugeren sletter datoen → send null tilbage
        onChange(new Date(val)) // Ellers: lav string om til en Date og send tilbage
      }}
    />
  )
}

export default DateSelector
