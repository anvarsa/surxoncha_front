/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Faqat ishlatilgan lucide-react ikonkalari bundle'ga qo'shiladi —
  // butun kutubxona emas (spec 37-band: "minimal JavaScript").
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 768, 828, 1024, 1280, 1536],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.STRAPI_MEDIA_HOSTNAME || "localhost",
      },
      {
        protocol: "https",
        hostname: process.env.STORAGE_PUBLIC_HOSTNAME || "localhost",
      },
      {
        // Local development uchun (STRAPI_URL odatda http://localhost:1337)
        protocol: "http",
        hostname: "localhost",
        port: "1337",
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
        ],
      },
      {
        // Next.js optimallashtirgan rasmlar o'zgarmas — brauzer/CDN uzoq muddat keshlashi mumkin.
        source: "/_next/image(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

module.exports = nextConfig;
