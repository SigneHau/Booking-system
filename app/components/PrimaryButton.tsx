"use client";
import React from "react";
import { Button } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type PrimaryButtonProps = {
  text: string;
  action: "login" | "logout";
  redirectTo?: string; // valgfri, hvor den sender brugeren hen
};

const PrimaryButton = ({ text, action, redirectTo }: PrimaryButtonProps) => {
  const router = useRouter();

  const handleClick = async () => {
    if (action === "logout") {
      await supabase.auth.signOut();
      router.push(redirectTo || "/");
    } else if (action === "login") {
      router.push(redirectTo || "/student-dashboard");
    }
  };

  return (
    <Button variant="filled" color="black" fullWidth radius="md" onClick={handleClick}>
      {text}
    </Button>
  );
};

export default PrimaryButton;


// Vi bruger props her for at gøre knappen dynamisk og genbrugelig.
// I stedet for at lave to separate knapper (“Log ind” og “Log ud”), kan vi nu:
// 1. Ændre teksten på knappen via `text`
// 2. Vælge hvilken funktion den skal udføre via `action` (“login” eller “logout”)
// 3. Bestemme hvilken side brugeren skal sendes til via `redirectTo`
//
// Fordelen er, at vi kan genbruge den samme komponent på forskellige sider,
// uden at skulle duplikere kode, hvilket gør vedligeholdelse nemmere og koden mere overskuelig.

