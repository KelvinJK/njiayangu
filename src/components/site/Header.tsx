import { Link } from "@tanstack/react-router";
import { Menu, GraduationCap, User, LogIn, X, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// Primary nav: only 4 items. Everything else lives in the "More" sheet.
const primary = [
  { to: "/programmes", key: "nav.programmes" },
  { to: "/careers", key: "nav.careers" },
  { to: "/institutions", key: "nav.institutions" },
  { to: "/heslb", key: "nav.heslb" },
] as const;

const secondary = [
  { to: "/find-my-courses", key: "nav.find" },
  { to: "/scholarships", key: "nav.scholarships" },
  { to: "/calendar", key: "nav.calendar" },
  { to: "/resources", key: "nav.resources" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-surface";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const { saved } = useStore();
  const [open, setOpen] = useState(false);

  // Close menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-gradient-to-r from-surface via-surface to-brand/5 backdrop-blur-md supports-[backdrop-filter]:bg-surface/85">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-foreground focus:text-background focus:px-3 focus:py-1.5 focus:text-sm"
      >
        {lang === "en" ? "Skip to main content" : "Ruka hadi maudhui"}
      </a>

      <div className="container-page grid h-14 grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4">
        {/* Left: logo */}
        <Link
          to="/"
          className={cn("flex items-center gap-2 font-semibold text-brand shrink-0 rounded-md px-1 -mx-1", focusRing)}
          onClick={() => setOpen(false)}
          aria-label={`${t("app.name")} — ${lang === "en" ? "home" : "mwanzo"}`}
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-info text-brand-foreground shadow-sm">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-[15px] tracking-tight">{t("app.name")}</span>
        </Link>

        {/* Center: primary nav (desktop only) */}
        <nav
          aria-label={lang === "en" ? "Primary" : "Kuu"}
          className="hidden md:flex items-center justify-center gap-1 text-sm min-w-0"
        >
          {primary.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors",
                focusRing,
              )}
              activeProps={{
                className: "text-brand bg-brand/10 font-medium",
                "aria-current": "page",
              }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        {/* Right: language + auth + menu */}
        <div className="flex items-center gap-1.5 justify-end">
          <div
            className="hidden sm:flex items-center gap-0.5 text-[11px] font-medium rounded-full border border-border/60 bg-surface/70 p-0.5"
            role="group"
            aria-label={t("common.language")}
          >
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-2 py-1 rounded-full transition-colors",
                lang === "en" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground",
                focusRing,
              )}
              aria-pressed={lang === "en"}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => setLang("sw")}
              className={cn(
                "px-2 py-1 rounded-full transition-colors",
                lang === "sw" ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground",
                focusRing,
              )}
              aria-pressed={lang === "sw"}
              aria-label="Kiswahili"
            >
              SW
            </button>
          </div>

          {user && (
            <Link
              to="/saved"
              className={cn(
                "hidden sm:inline-flex relative items-center justify-center h-9 w-9 rounded-full border border-border/70 hover:border-brand hover:text-brand transition-colors",
                focusRing,
              )}
              aria-label={t("saved.viewSaved")}
              activeProps={{ className: "border-brand text-brand bg-brand/10" }}
            >
              <Bookmark className="h-4 w-4" />
              {saved.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gold text-gold-foreground text-[10px] font-bold grid place-items-center">
                  {saved.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <Link
              to="/account"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs hover:border-brand hover:text-brand transition-colors",
                focusRing,
              )}
              activeProps={{ className: "border-brand text-brand bg-brand/10" }}
            >
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[10ch] truncate">{user.email?.split("@")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-info text-brand-foreground px-3.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity shadow-sm",
                focusRing,
              )}
            >
              <LogIn className="h-3.5 w-3.5" /> {t("auth.signIn")}
            </Link>
          )}

          <button
            className={cn(
              "inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/70 hover:bg-muted transition-colors",
              open && "bg-muted",
              focusRing,
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? (lang === "en" ? "Close menu" : "Funga menyu") : (lang === "en" ? "Open menu" : "Fungua menyu")}
            aria-expanded={open}
            aria-controls="site-menu-panel"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile / More sheet */}
      {open && (
        <div
          id="site-menu-panel"
          className="border-t border-border/60 bg-surface animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <nav
            aria-label={lang === "en" ? "Site sections" : "Sehemu za tovuti"}
            className="container-page py-4 space-y-5"
          >
            {/* On mobile show primary too; on md+ the sheet acts as "More" */}
            <div className="md:hidden">
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
                {lang === "en" ? "Explore" : "Chunguza"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {primary.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn("min-h-11 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors flex items-center", focusRing)}
                    activeProps={{
                      className: "bg-brand/10 text-brand font-medium",
                      "aria-current": "page",
                    }}
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
                {lang === "en" ? "More" : "Zaidi"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {secondary.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn("min-h-11 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center", focusRing)}
                    activeProps={{
                      className: "bg-brand/10 text-brand font-medium",
                      "aria-current": "page",
                    }}
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>
            </div>

            {user && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
                  {lang === "en" ? "Your account" : "Akaunti yako"}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/saved"
                    onClick={() => setOpen(false)}
                    className={cn("min-h-11 px-3 py-2.5 rounded-lg text-sm bg-muted/50 hover:bg-muted flex items-center gap-2", focusRing)}
                    activeProps={{ className: "bg-brand/10 text-brand font-medium", "aria-current": "page" }}
                  >
                    <Bookmark className="h-4 w-4"/> {t("saved.title")}
                    {saved.length > 0 && <span className="ml-auto text-[11px] font-semibold text-brand">{saved.length}</span>}
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className={cn("min-h-11 px-3 py-2.5 rounded-lg text-sm bg-muted/50 hover:bg-muted flex items-center gap-2", focusRing)}
                    activeProps={{ className: "bg-brand/10 text-brand font-medium", "aria-current": "page" }}
                  >
                    <User className="h-4 w-4"/> {t("account.title")}
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 sm:hidden">
              <Link
                to={user ? "/account" : "/auth"}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-info text-brand-foreground px-4 py-2.5 text-sm font-medium shadow-sm",
                  focusRing,
                )}
              >
                {user ? (<><User className="h-4 w-4" />{t("account.title")}</>) : (<><LogIn className="h-4 w-4" />{t("auth.signIn")}</>)}
              </Link>
              <div
                className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-surface p-0.5 text-xs"
                role="group"
                aria-label={t("common.language")}
              >
                <button
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={cn("min-h-9 px-3 py-1 rounded-full", lang === "en" ? "bg-brand text-brand-foreground" : "text-muted-foreground", focusRing)}
                >EN</button>
                <button
                  onClick={() => setLang("sw")}
                  aria-pressed={lang === "sw"}
                  className={cn("min-h-9 px-3 py-1 rounded-full", lang === "sw" ? "bg-brand text-brand-foreground" : "text-muted-foreground", focusRing)}
                >SW</button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
