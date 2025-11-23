"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";

type UserData = {
  name: string;
  role: string;
  email: string;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      // 1. Hent bruger fra Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        setLoading(false);
        return;
      }

      // 2. Hent profil
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("Profile not found", profileError);
        setUserData({
          name: user.email ?? "Ukendt bruger",
          role: "unknown",
          email: user.email ?? "",
        });
      } else {
        // Brug små bogstaver til path for at undgå browser-storbogstav-problem
        const role = profile.role.toLowerCase();
        setUserData({
          name: profile.full_name,
          role: role,
          email: user.email ?? "",
        });

        router.push(`/${role}-dashboard`);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) return <div className="p-6 text-center mt-20">Loader...</div>;
  if (!userData) return <div className="p-6 text-red-600">Du er ikke logget ind.</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar user={userData} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
// Forklaring for dig som begynder:

// Vi bruger kun én useEffect til at hente bruger + profil.

// Vi laver role.toLowerCase(), så URL altid bliver med små bogstaver.

// Loader vises, mens vi henter data.

// Hvis bruger ikke er logget ind, bliver man sendt til login.