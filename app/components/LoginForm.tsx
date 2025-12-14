"use client"

import { useState } from "react"
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core"
import { useRouter } from "next/navigation"

import { loginAuth, getUser } from "@/lib/auth"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) // loading styrer login-processen + spinner i knappen

  // Håndterer formularindsendelse - nulstiller fejl og sætter loading til true
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

  
    // 1) LOGIN
    // Forsøger at logge brugeren ind ved at kalde loginAuth med email og password.
    // Hvis der opstår en fejl, eller hvis der ikke findes en bruger i svaret,
    // sættes en fejlbesked, loading stoppes, og funktionen afsluttes.
    const { data, error: loginError } = await loginAuth(email, password)
    if (loginError || !data.user) {
      setError("Forkert email eller adgangskode")
      setLoading(false)
      return
    }

    
    // 2) HENT PROFIL
    // Vi kalder getUser() fra /lib/auth for at hente den aktuelle brugers profil.
    // Funktionen returnerer bl.a. brugerens rolle, som vi skal bruge til at styre adgang og vise de rigtige sider i dashboardet.

    const user = await getUser()
    if (!user?.role) {
      setError("Kunne ikke finde din brugerrolle.")
      setLoading(false)
      return
    }
    // 3) Hvis brugeren eksisterer - SEND VIDERE
    router.push("/dashboard")
    setLoading(false) //slukker loading-state, fordi login-processen er færdig.
  }

  return (
    <Container size={420} my={90}>
      <Paper p={0} radius="sm" className="w-[300px]">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="E-mail"
            placeholder="Skriv din email"
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

          {error && (
            <Text color="red" mt="sm">
              {error}
            </Text>
          )}

          <Button
            className="mt-10 ml-30"
            radius="sm"
            type="submit"
            styles={{
              root: {
                color: "black",
                border: "1px solid gray",
                backgroundColor: "white",
              },
            }}
            disabled={loading} // kan ikke klikke mens der logges ind
            loading={loading} // viser Mantines indbyggede spinner
          >
            Log ind
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

// -------------------------------------------------------------
// Kommentarer til hvad komponenten gør
// -------------------------------------------------------------
// - LoginForm håndterer login-flowet med email og password.
// - Viser fejlbesked hvis login fejler.
// - Viser loading-state på knappen mens der logges ind.
// - Henter brugerens data efter login for at sikre at rollen findes.
// - Sender brugeren videre til /dashboard når login lykkes.
// -------------------------------------------------------------