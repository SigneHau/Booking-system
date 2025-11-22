import type { Config } from "tailwindcss";
import { theme } from "./lib/theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        background: theme.colors.background,
        foreground: theme.colors.foreground,
      },
      fontFamily: {
        sans: theme.fonts.sans,
        mono: theme.fonts.mono,
      },
    },
  },
  plugins: [],
};

export default config;
