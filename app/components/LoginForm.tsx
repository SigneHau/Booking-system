// /app/components/LoginForm.tsx

"use client";

import { useState } from "react";
import { Button, Container, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("HandleSubmit kaldt!", { email, password });

    try {
      // 1. Login via Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError || !data.user) {
        setError("Forkert email eller kodeord");
        return;
      }

      const userId = data.user.id;

      // 2. Hent profil fra profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", userId)
        .single();

      console.log("Profile fetch:", profile, profileError);

      if (profileError || !profile?.role) {
        setError("Kunne ikke finde din rolle i systemet.");
        await supabase.auth.signOut();
        return;
      }

      // 3. Redirect baseret på rolle (case-insensitiv)
      const role = profile.role.toLowerCase(); // "student" eller "teacher"
      console.log("Redirect til:", role);

      if (role === "student") {
        router.push("/student-dashboard");
      } else if (role === "teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/"); // fallback
      }

    } catch (err) {
      console.error(err);
      setError("Der opstod en fejl under login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
        className="border rounded-md shadow-sm w-[380px]"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            placeholder="you@domain.com"
            required
            radius="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Adgangskode"
            placeholder="Din adgangskode"
            required
            mt="md"
            radius="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Text color="red" mt="sm">{error}</Text>}

          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            color="black"
            disabled={loading}
            loading={loading}
          >
            Log ind
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
