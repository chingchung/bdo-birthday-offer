import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // static site export for GitHub Pages
  trailingSlash: true,    // needed for GitHub Pages routing
  images: {
    unoptimized: true,    // next/image optimisation requires a server; disable for static
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "framerusercontent.com" },
    ],
  },
};

export default nextConfig;
