import { supabase } from "./supabaseClient"

// LOGIN
export async function loginAuth(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}


// HENT BRUGER + PROFIL FRA SUPABASE
export async function getUser() {
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData?.user) {

    console.log("Fejl ved hentning af auth-bruger:", authError)
    return null
  }

  const authUser = authData.user

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", authUser.id)
    .single()

  if (profileError) {
    return null
  }

  return {
    id: authUser.id,          // 👈 nødvendig for booking
    email: authUser.email,
    full_name: profile.full_name,
    role: profile.role,
  }
}

