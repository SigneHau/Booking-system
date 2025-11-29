import { createContext, useContext } from "react"

// ---------------------------------------------------------
// Definerer hvilken information vi gemmer om en bruger.
// Dette gør koden mere sikker og tydelig (TypeScript).
// ---------------------------------------------------------
export type UserData = {
  name: string
  role: "student" | "teacher" | "unknown"
  email: string
  id: string
}

// ---------------------------------------------------------
// Opretter en React Context, som kan holde brugerens data.
// Context bruges til at dele data på tværs af hele appen,
// uden at sende props ned gennem alle komponenter.
// Den starter som 'null' indtil AuthWrapper giver den en værdi.
// ---------------------------------------------------------
export const UserContext = createContext<UserData | null>(null)

// ---------------------------------------------------------
// Et lille custom hook, som gør det nemt at hente
// brugerinformationen i hele appen:
// const user = useUser()
// Hooket sørger for, at vi ikke manuelt skal importere både
// useContext og UserContext hver gang.
// ---------------------------------------------------------
export const useUser = () => useContext(UserContext)
