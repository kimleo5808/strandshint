import localFont from "next/font/local";

/**
 * Site-wide fonts, self-hosted (all SIL Open Font License). Loading them
 * through next/font/google broke CI builds at random: for some requests
 * Google serves fonts.gstatic.com/l/font?kit=…&skey=…&v=… URLs, which
 * Turbopack's font loader rejects ("next/font/google queries have exactly
 * one entry"). Self-hosting also takes Google off the build's critical path.
 *
 * Each file is Google's latin subset of the variable font (Outfit v15,
 * Plus Jakarta Sans v12, JetBrains Mono v24), covering the same weight
 * range the Google loader used to request.
 */

export const outfit = localFont({
  src: [{ path: "./outfit-latin.woff2", weight: "400 800", style: "normal" }],
  variable: "--font-heading",
  display: "swap",
});

export const plusJakarta = localFont({
  src: [{ path: "./plus-jakarta-sans-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: [{ path: "./jetbrains-mono-latin.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-mono-code",
  display: "swap",
});
