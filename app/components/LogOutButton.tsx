"use client"

import React from "react"
import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import { logoutAuth } from "@/lib/auth"

type PrimaryButtonProps = {
  text: string
  redirectTo?: string // valgfri side efter log ud
}

const LogOutButton = ({ text, redirectTo }: PrimaryButtonProps) => {
  const router = useRouter()

  const handleClick = async () => {
    // Logger brugeren ud
    await logoutAuth()
    // Sender brugeren videre (fallback til forsiden)
    router.push(redirectTo || "/")
  }

  return (
    <Button
      variant="filled"
      color="black"
      fullWidth
      radius="md"
      onClick={handleClick}
    >
      {text}
    </Button>
  )
}

export default LogOutButton
