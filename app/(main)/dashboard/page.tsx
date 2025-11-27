"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { loginAuth } from "@/lib/auth";
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const { data, error: loginError } = await loginAuth(email, password);
      if (loginError) return setError(loginError.message);

      const user = data?.user;
      if (!user) return setError("Email eller kodeord er forkert");

      // Hent profil fra Supabase
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) return setError("Brugerprofil ikke fundet");

      const role = (profile.role ?? "").toLowerCase().trim(); // <--- sikker håndtering

      // Redirect baseret på rolle
      if (role === "teacher") router.replace("/dashboard/teacher");
      else if (role === "student") router.replace("/dashboard/student");
      else setError(`Ugyldig rolle: '${profile.role}'`);

    } catch (err) {
      console.error(err);
      setError("Noget gik galt. Prøv igen.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans p-6">
      <div className="mr-[200px]">
        <Image src="/login-billede.png" alt="Login billede" width={400} height={300} />
      </div>
      <div className="flex flex-col">
        <Image src="/logo-ek-navn.png" alt="Logo" width={300} height={200} />
        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4 w-full max-w-sm">
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
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
            Log ind
          </button>
        </form>
      </div>
    </div>
  );
}
