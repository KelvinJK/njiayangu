import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/lib/auth";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

// Routes that remain accessible without an account.
const PUBLIC_PATHS = new Set<string>([
  "/",
  "/auth",
  "/about",
  "/contact",
  "/privacy",
  "/security",
  "/terms",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // Allow OAuth/consent and any well-known/system routes
  if (pathname.startsWith("/.lovable")) return true;
  if (pathname.startsWith("/.well-known")) return true;
  if (pathname.startsWith("/.mcp")) return true;
  return false;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = router.state.location.pathname;
  const gated = !isPublicPath(pathname);
  const blocked = gated && !loading && !user;

  useEffect(() => {
    if (blocked) {
      navigate({ to: "/auth", search: { next: pathname } });
    }
  }, [blocked, pathname, navigate]);

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pb-16 md:pb-0">
        {blocked ? null : children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
