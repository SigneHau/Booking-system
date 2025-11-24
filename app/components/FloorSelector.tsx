import { Select } from "@mantine/core"

function FloorSelector() {
  return (
    <Select
      className="text-gray-400"
      label="Vælg den ønskede etage"
      placeholder="Sal.3"
      data={["Sal.1", "Sal.2", "Sal.3", "Sal.4"]}
    />
  )
}
export default FloorSelector
