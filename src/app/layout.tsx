import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/features/theme/providers/theme';

import { Footer } from '@/features/navigation/components/footer';
import { Navbar } from '@/features/navigation/components/navbar';

import { defaultData } from '@/constants/metadata';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = defaultData;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <div className='grid min-h-screen grid-rows-[auto,1fr,auto] bg-background'>
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
