import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}

