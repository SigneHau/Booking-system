// app/layout.tsx
import './globals.css';
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { theme } from '../lib/theme';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

// Helper til 10-farver tuple (Mantine type)
function colorTuple(color: string | undefined): readonly [string,string,string,string,string,string,string,string,string,string] {
  const c = color ?? "#DADCE0";
  return [c,c,c,c,c,c,c,c,c,c] as const;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={{
            colors: {
              primary: colorTuple(theme.colors.primary),
              secondary: colorTuple(theme.colors.secondary),
              accent: colorTuple(theme.colors.accent),
              gray: colorTuple(theme.colors.gray),
            },
            fontFamily: theme.typography.body.fontFamily,
            headings: {
              fontFamily: theme.typography.heading.fontFamily,
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
