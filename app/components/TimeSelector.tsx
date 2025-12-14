import { useState } from "react"
import { ActionIcon } from "@mantine/core"
import { getTimeRange, TimePicker } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"

// Props som TimeSelector modtager fra FilterCard
type TimeSelectorProps = {
  value: string | null // nuværende valgt tidspunkt
  onChange: (value: string | null) => void // funktion til at opdatere valgt tidspunkt
}

function TimeSelector({ value, onChange }: TimeSelectorProps) {
  const [dropdownOpened, setDropdownOpened] = useState(false) // styrer om dropdown er åben

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => setDropdownOpened(true)} // klik åbner dropdown
    >
      <IconClock size={18} stroke={1.5} /> {/* ur-ikon */}
    </ActionIcon>
  )

  //når du har valgt tidspunkt
  return (
    <TimePicker
      withDropdown
      className="text-gray-400"
      value={value || ""} // brug tom string hvis value er null
      onChange={(val) => {
        onChange(val) // opdater parent-komponent

        if (value === "") {
          setDropdownOpened(false) // luk dropdown hvis der ingen tidsintervalgt er valgt
        }
      }}
      label="Vælg det ønskede tidspunkt"
      leftSection={pickerControl} // viser ur-ikonet

      onFocus={() => setDropdownOpened(true)} // klik i input åbner dropdown
      popoverProps={{
        opened: dropdownOpened, // styrer om dropdown er åben
        onChange: (_opened) => !_opened && setDropdownOpened(false), // synkroniser state ved luk
      }}
      presets={getTimeRange({
        startTime: "08:00:00", // starttid
        endTime: "16:00:00",   // sluttid
        interval: "00:30:00",  // halve timer
      })}
    />
  )
}

export default TimeSelector
