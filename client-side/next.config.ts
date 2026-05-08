import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  !isProduction ? "'unsafe-eval'" : '',
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://static.cloudflareinsights.com',
]
  .filter(Boolean)
  .join(' ');

const csp = `
  default-src 'self';
  script-src ${scriptSrc};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://res.cloudinary.com https://img.youtube.com https://malamal.com.bd;
  font-src 'self' data:;
  connect-src 'self' https://api.malamal.com.bd https://malamal.com.bd https://www.google-analytics.com https://www.googletagmanager.com https://cloudflareinsights.com; 
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${isProduction ? 'upgrade-insecure-requests;' : ''}
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    qualities: [50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'malamal.com.bd',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Set this to 2mb, 5mb, etc.
    },
  },
  // typescript: {
  //     ignoreBuildErrors: true,
  // },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS protection (legacy browsers)
          // { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy (disable unused features)
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          // HSTS (production only)
          ...(isProduction
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;

// import type { NextConfig } from 'next';

// const isProduction = process.env.NODE_ENV === 'production';
// const scriptSrc = [
//   "'self'",
//   "'unsafe-inline'",
//   !isProduction ? "'unsafe-eval'" : '',
//   'https://www.googletagmanager.com',
//   'https://www.google-analytics.com',
// ]
//   .filter(Boolean)
//   .join(' ');

// const csp = `
//   default-src 'self';
//   script-src ${scriptSrc};
//   style-src 'self' 'unsafe-inline';
//   img-src 'self' data: blob: https://res.cloudinary.com https://img.youtube.com https://malamal.com.bd https://i0.wp.com;
//   font-src 'self' data:;
//   connect-src 'self' https://api.malamal.com.bd https://malamal.xyz https://www.google-analytics.com https://www.googletagmanager.com;
//   frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
//   object-src 'none';
//   base-uri 'self';
//   form-action 'self';
//   frame-ancestors 'none';
//   ${isProduction ? 'upgrade-insecure-requests;' : ''}
// `
//   .replace(/\s{2,}/g, ' ')
//   .trim();

// const nextConfig: NextConfig = {
//   /* config options here */
//   distDir: process.env.NEXT_DIST_DIR || '.next',
//   reactStrictMode: true,
//   reactCompiler: true,
//   images: {
//     // The legacy WordPress image host can resolve through a NAT64 address that
//     // Next.js treats as private, even though the hostname is explicitly trusted.
//     dangerouslyAllowLocalIP: true,
//     qualities: [50, 75, 90, 100],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'malamal.com.bd',
//         pathname: '/wp-content/uploads/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'i0.wp.com',
//         pathname: '/malamal.com.bd/wp-content/uploads/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'img.youtube.com',
//         pathname: '/**',
//       },
//     ],
//   },
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '5mb', // Set this to 2mb, 5mb, etc.
//     },
//   },
//   // typescript: {
//   //     ignoreBuildErrors: true,
//   // },
//   async headers() {
//     const isProduction = process.env.NODE_ENV === 'production';

//     return [
//       {
//         source: '/:path*',
//         headers: [
//           // Prevent clickjacking
//           { key: 'X-Frame-Options', value: 'DENY' },
//           // Prevent MIME-type sniffing
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//           // XSS protection (legacy browsers)
//           // { key: 'X-XSS-Protection', value: '1; mode=block' },
//           // Referrer policy
//           {
//             key: 'Referrer-Policy',
//             value: 'strict-origin-when-cross-origin',
//           },
//           // Permissions policy (disable unused features)
//           {
//             key: 'Permissions-Policy',
//             value:
//               'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
//           },
//           {
//             key: 'Content-Security-Policy',
//             value: csp,
//           },
//           // HSTS (production only)
//           ...(isProduction
//             ? [
//                 {
//                   key: 'Strict-Transport-Security',
//                   value: 'max-age=31536000; includeSubDomains; preload',
//                 },
//               ]
//             : []),
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
