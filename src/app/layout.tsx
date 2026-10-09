import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';

import { layoutMetadata } from '@/constants/metadata';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { KeepScroll } from '@/components/common/keep-scroll';
import { PageWater } from '@/components/common/page-water';
import { Footer } from '@/components/navigation/footer';
import { Navbar, NavbarFallback } from '@/components/navigation/navbar';
import { ThemeProvider } from '@/components/theme/provider';
import { MotionProvider } from '@/components/theme/motion-provider';
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

const uploadthingRouterConfig = extractRouterConfig(ourFileRouter);

export const metadata: Metadata = layoutMetadata;

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
        <KeepScroll />
        <NextSSRPlugin routerConfig={uploadthingRouterConfig} />
        <div id='top' />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <MotionProvider>
            <Suspense fallback={<NavbarFallback />}>
              <Navbar />
            </Suspense>
            <main className='relative isolate flex flex-1 flex-col'>
              <PageWater />
              {children}
            </main>
            <Footer />
            <Toaster position='top-center' />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
