// /app/components/LoginForm.tsx (eller hvor den ligger)

"use client";

import { useState } from "react";
import { Button, Container, Paper, PasswordInput, Text, TextInput } from "@mantine/core";
// Husk at tjekke stien til supabaseClient.ts
import { supabase } from "../../lib/supabaseClient"; 
import { useRouter } from "next/navigation";
import { loginAuth } from "@/lib/auth"; 

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // 1. Login via Supabase
      const { data, error: loginError } = await loginAuth(email, password);
      
      if (loginError || !data?.user) {
        setError("Forkert email eller kodeord");
        return;
      }

      const userId = data.user.id;

      // 2. Hent rolle fra profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (profileError || !profile?.role) {
        setError("Kunne ikke finde din rolle i systemet.");
        await supabase.auth.signOut(); // Log ud af brugeren, hvis profilen mangler
        return;
      }

      // 3. Redirect baseret på rollen
      if (profile.role === "student") {
        router.push("/student-dashboard");
      } else if (profile.role === "teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/"); // fallback
      }

    } catch (e) {
      console.error("Uventet fejl under login:", e);
      setError("Der opstod en uventet fejl.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md" className="border rounded-md shadow-sm w-[380px]">
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
            placeholder="Your password"
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
            className="bg-blue-600 hover:bg-blue-700"
            disabled={loading}
            loading={loading}
          >
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;