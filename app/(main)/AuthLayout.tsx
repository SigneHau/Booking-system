"use client"

import React, { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/app/components/Sidebar"
import { supabase } from "@/lib/supabaseClient"
import { UserContext, UserData } from "@/app/contexts/UserContext"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)

      // 1️⃣ Hent session-bruger
      const {
        data: { user: sessionUser },
        error: sessionError,
      } = await supabase.auth.getUser()
      if (sessionError || !sessionUser) {
        router.replace("/") // Send til login hvis ingen bruger
        return
      }

      // 2️⃣ Hent profil fra database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", sessionUser.id)
        .single()

      if (profileError || !profile) {
        setUser({
          name: sessionUser.email ?? "Ukendt bruger",
          role: "unknown",
          email: sessionUser.email ?? "",
        })
      } else {
        setUser({
          name: profile.full_name ?? sessionUser.email ?? "Ukendt bruger",
          role:
            profile.role?.toLowerCase() === "teacher"
              ? "teacher"
              : profile.role?.toLowerCase() === "student"
              ? "student"
              : "unknown",
          email: sessionUser.email ?? "",
        })
      }

      setLoading(false)

      // 3️⃣ Redirect kun hvis vi er på dashboard-roden
      const role = profile?.role?.toLowerCase()
      const isDashboardRoot =
        pathname === "/dashboard" || pathname === "/dashboard/"
      if (role === "teacher" && isDashboardRoot) {
        router.replace("/dashboard/teacher")
      } else if (role === "student" && isDashboardRoot) {
        router.replace("/dashboard/student")
      }
    }

    loadUser()
  }, [router, pathname])

  if (loading)
    return <p className="p-6 mt-10 text-center text-xl">Indlæser...</p>

  // ✅ Wrapper med UserContext
  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </UserContext.Provider>
  )
}

//Dette component er en client-side wrapper som beskytter dashboardet, loader brugerens profil, redirecter dem korrekt og deler brugerdata via context.
// Layout, som kræver authentication

/**
 * Denne komponent fungerer som det beskyttede layout for dashboardet.
 * Den:
 *  - Henter og verificerer den aktuelle Supabase-bruger
 *  - Indlæser brugerens profil (navn og rolle) fra databasen
 *  - Redirecter brugeren til korrekt dashboard-del baseret på rolle (teacher/student)
 *  - Viser en loader, mens brugerdata hentes
 *  - Leverer brugerinfo via UserContext til hele dashboardet
 *  - Renderer sidebar + indholdslayout når brugeren er valideret
 */

/**
 * Protected dashboard layout:
 *  - Tjekker Supabase session og henter brugerprofil
 *  - Redirecter automatisk til /teacher eller /student dashboards
 *  - Viser loader under hentning
 *  - Deler brugerdata globalt via UserContext
 *  - Viser sidebar og indhold for autentificerede brugere
 */
