import { useState } from "react"
import { ActionIcon } from "@mantine/core"
import { getTimeRange, TimePicker } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"

// Props som FilterCard sender til TimeSelector
// - value: det tidspunkt brugeren har valgt
// - onChange: funktionen der opdaterer tidspunktet i FilterCard
type TimeSelectorProps = {
  value: string | null
  onChange: (value: string | null) => void
}

function TimeSelector({ value, onChange }: TimeSelectorProps) {
  const [dropdownOpened, setDropdownOpened] = useState(false)
  // useRef bruges til at få direkte adgang til selve input-elementet
  // Med ref.current.showPicker() kan vi åbne browserens native time-picker

  // Dette er det lille ur-ikon i venstre side af inputfeltet
  // Når man klikker på ikonet, åbnes time-picker
  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => setDropdownOpened(true)}
    >
      <IconClock size={18} stroke={1.5} />
    </ActionIcon>
  )

  // Byttede TimeInput ud med TimePicker for at kunne tage kontrol over "presets" så den kun kan vælge hver halve time
  return (
    <TimePicker
      withDropdown
      className="text-gray-400"
      value={value || ""} // TimeInput kan ikke modtage null → brug tom string
      onChange={(val) => {
        onChange(val)
        if (value === "") {
          setDropdownOpened(false)
        }
      }}
      label="Vælg det ønskede tidspunkt"
      leftSection={pickerControl} // tilføj ur-ikon i venstre side
      popoverProps={{
        opened: dropdownOpened,
        onChange: (_opened) => !_opened && setDropdownOpened(false),
      }}
      presets={getTimeRange({
        startTime: "08:00:00",
        endTime: "16:00:00",
        interval: "00:30:00",
      })}
    />
  )
}

export default TimeSelector
