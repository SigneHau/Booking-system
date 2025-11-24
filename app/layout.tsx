// app/layout.tsx
import "./globals.css"
import "@mantine/core/styles.css"

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core"

import { Open_Sans } from "next/font/google"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" {...mantineHtmlProps} className={openSans.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}
