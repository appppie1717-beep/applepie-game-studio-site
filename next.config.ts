import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The public pages are deployed as static assets, so images must resolve to
  // their original files instead of the Worker-backed optimization endpoint.
  images: { unoptimized: true },
};

export default nextConfig;
