import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="container-page py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold text-brand">{t("app.name")}</div>
          <p className="mt-2 text-muted-foreground">{t("app.tagline")}</p>
        </div>
        <div>
          <div className="font-medium mb-2">Explore</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/programmes" className="hover:text-foreground">{t("nav.programmes")}</Link></li>
            <li><Link to="/institutions" className="hover:text-foreground">{t("nav.institutions")}</Link></li>
            <li><Link to="/careers" className="hover:text-foreground">{t("nav.careers")}</Link></li>
            <li><Link to="/scholarships" className="hover:text-foreground">{t("nav.scholarships")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Prepare</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/find-my-courses" className="hover:text-foreground">{t("nav.find")}</Link></li>
            <li><Link to="/heslb" className="hover:text-foreground">{t("nav.heslb")}</Link></li>
            <li><Link to="/calendar" className="hover:text-foreground">{t("nav.calendar")}</Link></li>
            <li><Link to="/resources" className="hover:text-foreground">{t("nav.resources")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">About</div>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container-page py-4 text-xs text-muted-foreground">
          {t("disclaimer.short")}
        </div>
      </div>
    </footer>
  );
}
