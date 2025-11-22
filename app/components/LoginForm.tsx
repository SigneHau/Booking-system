"use client";

import { useState } from "react";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { loginAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient"; // IMPORT DEN HER
import { useRouter } from "next/navigation";

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

    // Login-auth fra auth.ts
    const { data, error } = await loginAuth(email, password);

    if (error) {
      setMessage("Forkert email eller kodeord");
      setError(true);
      return;
    }

    // Login succes besked
    setMessage(`Hej ${data.user?.email}, du er nu logget ind!`);
    setEmail("");
    setPassword("");

    const userId = data.user.id;

    // Henter rolle fra profil-tabellen
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile?.role) {
      setMessage("Kunne ikke finde din rolle i systemet.");
      setError(true);
      return;
    }

    const role = profile.role;
    console.log("ROLE:", role);

    // Redirect baseret på rollen
    if (role === "student") {
      router.push("/student-dashboard");
      return;
    }

    if (role === "teacher") {
      router.push("/teacher-dashboard");
      return;
    }
  }

  return (
    <Container size={420} my={80}>
      <Paper
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
        className="border rounded-md shadow-sm w-[380px] ml-3"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            placeholder="you@mantine.dev"
            required
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Adgangskode"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;
