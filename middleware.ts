import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const FALLBACK_CANONICAL_HOST = "strandshint.app";

function getCanonicalHost(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) return FALLBACK_CANONICAL_HOST;

  try {
    return new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return FALLBACK_CANONICAL_HOST;
  }
}

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostHeader = request.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const protocol =
    (request.headers.get("x-forwarded-proto") ||
      request.nextUrl.protocol.replace(":", "")).toLowerCase();

  const canonicalHost = getCanonicalHost();
  const isLocalhost = host === "localhost" || host === "127.0.0.1";

  if (!isLocalhost) {
    const needsHttps = protocol === "http";
    const needsCanonicalHost = host !== canonicalHost;

    if (needsHttps || needsCanonicalHost) {
      url.protocol = "https:";
      url.host = canonicalHost;
      return NextResponse.redirect(url, 308);
    }
  }

  if (
    url.pathname === `/${DEFAULT_LOCALE}` ||
    url.pathname.startsWith(`/${DEFAULT_LOCALE}/`)
  ) {
    url.pathname =
      url.pathname === `/${DEFAULT_LOCALE}`
        ? "/"
        : url.pathname.slice(DEFAULT_LOCALE.length + 1);

    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/robots.txt",
    "/sitemap.xml",
    "/(en)/:path*",
    "/((?!api|_next|_vercel|.*\\.|favicon.ico).*)",
  ],
};
