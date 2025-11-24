import { useRef } from "react"
import { ActionIcon } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"

function TimeSelector() {
  const ref = useRef<HTMLInputElement>(null)

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock size={16} stroke={1.5} />
    </ActionIcon>
  )

  return (
    <TimeInput
      className="text-gray-400"
      label="Vælg det ønskede tidspunkt"
      ref={ref}
      leftSection={pickerControl}
    />
  )
}

export default TimeSelector
