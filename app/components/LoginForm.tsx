import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core"

function LoginForm() {
  return (
    <Container size={420} my={40}>
      <Title className="text-center text-3xl font-bold">Welcome back!</Title>

      <Text className="text-center text-gray-600 mt-2">
        Do not have an account yet? <Anchor>Create account</Anchor>
      </Text>

      <Paper
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
        className="p-6 mt-8 border rounded-md shadow-sm"
      >
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          required
          radius="md"
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          radius="md"
        />

        <Group justify="space-between" mt="lg" className="mt-6">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>

        <Button
          fullWidth
          mt="xl"
          radius="md"
          className="mt-8 bg-blue-600 hover:bg-blue-700"
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  )
}

export default LoginForm
