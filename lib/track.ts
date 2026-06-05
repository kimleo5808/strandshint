/**
 * Tiny client-side analytics helper.
 *
 * Fires a GA4 event via the global `gtag` injected by <GoogleAnalytics />.
 * Safe to call anywhere — it no-ops on the server, before gtag loads, or
 * when analytics is blocked.
 */
export function track(action: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag === "function") {
    gtag("event", action, params);
  }
}
