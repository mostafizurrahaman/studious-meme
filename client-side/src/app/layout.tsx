import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileToolbar } from '@/components/MobileToolbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Best Online Hardware Store in Bangladesh | Malamal.com.bd',
  description:
    'Best Online Hardware Store in Bangladesh – Buy tools & hardware for sale online near Dhaka at low prices.',
  metadataBase: new URL('https://malamal.com.bd'),
  openGraph: {
    title: 'Best Online Hardware Store in Bangladesh | Malamal.com.bd',
    description:
      'Best Online Hardware Store in Bangladesh – Buy tools & hardware for sale online near Dhaka at low prices.',
    url: 'https://malamal.com.bd',
    siteName: 'Malamal.com.bd',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white pb-16 text-black lg:pb-0">
        <Header />
        {children}
        <Footer />
        <MobileToolbar />
      </body>
    </html>
  );
}
