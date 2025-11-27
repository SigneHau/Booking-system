// app/layout.tsx
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { MantineProvider } from "@mantine/core";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={openSans.className}>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
