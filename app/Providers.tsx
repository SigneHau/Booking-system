"use client"
// Gør filen til en client component (krævet for modals)

import { MantineProvider } from "@mantine/core"
// Global Mantine styling + tema

import { ModalsProvider } from "@mantine/modals"
// Gør det muligt at bruge modals i hele appen

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Wrap hele appen i Mantine + Modals systemet
    <MantineProvider>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  )
}

/*
  Providers.tsx SKAL ligge i /app,
  fordi kun filer i /app kan bruges som globale wrappers
  omkring hele appen i layout.tsx.
*/