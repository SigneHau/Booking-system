import './globals.css';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { theme } from '../lib/theme';

import { Crimson_Text, Cormorant, Linden_Hill } from 'next/font/google';

// Google Fonts
const crimson = Crimson_Text({ subsets: ['latin'], weight: '400' });
const cormorant = Cormorant({ subsets: ['latin'], weight: '400' });
const lindenHill = Linden_Hill({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

// Helper til 10-farver tuple (Mantine type)
function colorTuple(color: string | undefined): readonly [string, string, string, string, string, string, string, string, string, string] {
  const c = color ?? "#DADCE0";
  return [c, c, c, c, c, c, c, c, c, c] as const;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} className={`${crimson.className} ${cormorant.className} ${lindenHill.className}`}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={{
            colors: {
              primary: colorTuple(theme.colors.primary),
              secondary: colorTuple(theme.colors.secondary),
              gray: colorTuple(theme.colors.gray),
              danger: colorTuple(theme.colors.danger),
              success: colorTuple(theme.colors.success),
              hover: colorTuple(theme.colors.hover),
              beige: colorTuple(theme.colors.beige),
              lightBlue: colorTuple(theme.colors.lightBlue),
            },
            fontFamily: lindenHill.style.fontFamily,          // body font
            headings: { fontFamily: crimson.style.fontFamily }, // headings
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
