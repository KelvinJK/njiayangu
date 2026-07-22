import { Link } from "@tanstack/react-router";
import { Menu, GraduationCap, User, LogIn, Cloud, CloudOff } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", key: "nav.home" },
  { to: "/find-my-courses", key: "nav.find" },
  { to: "/programmes", key: "nav.programmes" },
  { to: "/institutions", key: "nav.institutions" },
  { to: "/careers", key: "nav.careers" },
  { to: "/heslb", key: "nav.heslb" },
  { to: "/scholarships", key: "nav.scholarships" },
  { to: "/calendar", key: "nav.calendar" },
  { to: "/resources", key: "nav.resources" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const { online, syncStatus } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-surface/95 backdrop-blur">
      <div className="container-page flex h-14 items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-brand">
          <GraduationCap className="h-6 w-6" />
          <span>{t("app.name")}</span>
        </Link>

        <nav className="ml-6 hidden lg:flex items-center gap-1 text-sm">
          {links.slice(0, 8).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeProps={{ className: "text-brand font-medium bg-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <span
              title={online ? (syncStatus === "synced" ? t("sync.synced") : t("sync.syncing")) : t("sync.offline")}
              className={cn(
                "hidden md:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                !online ? "bg-muted text-muted-foreground" : syncStatus === "error" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
              )}
            >
              {online ? <Cloud className="h-3 w-3"/> : <CloudOff className="h-3 w-3"/>}
              {!online ? t("sync.offline") : syncStatus === "synced" ? t("sync.synced") : t("sync.syncing")}
            </span>
          )}

          <div className="hidden sm:flex items-center rounded-md border p-0.5 text-xs" aria-label={t("common.language")}>
            <button
              onClick={() => setLang("en")}
              className={cn("px-2 py-1 rounded", lang === "en" ? "bg-brand text-brand-foreground" : "text-muted-foreground")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              onClick={() => setLang("sw")}
              className={cn("px-2 py-1 rounded", lang === "sw" ? "bg-brand text-brand-foreground" : "text-muted-foreground")}
              aria-pressed={lang === "sw"}
            >
              SW
            </button>
          </div>

          {user ? (
            <Link
              to="/account"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted"
              aria-label={t("account.title")}
            >
              <User className="h-3.5 w-3.5"/>
              <span className="max-w-[8ch] truncate">{user.email?.split("@")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-brand text-brand-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90"
            >
              <LogIn className="h-3.5 w-3.5"/>{t("auth.signIn")}
            </Link>
          )}

          <button
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-surface">
          <div className="container-page py-2 grid grid-cols-2 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-sm text-foreground hover:bg-muted"
                activeProps={{ className: "text-brand font-medium bg-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {t(l.key)}
              </Link>
            ))}
            <Link
              to={user ? "/account" : "/auth"}
              onClick={() => setOpen(false)}
              className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand text-brand-foreground px-3 py-2.5 text-sm font-medium"
            >
              {user ? (<><User className="h-4 w-4"/>{t("account.title")}</>) : (<><LogIn className="h-4 w-4"/>{t("auth.signIn")}</>)}
            </Link>
            <div className="col-span-2 mt-2 flex items-center gap-2 border-t pt-2">
              <span className="text-xs text-muted-foreground">{t("common.language")}:</span>
              <button
                onClick={() => setLang("en")}
                className={cn("px-3 py-1.5 text-xs rounded border", lang === "en" && "bg-brand text-brand-foreground border-brand")}
              >
                English
              </button>
              <button
                onClick={() => setLang("sw")}
                className={cn("px-3 py-1.5 text-xs rounded border", lang === "sw" && "bg-brand text-brand-foreground border-brand")}
              >
                Kiswahili
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
