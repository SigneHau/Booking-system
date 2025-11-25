import { useRef } from "react"
import { ActionIcon } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"

// Props som FilterCard sender til TimeSelector
// - value: det tidspunkt brugeren har valgt
// - onChange: funktionen der opdaterer tidspunktet i FilterCard
type TimeSelectorProps = {
  value: string | null
  onChange: (value: string | null) => void
}

function TimeSelector({ value, onChange }: TimeSelectorProps) {
  // useRef bruges til at få direkte adgang til selve input-elementet
  // Med ref.current.showPicker() kan vi åbne browserens native time-picker
  const ref = useRef<HTMLInputElement>(null)

  // Dette er det lille ur-ikon i venstre side af inputfeltet
  // Når man klikker på ikonet, åbnes time-picker
  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()} // 👈 åbner time-picker
    >
      <IconClock size={16} stroke={1.5} />
    </ActionIcon>
  )

  return (
    <TimeInput
      ref={ref} // binder input-feltet så showPicker virker
      className="text-gray-400"
      value={value || ""} // TimeInput kan ikke modtage null → brug tom string
      onChange={(e) => onChange(e.currentTarget.value)} // send valgt tid op til FilterCard
      label="Vælg det ønskede tidspunkt"
      leftSection={pickerControl} // tilføj ur-ikon i venstre side
    />
  )
}

export default TimeSelector
