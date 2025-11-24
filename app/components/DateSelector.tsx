import { useState } from "react"
import { DateInput } from "@mantine/dates"

function DateSelector() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <DateInput
      className="text-gray-400"
      value={value}
      onChange={setValue}
      label="Vælg den ønskede dato"
      placeholder="20/11"
    />
  )
}
export default DateSelector
