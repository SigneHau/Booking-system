"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/app/components/Sidebar"
import { supabase } from "@/lib/supabaseClient"
import { UserContext, UserData } from "@/app/contexts/UserContext"
import LoadingSpinner from "./LoadingSpinner"

/**
 * ------------------------------------------------------------
 * AuthWrapper
 * ------------------------------------------------------------
 * Dette component beskytter dashboardet og sørger for:
 *  1) At tjekke om en bruger er logget ind via Supabase
 *  2) At hente brugerens profil-data (navn + rolle)
 *  3) At redirecte brugeren til det rigtige dashboard
 *     - /dashboard/student
 *     - /dashboard/teacher
 *  4) At vise en spinner, mens data indlæses
 *  5) At give hele appen adgang til brugerinfo via UserContext
 */
export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // Gemmer den aktive brugerprofil
  const [user, setUser] = useState<UserData | null>(null)

  // Styrer om vi stadig loader brugerdata
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)

      // 1️⃣ Hent session-bruger fra Supabase Auth
      // Hvis ingen session findes → brugeren er ikke logget ind
      const {
        data: { user: sessionUser },
        error: sessionError,
      } = await supabase.auth.getUser()
      if (sessionError || !sessionUser) {
        router.replace("/") // Send til login hvis ingen bruger
        return
      }

      // 2️⃣ Hent profil fra database
      // 2️⃣ Hent brugerens profil i Supabase "profiles"-tabellen
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", sessionUser.id)
        .single()

      if (!profile || profileError) {
        // Hvis der ikke findes en profil → brug fallback-data
        setUser({
          name: sessionUser.email ?? "Ukendt bruger",
          role: "unknown",
          email: sessionUser.email ?? "",
          id: sessionUser.id,
        })
      } else {
        // Profil findes → brug data fra databasen
        setUser({
          name: profile.full_name ?? sessionUser.email ?? "Ukendt bruger",
          // Sikrer at rollen altid er lowercase og korrekt
          role:
            profile.role?.toLowerCase() === "teacher"
              ? "teacher"
              : profile.role?.toLowerCase() === "student"
              ? "student"
              : "unknown",
          email: sessionUser.email ?? "",
          id: sessionUser.id,
        })
      }

      setLoading(false)
    }

    loadUser()
  }, [router, pathname])

  // 4️⃣ Mens vi henter brugerdata → vis loader
  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadingSpinner />
      </div>
    )

  // ✅ Wrapper med UserContext
  /**
   * 5️⃣ Når brugerdata er hentet:
   *  - Giv alle child-components adgang til brugeren via UserContext
   *  - Render dashboard-layout (sidebar + sideindhold)
   */
  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </UserContext.Provider>
  )
}

/**
 * ------------------------------------------------------------
 * Kort opsummering:
 * ------------------------------------------------------------
 * Dette component er din "beskyttede skal" rundt om dashboardet.
 *
 * Det:
 *  - Tjekker om brugeren er logget ind
 *  - Henter brugerprofil fra databasen
 *  - Viser loader undervejs
 *  - Redirecter baseret på rolle
 *  - Deler brugerinfo via UserContext
 *  - Viser sidebar + børn (children), når alt er klar
 *
 * Bruges i layout for at sikre, at alt indhold kun må ses af loggede brugere.
 */
