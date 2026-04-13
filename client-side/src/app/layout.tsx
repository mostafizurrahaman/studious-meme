import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { FloatingCategoryRail } from '@/components/FloatingCategoryRail';
import { Header } from '@/components/Header';
import { MobileToolbar } from '@/components/MobileToolbar';
import { SeoScripts } from '@/components/SeoScripts';
import { siteMetadata, siteSchemas } from '@/lib/seo';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en-US" className={cn('h-full', 'antialiased', poppins.variable, 'font-sans', inter.variable)}>
          <body className="storefront-layout min-h-full flex flex-col bg-background pb-28 text-foreground lg:pb-0">
            <SeoScripts data={siteSchemas} />
            <Header />
            <FloatingCategoryRail />
            {children}
            <Footer />
            <MobileToolbar />
          </body>
        </html>
    );
}
