import type { NextConfig } from "next";
import dns from "node:dns";
import { Agent, setGlobalDispatcher } from "undici";

dns.setDefaultResultOrder("ipv4first");

setGlobalDispatcher(
  new Agent({
    connectTimeout: 60_000,
    headersTimeout: 60_000,
    bodyTimeout: 60_000,
  }),
);
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
      },
    ],
  },
};

export default nextConfig;
