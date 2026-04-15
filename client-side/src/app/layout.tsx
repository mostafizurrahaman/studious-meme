import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { SeoScripts } from '@/components/SeoScripts';
import { siteMetadata, siteSchemas } from '@/lib/seo';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { Toaster } from 'sonner';
import UserProvider from '@/context/UserContext';

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
        <html
            lang="en-US"
            className={cn('h-full', 'antialiased', poppins.variable, 'font-sans', inter.variable)}
        >
            <body className="storefront-layout min-h-full flex flex-col bg-background text-foreground">
                {/* Example: analytics or tag manager */}
                {/* Use afterInteractive for analytics that can wait until hydration */}
                <Script
                    id="ga"
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
                />

                <Script id="ga-init" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
                </Script>

                {/* If you need a critical polyfill, use beforeInteractive */}
                {/* <Script id="polyfill" strategy="beforeInteractive" src="/polyfills/something.js" /> */}
                <SeoScripts data={siteSchemas} />
                <UserProvider>
                    <Toaster
                        richColors
                        //   position="top-center"
                        toastOptions={{
                            style: {
                                // background: "#2ecc71",
                                border: 'none',
                            },
                        }}
                    />

                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
