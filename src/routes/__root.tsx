import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";
import { AppStoreProvider } from "../lib/store";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "../components/ui/sonner";
import { registerServiceWorker } from "../lib/register-sw";
import { PostHogProvider } from "../lib/posthog";
import posthog from "posthog-js";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ location }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "NjiaYangu — Study paths for Form Six leavers in Tanzania" },
      {
        name: "description",
        content:
          "Match your Form Six combination and grades to eligible Tanzanian university programmes, institutions, HESLB guidance and careers.",
      },
      { name: "theme-color", content: "#1e3a8a" },
      { property: "og:site_name", content: "NjiaYangu" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "NjiaYangu — Study paths for Form Six leavers in Tanzania" },
      { property: "og:description", content: "Match your Form Six combination and grades to eligible Tanzanian university programmes, institutions, HESLB guidance and careers." },
      { property: "og:image", content: "https://njiayangu.lovable.app/favicon.svg" },
      { property: "og:url", content: `https://njiayangu.lovable.app${location.pathname}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NjiaYangu" },
      { name: "twitter:description", content: "Match your Form Six combination and grades to eligible Tanzanian university programmes, institutions, HESLB guidance and careers." },
      { name: "twitter:image", content: "https://njiayangu.lovable.app/favicon.svg" },
    ],
    links: [
      { rel: "canonical", href: `https://njiayangu.lovable.app${location.pathname}` },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "NjiaYangu",
          url: "https://njiayangu.lovable.app",
          inLanguage: ["en", "sw"],
          potentialAction: {
            "@type": "SearchAction",
            target: "https://njiayangu.lovable.app/programmes?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NjiaYangu",
          url: "https://njiayangu.lovable.app",
          logo: "https://njiayangu.lovable.app/favicon.svg",
          description:
            "Independent guidance platform helping Tanzanian Form Six leavers find eligible university programmes, HESLB support and careers.",
          areaServed: "TZ",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => { registerServiceWorker(); }, []);

  // Track pageviews in PostHog
  useEffect(() => {
    posthog.capture('$pageview');
  }, [router.state.location.pathname]);

  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AuthProvider>
            <AppStoreProvider>
              <Outlet />
              <Toaster />
            </AppStoreProvider>
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
