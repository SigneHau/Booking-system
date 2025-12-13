import type { User } from "@/hooks/useUser"

// Centralized Filters type - import this instead of redeclaring
export type Filters = {
  floor: number | null
  date: Date | null
  from: string | null
  to: string | null
  role: User["role"]
}