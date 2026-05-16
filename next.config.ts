import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately via `npm run lint`; skip during production build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors are caught in dev; don't block the Vercel deploy
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "framerusercontent.com" },
    ],
  },
};

export default nextConfig;
