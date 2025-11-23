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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
        setUserData({
          name: user.email ?? "Ukendt bruger",
          role: "unknown",
          email: user.email ?? "",
        });
      } else {
        setUserData({
          name: profile.full_name,
          role: profile.role.toLowerCase(), // små bogstaver til URL
          email: user.email ?? "",
        });
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
