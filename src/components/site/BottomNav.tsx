import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, GitCompare, Bookmark } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useI18n();
  const location = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/find-my-courses", icon: Search, label: t("nav.find") },
    { to: "/compare", icon: GitCompare, label: t("nav.compare") },
    { to: "/saved", icon: Bookmark, label: t("nav.saved") },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-brand" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-brand/20")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
