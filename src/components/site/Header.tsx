import { Link } from "@tanstack/react-router";
import { Menu, GraduationCap, User, LogIn, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
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

export function Header() {
  const { t, lang, setLang } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/85 backdrop-blur-md">
      <div className="container-page grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4">
        {/* Left: logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-brand shrink-0"
          onClick={() => setOpen(false)}
        >
          <GraduationCap className="h-5 w-5" />
          <span className="text-[15px] tracking-tight">{t("app.name")}</span>
        </Link>

        {/* Center: primary nav (desktop only) */}
        <nav className="hidden md:flex items-center justify-center gap-1 text-sm">
          {primary.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground bg-muted/70" }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        {/* Right: language + auth + menu */}
        <div className="flex items-center gap-1.5 justify-end">
          <div className="hidden sm:flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
            <button
              onClick={() => setLang("en")}
              className={cn("px-1.5 py-1 rounded transition-colors", lang === "en" && "text-foreground")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <span className="opacity-30">·</span>
            <button
              onClick={() => setLang("sw")}
              className={cn("px-1.5 py-1 rounded transition-colors", lang === "sw" && "text-foreground")}
              aria-pressed={lang === "sw"}
            >
              SW
            </button>
          </div>

          {user ? (
            <Link
              to="/account"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs hover:border-brand hover:text-brand transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[10ch] truncate">{user.email?.split("@")[0]}</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3.5 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <LogIn className="h-3.5 w-3.5" /> {t("auth.signIn")}
            </Link>
          )}

          <button
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/70 hover:bg-muted md:h-9 md:w-9"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile / More sheet */}
      {open && (
        <div className="border-t border-border/60 bg-surface">
          <div className="container-page py-4 space-y-4">
            {/* On mobile show primary too; on md+ the sheet acts as "More" */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2 md:hidden">
                {lang === "en" ? "Explore" : "Chunguza"}
              </div>
              <div className="grid grid-cols-2 gap-1.5 md:hidden">
                {primary.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm hover:bg-muted"
                    activeProps={{ className: "bg-muted text-foreground font-medium" }}
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                {lang === "en" ? "More" : "Zaidi"}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {secondary.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    activeProps={{ className: "bg-muted text-foreground font-medium" }}
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 sm:hidden">
              <Link
                to={user ? "/account" : "/auth"}
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium"
              >
                {user ? (<><User className="h-4 w-4" />{t("account.title")}</>) : (<><LogIn className="h-4 w-4" />{t("auth.signIn")}</>)}
              </Link>
              <div className="inline-flex items-center gap-1 rounded-full border px-2 py-1.5 text-xs">
                <button
                  onClick={() => setLang("en")}
                  className={cn("px-2 py-0.5 rounded-full", lang === "en" ? "bg-foreground text-background" : "text-muted-foreground")}
                >EN</button>
                <button
                  onClick={() => setLang("sw")}
                  className={cn("px-2 py-0.5 rounded-full", lang === "sw" ? "bg-foreground text-background" : "text-muted-foreground")}
                >SW</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
