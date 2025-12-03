"use client"

import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"

// Type til brugerdata
export type User = {
  id: string
  email: string | undefined
  full_name: string
  role: "student" | "teacher"
}

// Hook til at hente brugerdata fra Supabase og gemme i state
// Et hook er en funktion, der kan bruges i React-komponenter
// Et hook er en måde at dele logik mellem komponenter og undgå at skrive den samme logik flere steder
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // useEffect kører, når komponenten mountes (rendres første gang)
  useEffect(() => {
    // Henter brugerdata fra Supabase og sætter det i state
    getUser()
      .then(setUser) // Sætter brugerdata i state
      .finally(() => setLoading(false)) // Sætter loading til false, når brugerdata er hentet
  }, []) // [] betyder, at useEffect kun kører en gang, når komponenten mountes

  return { user, loading } // Returnerer brugerdata og loading state
}
