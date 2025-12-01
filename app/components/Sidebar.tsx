"use client";

import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import LoadingSpinner from "./LoadingSpinner"; // Loader fra Mantine

type SidebarProps = {
  user: {
    name: string;
    role: string;
    email: string;
  } | null;
};

export default function Sidebar({ user }: SidebarProps) {
  // State til avatar-URL
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!user) return; // Hvis ingen bruger, gør vi ingenting

    // Brug email som key i localStorage, så hver bruger får sit eget billede
    const storageKey = `avatarUrl_${user.email}`;
    const savedAvatar = localStorage.getItem(storageKey);

    if (savedAvatar) {
      // Hvis der allerede er gemt en avatar for denne bruger, brug den
      setAvatarUrl(savedAvatar);
    } else {
      // Ellers hent et nyt random billede fra Random User API
      fetch("https://randomuser.me/api/")
        .then((res) => res.json()) // Konverter JSON-respons til JS-objekt
        .then((data) => {
          const url = data.results[0].picture.large; // Tag billed-URL
          localStorage.setItem(storageKey, url); // Gem kun for denne bruger
          setAvatarUrl(url); // Opdater state, så avatar vises
        })
        .catch((err) => console.error("Fejl ved hentning af avatar:", err));
    }
  }, [user]); // Kører kun, når 'user' ændrer sig (typisk ved login)

  // Loader vises, mens brugerdata indlæses
  if (!user) {
    return (
      <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
        <div className="mt-20">
          <LoadingSpinner />
        </div>
      </aside>
    );
  }

  return (
    <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
      {/* Logo + titel */}
      <div className="flex items-center gap-2 mb-12">
         {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ek.png" alt="Logo" width={80} height={30} />
        <h1 className="font-heading font-bold text-xl text-black">
          Booking Lyngby
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full">
        <ul className="space-y-3">
          <li className="flex items-center gap-3 p-2 rounded text-base">
            <FaHome />
            <a href={`/dashboard/${user.role}`}>Book lokaler</a>
          </li>

          <li className="flex items-center gap-3 p-2 rounded bg-primary">
            <FaCalendarAlt />
            <a href={`/bookings/${user.role}`}>Mine bookinger</a>
          </li>

          <li className="flex items-center gap-3 p-2 rounded bg-primary hover:bg-hover text-secondary text-base">
            <FaExclamationCircle />
            <a href="/help">Hjælp</a>
          </li>
        </ul>
      </nav>

      {/* Bruger-info nederst */}
      <div className="mt-6 flex flex-col">
        <div className="flex items-center gap-8 w-full p-3 rounded">
          {/* Avatar */}
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-25 h-25 rounded" />   
          ) : (
            <div className="w-16 h-16 bg-gray-300" /> // fallback placeholder
          )}

          <div className="flex flex-col">
            {/* Brugerens navn */}
            <p className="font-heading text-base font-bold">{user.name}</p>
            {/* Brugerens rolle med stort begyndelsesbogstav */}
            <p className="text-sm opacity-90">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            {/* Brugerens email */}
            <p className="text-sm opacity-70 mb-6">{user.email}</p>

            {/* Log ud knap */}
            <PrimaryButton text="Log ud" action="logout" />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* 
Sidebar-komponent forklaring:

1. Viser sidebar med:
   - Logo og titel øverst
   - Navigation links (Book lokaler, Mine bookinger, Hjælp)
   - Bruger-info nederst (avatar, navn, rolle, email)
   - Log ud-knap via PrimaryButton

2. Avatar hentes fra Random User API:
   - Kun én gang pr. bruger (gemmes i localStorage under brugerens email)
   - Hvis brugeren navigerer rundt, ændres billedet ikke
   - Andre brugere får deres eget tilfældige billede

3. Loader vises, mens bruger-data indlæses

4. Komponent er dynamisk, afhænger af `user` prop:
   - Hvis `user` er null, vises kun loader
   - Hvis `user` er tilgængelig, vises sidebar med bruger-info og navigation
*/

// Forklaring:

// @next/next/no-img-element er reglen, som Next.js ESLint-plugin bruger, fordi de anbefaler at bruge <Image> fra next/image i stedet for <img> for optimering.

// Kommentaren fortæller ESLint at ignorere kun den næste linje, så de gule streger forsvinder.
