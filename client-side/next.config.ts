import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NEXT_DIST_DIR,
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'malamal.com.bd',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/malamal.com.bd/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
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
};

export default nextConfig;
