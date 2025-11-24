"use client";

import Image from "next/image";
import { FaHome, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { Open_Sans } from "next/font/google";
import PrimaryButton from "./PrimaryButton";

const openSans = Open_Sans({ subsets: ['latin'], weight: ['400','600'] });

type SidebarProps = {
  user: {
    name: string;
    role: string;
    email: string;
  };
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="bg-amber-50 flex flex-col items-center w-76 p-4">
      <div className="flex items-center gap-2 mb-12">
        <Image src="/logo-ek.png" alt="Logo" width={80} height={30} />
        <h1 className="font-heading font-bold text-xl text-black">Booking Lyngby</h1>
      </div>

      <nav className="flex-1 w-full">
        <ul className="space-y-3">
          {/* Book lokaler */}
          <li className={`flex items-center gap-3 p-2 rounded text-base font-normal ${openSans.className}`}>
            <FaHome />
            <span className="text-base font-normal">
              { /* Link til booking baseret på rolle */ }
              <a href={`/${user.role}-dashboard`}>Book lokaler</a>
            </span>
          </li>

          {/* Mine bookinger */}
          <li className={`flex items-center gap-3 p-2 rounded bg-primary  ${openSans.className}`}>
            <FaCalendarAlt />
            <span className="text-base font-normal">
              <a href={`/${user.role}-booking`}>Mine bookinger</a>
            </span>
          </li>

          {/* Hjælp */}
          <li className={`flex items-center gap-3 p-2 rounded bg-primary hover:bg-hover text-secondary text-base font-normal ${openSans.className}`}>
            <FaExclamationCircle />
            <span className="text-base font-normal">
              
            </span>
          </li>
        </ul>
      </nav>

      <div className="mt-6 flex flex-col items-center w-full">
        <div className="flex items-center gap-16 w-full p-3 rounded">
          <Image src="/avatar.png" alt="Avatar" width={60} height={60} />
          <div className="flex flex-col">
            <p className="font-heading text-base font-bold">{user.name}</p>
            <p className={`text-sm opacity-90 ${openSans.className}`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            <p className={`text-sm opacity-70 mb-6 ${openSans.className}`}>{user.email.charAt       (0).toUpperCase() + user.email.slice(1)}</p>
          <PrimaryButton text="Log ud" action="logout" />
          
          </div>
        </div>
      </div>
    </aside>
  );
}
