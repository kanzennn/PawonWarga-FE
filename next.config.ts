import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      // PawonWarga-BE's object storage bucket (STORAGE_PUBLIC_BASE_URL) —
      // update this if the bucket/provider changes.
      {
        protocol: "https",
        hostname: "*.is3.cloudhost.id",
      },
    ],
  },
};

export default nextConfig;
