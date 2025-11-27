"use client";

import React from "react";
import RoleBadge from "@/app/components/RoleBadge";
import { useUser } from "@/app/contexts/UserContext"; // Hent hook

export default function TeacherDashboard() {
  const user = useUser(); // Henter den indloggede bruger fra context

  return (
    <div className="flex flex-col font-semibold mt-4 mb-6 text-3xl">
      <h1>Book et lokale
      </h1>
      <RoleBadge role={user?.role ?? "unknown"} />
    </div>
  );
}
