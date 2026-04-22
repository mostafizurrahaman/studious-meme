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
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const googleTagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={cn('h-full', 'antialiased', poppins.variable, 'font-sans', inter.variable)}>
      <body className="storefront-layout min-h-full flex flex-col bg-background text-foreground">
        {googleAnalyticsId ? (
          <>
            <Script
              id="ga"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />

            <Script id="ga-init" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
            </Script>
          </>
        ) : null}

        {googleTagManagerId ? (
          <Script id="gtm-init" strategy="afterInteractive">
            {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
          </Script>
        ) : null}

        <SeoScripts data={siteSchemas} />

        {googleTagManagerId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              className="hidden invisible"
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}

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
