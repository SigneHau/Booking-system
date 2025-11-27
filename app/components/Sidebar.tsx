"use client";

import Image from "next/image";
import { FaHome, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";

type SidebarProps = {
  user: {
    name: string;
    role: string;
    email: string;
  } | null;
};

export default function Sidebar({ user }: SidebarProps) {
  if (!user) {
    // Vises mens bruger-data hentes
    return (
      <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
        <p className="mt-20 text-gray-600">Indlæser...</p>
      </aside>
    );
  }

  return (
    <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
      {/* Logo + titel */}
      <div className="flex items-center gap-2 mb-12">
        <Image src="/logo-ek.png" alt="Logo" width={80} height={30} />
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

      {/* Bruger-info - nederst i hjørnet */}
      <div className="mt-6 flex flex-col items-center w-full">
        <div className="flex items-center gap-16 w-full p-3 rounded">

          {/* Avatar — gemmer vi så du kan bruge den senere */}
           <Image src="/avatar.png" alt="Avatar" width={60} height={60} /> 

          <div className="flex flex-col">
            <p className="font-heading text-base font-bold">{user.name}</p>
            <p className="text-sm opacity-90">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            <p className="text-sm opacity-70 mb-6">{user.email}</p>

            <PrimaryButton text="Log ud" action="logout" />
          </div>

        </div>
      </div>
    </aside>
  );
}
