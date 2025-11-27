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

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError || !data.user) {
        setError("Forkert email eller kodeord");
        return;
      }

      const userId = data.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", userId)
        .single();

      if (profileError || !profile?.role) {
        setError("Kunne ikke finde din rolle i systemet.");
        await supabase.auth.signOut();
        return;
      }

      const role = profile.role.toLowerCase();

      // 🔥 Rettet til dine rigtige dashboards
      if (role === "student") {
        router.push("/dashboard/student");
      } else if (role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/");
      }

    } catch (err) {
      console.error(err);
      setError("Der opstod en fejl under login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={90}>
      <Paper
        p={0}
        radius="sm"
        className=" w-[300px]"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            placeholder="Skriv din adgangskode"
            required
            radius="sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Adgangskode"
            placeholder="Din adgangskode"
            required
            mt="xl"
            radius="sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Text color="red" mt="sm">{error}</Text>}

          <Button className="mt-10 ml-30  "
            radius="sm"
            type="submit"
            styles={{
              root: {
                color: "black",          
                border: "1px solid gray", 
                backgroundColor: "white", 
              },
            }}
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
