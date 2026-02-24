import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized:
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES &&
      process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES === "false",
    remotePatterns: [
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              hostname: process.env.R2_PUBLIC_URL.replace("https://", ""),
            },
          ]
        : []),
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // --- Existing redirects ---
      {
        source: "/nyt-strands-hint",
        destination: "/strands-hint",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/how-to-play",
        destination: "/how-to-play-strands",
        permanent: true,
      },
      {
        source: "/strands-hint-archive",
        destination: "/strands-hint",
        permanent: true,
      },

      // --- Old URL structure → New URL structure (GSC indexed pages) ---

      // Core pages
      { source: "/today", destination: "/strands-hint-today", permanent: true },
      { source: "/archive", destination: "/strands-hint", permanent: true },
      { source: "/hints", destination: "/strands-hint", permanent: true },
      { source: "/faq", destination: "/strands-hint-faq", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },

      // Content pages → closest equivalent
      { source: "/strategy", destination: "/how-to-play-strands", permanent: true },
      { source: "/tips", destination: "/how-to-play-strands", permanent: true },
      { source: "/answers", destination: "/strands-hint", permanent: true },

      // Date-based archive pages: /archive/YYYY-MM-DD → /strands-hint/YYYY-MM-DD
      {
        source: "/archive/:date",
        destination: "/strands-hint/:date",
        permanent: true,
      },

      // Locale-prefixed variants (English)
      { source: "/en/today", destination: "/strands-hint-today", permanent: true },
      { source: "/en/archive", destination: "/strands-hint", permanent: true },
      { source: "/en/hints", destination: "/strands-hint", permanent: true },
      { source: "/en/faq", destination: "/strands-hint-faq", permanent: true },
      { source: "/en/answers", destination: "/strands-hint", permanent: true },
      { source: "/en/strategy", destination: "/how-to-play-strands", permanent: true },
      { source: "/en/tips", destination: "/how-to-play-strands", permanent: true },
      {
        source: "/en/archive/:date",
        destination: "/strands-hint/:date",
        permanent: true,
      },

      // --- Spanish locale → English (language dropped) ---
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/hints", destination: "/strands-hint", permanent: true },
      { source: "/es/answers", destination: "/strands-hint", permanent: true },
      { source: "/es/archive", destination: "/strands-hint", permanent: true },
      {
        source: "/es/archive/:date",
        destination: "/strands-hint/:date",
        permanent: true,
      },
      { source: "/es/faq", destination: "/strands-hint-faq", permanent: true },
      { source: "/es/about", destination: "/about", permanent: true },
      { source: "/es/contact", destination: "/contact", permanent: true },
      { source: "/es/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/es/terms", destination: "/terms-of-service", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
