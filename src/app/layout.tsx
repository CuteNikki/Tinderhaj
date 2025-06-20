import { Geist, Geist_Mono } from 'next/font/google';

import { layoutMetadata } from '@/constants/metadata';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = layoutMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overflow-y-scroll font-sans antialiased`}>
        <div id='top' />
        <Toaster richColors />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
