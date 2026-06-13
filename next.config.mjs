/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 92],
    remotePatterns: [
      // Convex storage serves uploaded menu photos.
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), geolocation=(), microphone=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          // Restrictive CORS: defense against Vercel/CDN-level wildcard headers.
          // Clerk popup OAuth uses navigation + postMessage (not CORS).
          // Convex WebSocket client connects to convex.cloud (different origin).
          // No Vary: Origin — fixed single origin, no conditional reflection.
          { key: "Access-Control-Allow-Origin", value: "https://www.indonesiancafe.co.uk" },
        ],
      },
      {
        source: "/images/seo/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig; 
