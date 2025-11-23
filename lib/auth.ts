import { supabase } from "./supabaseClient"

// LOGIN:
// Supabase tjekker email + password.
// Hvis de matcher, opretter Supabase en session (token) og gemmer den i browseren.
// Brugeren bliver dermed logget ind og kan tilgå beskyttede sider.
export async function loginAuth(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Skal returnere et objekt med disse to felter
  return { data, error };
}


















// // SIGNUP:
// // Opretter en ny bruger i Supabase Auth.
// // Brugeren får en bekræftelsesmail og bliver først aktiv efter bekræftelse.
// // Der oprettes ingen session her – signup logger dig ikke ind. 
// export async function signUpAuth(email: string, password: string) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   })

//   if (error) {
//     return { error }
//   }
//   return { data }
// }



