import { supabase } from "./supabaseClient"

// LOGIN med email og password fra supabase
export async function loginAuth(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

// LOGOUT – brugt af PrimaryButton
export async function logoutAuth() {
  return await supabase.auth.signOut()
}

// HENT AKTIV BRUGER + PROFIL fra supabase
export async function getUser() {
  // Hent auth-bruger
  const { data: authData, error: authError } = await supabase.auth.getUser()
  // Stop hvis ingen bruger
  if (authError || !authData?.user) return null
  // Gemmer brugeren fra auth-responsen
  const user = authData.user

  // Hent profil fra profiles-tabellen
  // .single() = vi forventer præcis én række
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .single()

  // Hvis profilen ikke kan hentes → returner null
  if (profileError) return null

  // Returnerer et samlet user-objekt
  // Auth-data + data fra profiles-tabellen
  return {
    id: user.id,
    email: user.email,
    full_name: profile.full_name,
    role: profile.role,
  }
}
