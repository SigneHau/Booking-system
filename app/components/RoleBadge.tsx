"use client"
import { useUser } from "@/hooks/useUser"

const getRoleLabel = (role?: string) => {
  switch (role) {
    case "Student":
      return "studerende"
    case "Teacher":
      return "lærer"
    default:
      return "ukendt"
  }
}

export default function RoleBadge() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <span className="inline-block bg-gray-200 px-3 py-1 text-xs rounded-md mt-2 w-[150px] ">
        Henter brugerdata...
      </span>
    )
  }

  return (
    <p className="inline-block bg-green-200 px-3 py-1 text-center text-xs font-light rounded-md mt-2 w-fit">
      Logget ind som {getRoleLabel(user?.role)}
    </p>
  )
}
