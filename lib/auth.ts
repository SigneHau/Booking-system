import { supabase } from "./supabaseClient"

// LOGIN med email og password
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

// HENT AKTIV BRUGER + PROFIL
export async function getUser() {
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) return null

  const user = authData.user

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .single()

  if (profileError) return null

  return {
    id: user.id,
    email: user.email,
    full_name: profile.full_name,
    role: profile.role,
  }
}
