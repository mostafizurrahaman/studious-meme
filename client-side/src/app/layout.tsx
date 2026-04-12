import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileToolbar } from '@/components/MobileToolbar';
import { SeoScripts } from '@/components/SeoScripts';
import { siteMetadata, siteSchemas } from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = siteMetadata;

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
        <SeoScripts data={siteSchemas} />
        <Header />
        {children}
        <Footer />
        <MobileToolbar />
      </body>
    </html>
  );
}
