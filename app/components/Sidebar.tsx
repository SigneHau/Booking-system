"use client";

import { useEffect, useState } from "react";
// Heroicons outline (streg) for navigation ikoner
import { HiOutlineHome, HiOutlineCalendar, HiOutlineExclamationCircle } from "react-icons/hi";
import PrimaryButton from "./PrimaryButton";
import LoadingSpinner from "./LoadingSpinner"; // Loader komponent fra Mantine

// Typing for Sidebar props
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

  // useEffect kører, når komponenten mountes eller 'user' ændrer sig
  useEffect(() => {
    if (!user) return; // Hvis der ikke er nogen bruger, gør vi ingenting

    // Gemmer avatar per bruger i localStorage, så de får samme billede hver gang
    const storageKey = `avatarUrl_${user.email}`;
    const savedAvatar = localStorage.getItem(storageKey);

    if (savedAvatar) {
      // Hvis avatar allerede er gemt, brug den
      setAvatarUrl(savedAvatar);
    } else {
      // Ellers hent et nyt tilfældigt billede fra Random User API
      fetch("https://randomuser.me/api/")
        .then((res) => res.json())
        .then((data) => {
          const url = data.results[0].picture.large; // Tag billedets URL
          localStorage.setItem(storageKey, url); // Gem i localStorage
          setAvatarUrl(url); // Opdater state
        })
        .catch((err) => console.error("Fejl ved hentning af avatar:", err));
    }
  }, [user]); // Effekt kører kun når 'user' ændrer sig

  // Hvis bruger-data ikke er tilgængelig endnu, vis loader
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
        {/* ESLint kommentar for at tillade <img> i Next.js */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ek.png" alt="Logo" width={80} height={30} />
        <h1 className="font-heading font-bold text-xl text-black">Booking Lyngby</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full ml-5">
        <ul className="space-y-3  ">
          {/* Book lokaler link */}
          <li className="flex items-center gap-3 p-2 rounded">
            {/* Heroicon outline, blå baggrund */}
            <HiOutlineHome className="bg-blue-200 rounded text-3xl p-1 text-blue-500" />
            <a href={`/dashboard/${user.role}`}>Book lokaler</a>
          </li>

          {/* Mine bookinger link */}
          <li className="flex items-center gap-3 p-2 rounded">
            {/* Heroicon outline, grøn baggrund */}
            <HiOutlineCalendar className="bg-green-200 rounded text-3xl p-1 text-green-600"/>
            <a href={`/bookings/${user.role}`}>Mine bookinger</a>
          </li>

          {/* Hjælp link */}
          <li className="flex items-center gap-3 p-2 rounded">
            {/* Heroicon outline, lilla baggrund */}
            <HiOutlineExclamationCircle className="bg-purple-300 rounded text-3xl p-1 text-purple-700" />
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

          {/* Brugerens info */}
          <div className="flex flex-col">
            {/* Navn */}
            <p className="font-heading text-base font-bold">{user.name}</p>
            {/* Rolle med stort begyndelsesbogstav */}
            <p className="text-sm opacity-90">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            {/* Email */}
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
Kommentarer om koden generelt:

1. Sidebar viser:
   - Logo + titel øverst
   - Navigation links (Book lokaler, Mine bookinger, Hjælp)
   - Bruger-info nederst (avatar, navn, rolle, email)
   - Log ud-knap

2. Avatar hentes fra Random User API:
   - Gemmes per bruger i localStorage
   - Bevares ved navigation mellem sider

3. Ikoner:
   - Alle er Heroicons outline for ens streg-stil
   - Baggrundsfarve på ikoner matches farveskema
   - Padding og størrelse sikrer visuel balance

4. Loader vises, mens bruger-data hentes

5. Komponent afhænger af 'user' prop:
   - Hvis user er null → loader
   - Hvis user findes → sidebar med info og navigation
*/
