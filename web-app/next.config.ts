import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server (including HMR's WebSocket) be reached from a
  // phone via the laptop's LAN IP or an ngrok tunnel — Next.js blocks
  // cross-origin dev requests by default as a security measure. This is
  // dev-only; it has no effect on a production build. ngrok free-tier URLs
  // change on every restart, so this hostname will need updating then too.
  allowedDevOrigins: ["10.117.113.125", "730a-50-145-71-202.ngrok-free.app"],
};

export default nextConfig;
