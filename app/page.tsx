"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");       // Gemmer input fra email-felt
  const [password, setPassword] = useState(""); // Gemmer input fra password-felt
  const [error, setError] = useState("");       // Gemmer fejlmeddelelser
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); // Reset evt. tidligere fejl

    try {
      // 1️⃣ Log ind via Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message); // Hvis login fejler, vis fejl
        return;
      }

      const user = data?.user;
      if (!user) {
        setError("Email eller kodeord er forkert"); // Ingen bruger fundet
        return;
      }

      // 2️⃣ Hent brugerprofil fra "profiles" tabellen
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("user_id", user.id) // Brug user_id fra auth som foreign key
        .single();

      if (profileError || !profile) {
        setError("Brugerprofil ikke fundet"); // Profil findes ikke
        return;
      }

      // 3️⃣ Redirect baseret på rolle
      if (profile.role.toLowerCase() === "teacher") {
        router.replace("/dashboard/teacher"); // Lærer-dashboard
      } else if (profile.role.toLowerCase() === "student") {
        router.replace("/dashboard/student"); // Studerende-dashboard
      } else {
        setError("Ugyldig rolle"); // Rolle findes ikke i systemet
      }
    } catch (err) {
      console.error(err);
      setError("Noget gik galt. Prøv igen."); // Generel fejl
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans p-6">

      {/* Venstre billede */}
      <div className="mr-[200px]">
        <Image
          src="/login-billede.png"
          alt="Login billede"
          width={400}
          height={300}
          loading="eager" // For at forbedre LCP
        />
      </div>

      {/* Højre kolonne med logo og login */}
      <div className="flex flex-col mb-4  ">
        <div className="-mt-20">
          <Image
            src="/logo-ek-navn.png"
            alt="Logo"
            width={300}
            height={200}
            loading="eager"
          />
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 mt-4 w-full max-w-sm"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Kodeord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-900 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Log ind
          </button>
        </form>
      </div>
    </div>
  );
}
