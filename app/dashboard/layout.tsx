"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/app/components/Sidebar"
import { supabase } from "@/lib/supabaseClient"

type UserData = {
  name: string
  role: string
  email: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)

      // ❗ Henter den nuværende bruger fra Supabase (session / auth)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      // ❗ Hvis ingen bruger → send til login (beskyt dashboard)
      if (userError || !user) {
        router.push("/")
        setLoading(false)
        return
      }

      // ❗ Henter ekstra info om brugeren fra "profiles" tabellen
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user.id)
        .single()

      // ❗ Hvis profil mangler → brug fallback data
      if (profileError || !profile) {
        setUserData({
          name: user.email ?? "Ukendt bruger",
          role: "unknown",
          email: user.email ?? "",
        })
      } else {
        setUserData({
          name: profile.full_name,
          role: profile.role.toLowerCase(), // små bogstaver til URL
          email: user.email ?? "",
        })
      }

      setLoading(false)
    }

    // ❗ useEffect kører funktionen én gang når layoutet loader
    fetchUser()
  }, [router]) // ❗ Kører igen hvis router skifter (sker sjældent)

  if (loading) return <div className="p-6 text-center mt-20">Loader...</div>
  if (!userData)
    return <div className="p-6 text-red-600">Du er ikke logget ind.</div>

  return (
    <div className="flex min-h-screen">
      <Sidebar user={userData} />

      {/* ❗ children = indholdet fra dashboard-undersiderne */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

/*
--------------------------------------------------------------
Kort forklaring på de svære dele:

- supabase.auth.getUser()
  Henter den nuværende bruger ud fra sessionen (er de logget ind?)

- router.push("/")
  Bruges for at beskytte dashboardet. Hvis ingen bruger → send til login.

- Profilopslag (.from("profiles").eq("user_id", user.id))
  Her hentes detaljer om brugeren, som ikke ligger i auth (navn, rolle osv.)

- children
  Det indhold, der kommer fra den dashboard-side man er på.
  Fx bookings, users, profil osv.

- useEffect med [router]
  Kører kun når layoutet loades, eller hvis router ændrer sig.
--------------------------------------------------------------
*/
