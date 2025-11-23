// tailwind.config.ts
import type { Config } from "tailwindcss";
import { theme } from "./lib/theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        hover: theme.colors.hover,
        beige: theme.colors.beige,
        gray: theme.colors.gray,
        lightBlue: theme.colors.lightBlue,
        danger: theme.colors.danger,
        success: theme.colors.success,
      },

      fontFamily: {
        heading: [theme.fonts.heading, "serif"],
        subheading: [theme.fonts.subheading, "serif"],
        body: [theme.fonts.body, "serif"],
      },
    },
  },

  plugins: [],
};

export default config;
