"use client";
import Image from "next/image";
import { FaHome, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ['latin'], weight: ['400','600'] });

type SidebarProps = {
  user: {
    name: string;
    role: string;
    email: string;
    avatarUrl?: string;
  };
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="bg-amber-50 flex flex-col items-center justify-between w-76 p-4">
      <div className="flex items-center gap-2 mb-12">
        <Image src="/logo-ek.png" alt="Logo" width={80} height={30} />
        <h1 className="font-heading font-bold text-xl text-black">Booking Lyngby</h1>
      </div>

      <nav className="flex-1 w-full">
        <ul className="space-y-3">
          <li className={`flex items-center gap-3 p-2 rounded bg-primary hover:bg-hover text-secondary text-base font-normal ${openSans.className}`}>
            <FaHome />
            <span className="text-base font-normal">Book lokaler</span>
          </li>
          <li className={`flex items-center gap-3 p-2 rounded bg-primary hover:bg-hover text-secondary text-base font-normal ${openSans.className}`}>
            <FaCalendarAlt />
            <span className="text-base font-normal">Mine bookinger</span>
          </li>
          <li className={`flex items-center gap-3 p-2 rounded bg-primary hover:bg-hover text-secondary text-base font-normal ${openSans.className}`}>
            <FaExclamationCircle />
            <span className="text-base font-normal">Hjælp</span>
          </li>
        </ul>
      </nav>

      <div className="mt-6 flex flex-col items-center w-full">
        <div className="flex items-center gap-3 w-full bg-secondary text-primary p-3 rounded">
          <div className="w-16 h-16 rounded-full bg-gray flex items-center justify-center text-black text-xl">
            {user.name[0]}
          </div>
          <div className="flex flex-col">
            <p className="font-heading text-base font-bold">{user.name}</p>
            <p className={`text-sm opacity-90 ${openSans.className}`}>{user.role}</p>
            <p className={`text-xs opacity-70 mb-6 ${openSans.className}`}>{user.email}</p>
            <PrimaryButton text="Log ud" action="logout" />
          </div>
        </div>
      </div>
    </aside>
  );
}
