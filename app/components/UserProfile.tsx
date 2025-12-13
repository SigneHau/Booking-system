"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Skeleton } from "@mantine/core";
import PrimaryButton from "./PrimaryButton";
import { useUser } from "@/hooks/useUser";

export default function UserProfile() {
  const { user, loading } = useUser(); // et custom hook, der henter den aktuelle bruger og en loading-state.
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (!user) return; // Hvis der ikke er nogen bruger, gør vi ingenting

    const seed = encodeURIComponent(user.id); // / bruger id som seed, så samme bruger får samme avatar
//henter aventar billede til profil fra denne  api
    fetch(`https://randomuser.me/api/?seed=${seed}`)
      .then((res) => res.json())
      .then((data) => {
        const url = data.results[0].picture.large;  
        setAvatarUrl(url); // Opdater state med aventar-Url
      })
      .catch((err) => console.error("Fejl ved hentning af avatar:", err));
  }, [user]);   // kører når user ændres

  const isLoading = loading || !user || !avatarUrl;  //Hvis brugerdata eller avatar ikke er klar, vises skeletons som placeholder.

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

    // skeleton loader mens data hentes

  return (
    <div className="flex items-center gap-8 w-full p-3 rounded">
      {/* Avatar - // viser avatar når den er hentet*/}
      {/* next/image - optimerer billeder automatisk med responsive størrelser, lazy loading og moderne formater */}
      <Image
        src={avatarUrl}
        alt="Avatar"
        width={100}
        height={100}
        className="w-25 h-25 rounded"
      />

      {/* Brugerens info */}
      <div className="flex flex-col">
        {/* Viser navn */}
        <p className="font-heading text-base font-bold">{user.full_name}</p>
        {/* Viser rolle med stort begyndelsesbogstav */}
        <p className="text-sm opacity-90">
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
        {/* Viser brugerens Email */}
        <p className="text-sm opacity-70 mb-6">{user.email}</p>

        {/* Log ud knap */}
        <PrimaryButton text="Log ud" action="logout" />
      </div>
    </div>
  );
}
