// /app/dashboard/layout.tsx (eller hvor dit layout er)

"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importér usePathname
import Sidebar from "./../components/Sidebar";
import { supabase } from "@/lib/supabaseClient";

// Vi definerer, hvilke data vi forventer i vores brugerobjekt
type UserData = { 
  name: string; 
  role: string; 
  email: string 
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Brug router til omdirigering
  const pathname = usePathname(); // Brug pathname til at tjekke nuværende rute

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      console.log("1. Starter fetch af bruger fra Supabase...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("2. Resultat af bruger-fetch. Bruger:", user ? user.id : "Ingen");
      // 1. Tjek om brugeren er logget ind
      if (userError || !user) {
        // Hvis der er en fejl, eller brugeren ikke er logget ind, sendes de til login
        router.push("/"); 
        setLoading(false);
        return;
      }
      
      console.log("3. Bruger logget ind. Henter profil...")
      // Vi har en bruger. Hent profilen.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role") // Antager, at profiles KUN har full_name og role
        .eq("user_id", user.id)
        .single();
      console.log("4. Resultat af profil-fetch. Profil:", profile ? profile.role : "Fejl")
      // 2. Tjek for profilfejl og sæt brugerdata
      if (profileError || !profile) {
        // Håndter, hvis profilen mangler, men brugeren er logget ind (fejl i opsætning)
        console.error("Profile not found:", profileError);
        setUserData({ 
          name: user.email ?? "Ukendt Bruger", 
          role: "unknown", 
          email: user.email ?? "" 
        });
      } else {
        // Succes: Sæt data fra profil og email fra auth-objektet
        const data: UserData = {
          name: profile.full_name,
          role: profile.role,
          email: user.email ?? "", // Brug user.email fra Supabase Auth
        };
        setUserData(data);

        // 3. Tjek for korrekt omdirigering
        // Tjek om den aktuelle sti (pathname) matcher rollen.
        const expectedPath = `/${data.role}-dashboard`;
        
        // Hvis brugeren er på en dashboard-sti, der IKKE matcher deres rolle, omdiriger dem.
        // F.eks. hvis lærer er på /student-dashboard
        if (pathname.startsWith("/student-dashboard") && data.role !== "student") {
             router.push(expectedPath);
        } else if (pathname.startsWith("/teacher-dashboard") && data.role !== "teacher") {
             router.push(expectedPath);
        }
      }

      setLoading(false);
    };

    fetchUserAndProfile();
    // Inkluder pathname som en afhængighed for at tjekke omdirigering, hvis stien ændres
  }, [router, pathname]); 

  // --- Rendering ---

  if (loading) return <div className="p-6 text-center mt-20">Loader...</div>;
  
  // Dette burde teknisk set ikke ske, da vi omdirigerer ovenfor, 
  // men det er en god sikkerhed.
  if (!userData) return <div className="p-6 text-red-600">Fejl: Kunne ikke hente brugerdata. Prøv at logge ind igen.</div>;
  
  return (
    <div className="flex min-h-screen">
      {/* user prop sendes nu til Sidebar */}
      <Sidebar user={userData} /> 
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}