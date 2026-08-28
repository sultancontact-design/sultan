import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages (frontend deployment)
  // API routes require a separate backend (Supabase Edge Functions / VPS / Vercel)
  output: "export",

  // Don't export API routes (they need a Node.js runtime)
  // Next.js will skip them automatically with output: export

  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Empty turbopack config for Next.js 16 compatibility
  turbopack: {},

  // Allow images from external domains
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
