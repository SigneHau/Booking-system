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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // 1) LOGIN
    const { data, error: loginError } = await loginAuth(email, password)

    if (loginError || !data.user) {
      setError("Forkert email eller adgangskode")
      setLoading(false)
      return
    }

    // 2) HENT PROFIL
    const user = await getUser()

    if (!user?.role) {
      setError("Kunne ikke finde din brugerrolle.")
      setLoading(false)
      return
    }

    // 3) SEND VIDERE
    router.push("/dashboard")
    setLoading(false)
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
            disabled={loading}
            loading={loading}
          >
            Log ind
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
