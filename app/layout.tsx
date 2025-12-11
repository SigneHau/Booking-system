// app/layout.tsx
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";


import { Open_Sans } from "next/font/google";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={openSans.className}>
      <body>
        
         {/* // Wrap hele appen i Mantine + Modals systemet */}
    <MantineProvider>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
      </body>
    </html>
  );
}

// Wrapper hele appen i MantineProvider, så alle komponenter har adgang til Mantine-temaet.
//Loader Google-fonten Open Sans og sætter den på hele HTML’en.

//Wrapper children i ModalsProvider, så dine modals fungerer overalt i appen.