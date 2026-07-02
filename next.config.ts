import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.exercisedb.dev",
        pathname: "/media/**",
      },
    ],
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  sw: "/sw.js",
  cacheStartUrl: true,
  dynamicStartUrl: true,
  dynamicStartUrlRedirect: "/onboarding",
})(nextConfig);
