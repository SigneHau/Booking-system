"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@mantine/core";
import PrimaryButton from "./PrimaryButton";
import { useUser } from "@/hooks/useUser";

export default function UserProfile() {
  const { user, loading } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!user) return; // Hvis der ikke er nogen bruger, gør vi ingenting

    const seed = encodeURIComponent(user.id); // Stabil ID → stabil avatar

    fetch(`https://randomuser.me/api/?seed=${seed}`)
      .then((res) => res.json())
      .then((data) => {
        const url = data.results[0].picture.large; // Tag billedets URL
        setAvatarUrl(url); // Opdater state
      })
      .catch((err) => console.error("Fejl ved hentning af avatar:", err));
  }, [user]);

  const isLoading = loading || !user || !avatarUrl;

  if (isLoading) {
    return (
      <div className="flex items-center gap-8 w-full p-3 rounded">
        <Skeleton height={100} width={100} className="rounded" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={14} width="40%" />
          <Skeleton height={14} width="70%" className="mb-6" />
          <Skeleton height={32} width={96} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8 w-full p-3 rounded">
      {/* Avatar */}
      <img src={avatarUrl} alt="Avatar" className="w-25 h-25 rounded" />

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
  );
}
