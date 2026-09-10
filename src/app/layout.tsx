import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { Footer } from '@/components/navigation/footer';
import { Navbar } from '@/components/navigation/navbar';
import { ThemeProvider } from '@/components/theme/provider';
import { Toaster } from '@/components/theme/toaster';

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
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth font-sans antialiased`}
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <body className='bg-background text-foreground flex min-h-full flex-col overflow-y-scroll'>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <div id='top' />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Navbar />
          <main className='flex flex-1 flex-col'>{children}</main>
          <Footer />
          <Toaster position='top-center' />
        </ThemeProvider>
      </body>
    </html>
  );
}
