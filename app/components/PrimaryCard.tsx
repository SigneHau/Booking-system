import { Card, Text } from "@mantine/core"

function PrimaryCard() {
  return (
    <Card>
      {/* <Card.Section></Card.Section> */}

      <Text fw={500} size="lg" mt="md">
        You&apos;ve won a million dollars in cash!
      </Text>

      <Text mt="xs" c="dimmed" size="sm">
        Please click anywhere on this card to claim your reward, this is not a
        fraud, trust us
      </Text>
    </Card>
  )
}

export default PrimaryCard
