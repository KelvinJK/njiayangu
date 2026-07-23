// @lovable.dev/vite-tanstack-config already includes tanstack devtools, tanstackStart,
// viteReact, tailwindcss, tsConfigPaths, nitro, VITE_* env injection, and error-logger plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      mcpPlugin(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        strategies: "generateSW",
        filename: "sw.js",
        manifest: false, // ship our own public/manifest.webmanifest
        devOptions: { enabled: false },
        workbox: {
          navigateFallback: null,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
          navigationPreload: true,
          runtimeCaching: [
            {
              // HTML navigations — network first with short timeout so cached shell
              // serves when offline. Never cache-first for HTML.
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "pages",
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // Same-origin hashed built assets.
              urlPattern: ({ url, request }) =>
                url.origin === self.location.origin &&
                (request.destination === "style" ||
                  request.destination === "script" ||
                  request.destination === "worker" ||
                  request.destination === "font"),
              handler: "CacheFirst",
              options: {
                cacheName: "assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: ({ url, request }) =>
                url.origin === self.location.origin &&
                (request.destination === "image" || /\.(?:png|svg|webp|ico|jpg|jpeg)$/i.test(url.pathname)),
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
