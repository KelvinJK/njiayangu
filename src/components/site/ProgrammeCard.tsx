import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, GitCompareArrows, MapPin, Calendar, Clock, Landmark, CheckCircle2, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { INSTITUTIONS } from "@/data/institutions";
import type { EligibilityResult } from "@/lib/eligibility";
import type { Programme } from "@/data/programmes";
import { cn } from "@/lib/utils";

interface Props {
  programme: Programme;
  eligibility?: EligibilityResult;
  preferenceMatch?: number;
}

const statusIcon = {
  ELIGIBLE: CheckCircle2,
  POTENTIALLY_ELIGIBLE: AlertCircle,
  NOT_ELIGIBLE: XCircle,
  INCOMPLETE_INFORMATION: HelpCircle,
};

const statusClass = {
  ELIGIBLE: "badge-eligible",
  POTENTIALLY_ELIGIBLE: "badge-potential",
  NOT_ELIGIBLE: "badge-not",
  INCOMPLETE_INFORMATION: "badge-incomplete",
};

export function ProgrammeCard({ programme, eligibility, preferenceMatch }: Props) {
  const { t, lang } = useI18n();
  const { saved, toggleSaved, compare, toggleCompare } = useStore();
  const institution = INSTITUTIONS.find((i) => i.id === programme.institutionId);
  const campus = institution?.campuses.find((c) => c.id === programme.campusId);
  const isSaved = saved.includes(programme.id);
  const inCompare = compare.includes(programme.id);
  const Icon = eligibility ? statusIcon[eligibility.status] : null;

  return (
    <article className="rounded-xl border bg-card p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-base leading-snug text-foreground">
            {programme.name[lang]}
          </h3>
          <div className="mt-0.5 text-sm text-muted-foreground truncate">
            {institution?.name}
            {campus ? ` • ${campus.name}` : ""}
          </div>
        </div>
        <button
          onClick={() => toggleSaved(programme.id)}
          className="shrink-0 h-9 w-9 rounded-md border flex items-center justify-center text-muted-foreground hover:text-brand hover:border-brand"
          aria-label={isSaved ? t("card.saved") : t("card.save")}
        >
          {isSaved ? <BookmarkCheck className="h-4 w-4 text-brand" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      {(eligibility || preferenceMatch !== undefined) && (
        <div className="flex flex-wrap items-center gap-2">
          {eligibility && Icon && (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusClass[eligibility.status])}>
              <Icon className="h-3.5 w-3.5" />
              {t(`eligibility.${eligibility.status}`)}
            </span>
          )}
          {preferenceMatch !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {t("card.match")}: {preferenceMatch}%
            </span>
          )}
          {programme.heslbEligible && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gold/15 text-gold-foreground border border-gold/30">
              {t("card.heslb")}
            </span>
          )}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {programme.durationYears}y</div>
        <div className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5" /> {campus?.region}</div>
        <div className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5" /> {institution?.type === "public" ? "Public" : "Private"}</div>
        <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(programme.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short" })}</div>
      </dl>

      {eligibility && eligibility.status !== "ELIGIBLE" && (eligibility.failed[0] || eligibility.missing[0]) && (
        <p className="text-xs text-muted-foreground line-clamp-2 border-l-2 border-border pl-2">
          {eligibility.failed[0] ?? eligibility.missing[0]}
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <Link
          to="/programmes/$slug"
          params={{ slug: programme.slug }}
          className="flex-1 inline-flex items-center justify-center px-3 h-10 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:opacity-90"
        >
          {t("card.details")}
        </Link>
        <button
          onClick={() => toggleCompare(programme.id)}
          disabled={!inCompare && compare.length >= 5}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 h-10 rounded-md border text-sm",
            inCompare ? "border-brand text-brand bg-accent" : "text-muted-foreground hover:text-foreground",
            !inCompare && compare.length >= 5 && "opacity-40 cursor-not-allowed",
          )}
        >
          <GitCompareArrows className="h-4 w-4" />
          {t("card.compare")}
        </button>
      </div>

      <div className="text-[10px] text-muted-foreground pt-1 border-t">
        {t("card.verified")}: {new Date(programme.lastVerified).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB")}
      </div>
    </article>
  );
}
