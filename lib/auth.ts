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



// Best practice anbefaling

// Selvom dit projekt lige nu kun har én login-side, anbefales det stadig at beholde loginAuth i auth.ts. Det giver dig fleksibilitet senere, og det er mere “Next.js/React-venligt”.

// Page-komponenten (f.eks. HomePage) håndterer UI, form og routing.

// auth.ts håndterer API-kald og Supabase-login.

// Det gør koden renere og lettere at vedligeholde.




