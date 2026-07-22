import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t, lang } = useI18n();
  const isSw = lang === "sw";
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="container-page py-10 grid gap-8 md:grid-cols-5 text-sm">
        <div className="md:col-span-2">
          <div className="font-semibold text-brand text-base">{t("app.name")}</div>
          <p className="mt-2 text-muted-foreground max-w-sm">{t("app.tagline")}</p>
          <p className="mt-3 text-xs text-muted-foreground max-w-sm">
            {isSw
              ? "Jukwaa lisilo rasmi la kuwaongoza wahitimu wa Kidato cha Sita Tanzania."
              : "An independent guidance platform for Tanzanian Form Six leavers."}
          </p>
        </div>

        <div>
          <div className="font-medium mb-2">{isSw ? "Gundua" : "Explore"}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/programmes" className="hover:text-foreground">{t("nav.programmes")}</Link></li>
            <li><Link to="/institutions" className="hover:text-foreground">{t("nav.institutions")}</Link></li>
            <li><Link to="/careers" className="hover:text-foreground">{t("nav.careers")}</Link></li>
            <li><Link to="/scholarships" className="hover:text-foreground">{t("nav.scholarships")}</Link></li>
            <li><Link to="/compare" className="hover:text-foreground">{t("nav.compare")}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">{isSw ? "Jitayarishe" : "Prepare"}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/find-my-courses" className="hover:text-foreground">{t("nav.find")}</Link></li>
            <li><Link to="/heslb" className="hover:text-foreground">{t("nav.heslb")}</Link></li>
            <li><Link to="/calendar" className="hover:text-foreground">{t("nav.calendar")}</Link></li>
            <li><Link to="/resources" className="hover:text-foreground">{t("nav.resources")}</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">{isSw ? "Ingia / Jisajili" : "Sign in / Create account"}</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-medium mb-2">{isSw ? "Kisheria" : "Legal & Trust"}</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">{isSw ? "Sera ya Faragha" : "Privacy Policy"}</Link></li>
            <li><Link to="/security" className="hover:text-foreground">{isSw ? "Usalama" : "Security"}</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">{isSw ? "Masharti" : "Terms of Use"}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page py-4 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-xs text-muted-foreground">
          <p>© {year} {t("app.name")}. {isSw ? "Haki zote zimehifadhiwa." : "All rights reserved."}</p>
          <p className="max-w-2xl md:text-right">{t("disclaimer.short")}</p>
        </div>
      </div>
    </footer>
  );
}
