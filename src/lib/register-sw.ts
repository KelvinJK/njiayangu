// Guarded service-worker registration for Lovable.
// Registers only in the published production app, never in previews, dev, or iframes.
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  try {
    if (window.self !== window.top) return; // iframe (Lovable editor)
  } catch { return; }

  const host = window.location.hostname;
  const previewHosts = [
    (h: string) => h.startsWith("id-preview--"),
    (h: string) => h.startsWith("preview--"),
    (h: string) => h === "lovableproject.com" || h.endsWith(".lovableproject.com"),
    (h: string) => h === "lovableproject-dev.com" || h.endsWith(".lovableproject-dev.com"),
    (h: string) => h === "beta.lovable.dev" || h.endsWith(".beta.lovable.dev"),
  ];
  const isPreview = previewHosts.some((fn) => fn(host));

  const swOff = new URL(window.location.href).searchParams.get("sw") === "off";

  if (isPreview || swOff) {
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const r of regs) {
        if (r.active?.scriptURL?.endsWith("/sw.js")) r.unregister();
      }
    });
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
