// 🔄 components/RoleBadge.tsx - OPPDATERET
"use client";
import React from "react";

// ⚡️ Inkluder "unknown" i prop-typen
const RoleBadge = ({
  role,
}: {
  role: "student" | "teacher" | "unknown"; // OPPDATERET HER
}) => {
  return (
    <p className="inline-block bg-green-200 px-3 py-1 text-center text-xs font-light rounded-md mt-2 w-fit">
      Logget ind som{" "}
      {role === "student"
        ? "student"
        : role === "teacher"
        ? "lærer"
        : "ukendt"}
    </p>
  );
};

export default RoleBadge;