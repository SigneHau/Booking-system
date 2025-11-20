import { supabase } from "./supabaseClient"

export async function signUpAuth(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error }
  }
  return { data }
}
