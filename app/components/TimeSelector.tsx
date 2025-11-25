import { useState } from "react"
import { ActionIcon } from "@mantine/core"
import { getTimeRange, TimePicker } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"

// -----------------------------------------------------------------------------
// Props som TimeSelector modtager fra FilterCard
// value: det nuværende tidspunkt brugeren har valgt
// onChange: callback-funktion der opdaterer tidspunktet i FilterCard - sender nye værdier tilbage til FilterCard
// -----------------------------------------------------------------------------
type TimeSelectorProps = {
  value: string | null
  onChange: (value: string | null) => void
}

// TimeSelector-komponenten
function TimeSelector({ value, onChange }: TimeSelectorProps) {
  // State der styrer om dropdownen (time-picker popover) er åben eller ej
  const [dropdownOpened, setDropdownOpened] = useState(false)

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
      // TimeInput kan ikke modtage null → brug tom string
      value={value || ""}
      // Når brugeren vælger et tidspunkt
      onChange={(val) => {
        // send værdien op til FilterCard
        onChange(val)

        // Hvis brugeren har ryddet feltet → luk dropdown
        if (value === "") {
          setDropdownOpened(false)
        }
      }}
      label="Vælg det ønskede tidspunkt"
      leftSection={pickerControl}
      // -----------------------------------------------------------------------
      // popoverProps styrer den dropdown, der åbner ved valg af tidspunkt
      // opened: styrer om dropdownen er åben
      // onChange: kaldes når dropdownen lukkes – vi synkroniserer state her
      // -----------------------------------------------------------------------
      popoverProps={{
        opened: dropdownOpened,
        onChange: (_opened) => !_opened && setDropdownOpened(false),
      }}
      // -----------------------------------------------------------------------
      // presets genererer alle tidspunkter mellem 08:00 og 16:00 med 30 minutter
      // interval: 00:30:00 = halv time
      // Dette gør at brugeren kun kan vælge præcist disse tidsværdier
      // -----------------------------------------------------------------------
      presets={getTimeRange({
        startTime: "08:00:00",
        endTime: "16:00:00",
        interval: "00:30:00",
      })}
    />
  )
}

export default TimeSelector
