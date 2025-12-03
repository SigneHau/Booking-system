"use client"

import { useEffect, useState } from "react"
// Heroicons outline (streg) for navigation ikoner
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineExclamationCircle,
} from "react-icons/hi"
import PrimaryButton from "./PrimaryButton"
import LoadingSpinner from "./LoadingSpinner" // Loader komponent fra Mantine
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function Sidebar() {
  const { user, loading } = useUser()
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  // Hent aktuelt URL-path - til den grå baggrund som makere den side du står på i menuen
  const pathname = usePathname()
  // useEffect kører, når komponenten mountes eller 'user' ændrer sig
  useEffect(() => {
    if (!user) return // Hvis der ikke er nogen bruger, gør vi ingenting

    fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => {
       const url = data.results[0].picture.large // Tag billedets URL

        setAvatarUrl(url) // Opdater state
      })
      .catch((err) => console.error("Fejl ved hentning af avatar:", err))
 }, [user]) // Effekt kører kun når 'user' ændrer sig

  // Hvis bruger-data ikke er tilgængelig endnu, vis loader
  if (loading || !user) {
    return (
      <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
        <div className="mt-20">
          <LoadingSpinner />
        </div>
      </aside>
    )
  }

  return (
    <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
      {/* Logo + titel */}
      <div className="flex items-center gap-2 mb-12">
        {/* ESLint kommentar for at tillade <img> i Next.js */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ek.png" alt="Logo" width={80} height={30} />
        <h1 className="font-heading font-bold text-xl text-black">
          Booking Lyngby
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full border-t border-gray-300">
        <ul className="space-y-3 pb-3 border-b border-gray-300 ">
          {/* Book lokaler link -Pathname giver den grå baggrund så du kan se hvilken side du står på og user.role kigger på hvilken rolle er du så du sendes til det rigtige side om du lærer eller student */}
          <li
            className={`flex items-center mt-5 gap-3 p-2 rounded cursor-pointer 
            ${pathname.startsWith(`/dashboard`) ? "bg-gray-100" : ""}`}
          >
            {/* Heroicon-icon outline, blå baggrund */}
            <HiOutlineHome className="bg-blue-100 rounded text-3xl p-1 text-blue-500" />
            <a href={`/dashboard`}>Book lokaler</a>
          </li>

          {/* Mine bookinger link - pathname - giver grå baggrund så du kan se du er på denne side */}
          <li
            className={`flex items-center gap-3 p-2 rounded cursor-pointer 
            ${pathname.startsWith(`/bookings`) ? "bg-gray-100" : ""}`}
          >
            {/* Heroicon - icon outline, grøn baggrund */}
            <HiOutlineCalendar className="bg-green-100 rounded text-3xl p-1 text-green-500" />
            <a href={`/bookings/`}>Mine bookinger</a>
          </li>

          {/* Hjælp link - pathname - giver grå baggrund så du kan se du er på denne side */}
          <li
            className={`flex items-center gap-3 p-2 rounded cursor-pointer 
            ${pathname === "/help" ? "bg-gray-100" : ""}`}
          >
            {/* Heroicon outline, lilla baggrund */}
            <HiOutlineExclamationCircle className="bg-purple-100 rounded text-3xl p-1 text-purple-500" />
            <a href="/help">Hjælp</a>
          </li>
        </ul>
      </nav>

      {/* Bruger-info nederst */}
      <div className="mt-6 flex flex-col border-t p-2 border-gray-200">
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
            <p className="font-heading text-base font-bold">{user.full_name}</p>
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
  )
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
