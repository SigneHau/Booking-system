import { createContext, useContext } from "react";

// Typen på brugeren
export type UserData = {
  name: string;
  role: "student" | "teacher" | "unknown";
  email: string;
};

// Context initialiseres med null
export const UserContext = createContext<UserData | null>(null);

// Hook til nem adgang
export const useUser = () => useContext(UserContext);
