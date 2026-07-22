import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PROGRAMMES } from "@/data/programmes";
import { CAREERS } from "@/data/careers";

const BASE_URL = "https://njiayangu.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/find-my-courses", changefreq: "monthly", priority: "0.9" },
          { path: "/programmes", changefreq: "weekly", priority: "0.9" },
          { path: "/institutions", changefreq: "monthly", priority: "0.8" },
          { path: "/heslb", changefreq: "weekly", priority: "0.9" },
          { path: "/resources/heslb-portal-guide", changefreq: "monthly", priority: "0.7" },
          { path: "/careers", changefreq: "monthly", priority: "0.7" },
          { path: "/scholarships", changefreq: "monthly", priority: "0.6" },
          { path: "/resources", changefreq: "monthly", priority: "0.5" },
          { path: "/compare", changefreq: "monthly", priority: "0.5" },
          { path: "/about", changefreq: "yearly", priority: "0.4" },
          { path: "/contact", changefreq: "yearly", priority: "0.3" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/security", changefreq: "yearly", priority: "0.3" },
        ];

        const dynamicEntries: SitemapEntry[] = [
          ...PROGRAMMES.map((p) => ({
            path: `/programmes/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...CAREERS.map((c) => ({
            path: `/careers/${c.id}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = [...staticEntries, ...dynamicEntries].map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
