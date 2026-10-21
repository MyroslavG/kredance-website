import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/legacy-redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/services/news", destination: "/guides", permanent: true },
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kredance.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
