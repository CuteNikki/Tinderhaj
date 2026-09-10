import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';
import { ThemeProvider } from '@/components/theme/provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tinderhaj | Meet your plush match',
  description: 'A warm, weird little corner of the internet for Blåhaj looking for their person.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className='flex min-h-full flex-col'>
        <div id='top' />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Navbar />
          <main className='flex flex-1 flex-col'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
