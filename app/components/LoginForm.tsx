"use client";

import { useState } from "react";
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
} from "@mantine/core";
import { loginAuth } from "@/lib/auth";
import { useRouter } from "next/navigation"; // til redirect

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(false);

    const { data, error } = await loginAuth(email, password);

    if (error) {
      setMessage("Forkert email eller kodeord");
      setError(true);
      return;
    }

    // Login succes
    setMessage(`Hej ${data.user?.email}, du er nu logget ind!`);
    setEmail("");
    setPassword("");

    // Sender os videre til den side vi gerne vil have - eks nu sendes vi til student-dashboard siden, efter login
    router.push("/student-dashboard");
  }

  return (
    <Container size={420} my={40}>
      <Title className="text-center text-3xl font-bold">Welcome back!</Title>

      <Text className="text-center text-gray-600 mt-2">
      
      </Text>

      <Paper
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
        className="p-6 mt-8 border rounded-md shadow-sm"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Group justify="space-between" mt="lg" className="mt-6">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          {message && (
            <Text color={error ? "red" : "green"} mt="sm">
              {message}
            </Text>
          )}

          <Button
            fullWidth
            mt="xl"
            radius="md"
            className="mt-8 bg-blue-600 hover:bg-blue-700"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm
