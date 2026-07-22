import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { CalendarCheck, ExternalLink, ShieldCheck } from "lucide-react";

interface Props {
  source: { title: string; url: string };
  lastVerified: string;
  programmeName: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

export function SourceDialog({ source, lastVerified, programmeName, triggerClassName, triggerLabel }: Props) {
  const { t, lang } = useI18n();
  const dateLabel = new Date(lastVerified).toLocaleDateString(
    lang === "sw" ? "sw-TZ" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={
            triggerClassName ??
            "inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          }
          aria-label={`${t("source.button")}: ${programmeName}`}
        >
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          {triggerLabel ?? t("source.button")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" aria-hidden />
            {t("source.title")}
          </DialogTitle>
          <DialogDescription>{t("source.intro")}</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-3 text-sm">
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t("compare.field.programme")}
            </div>
            <div className="mt-0.5 font-medium">{programmeName}</div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {t("source.title")}
            </div>
            <div className="mt-0.5 font-medium break-words">{source.title}</div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-brand text-xs break-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {source.url}
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
            </a>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              <CalendarCheck className="h-3.5 w-3.5" aria-hidden />
              {t("source.lastVerified")}
            </div>
            <div className="mt-0.5 font-medium">{dateLabel}</div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("source.disclaimer")}
          </p>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-2">
          <Button asChild>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" aria-hidden />
              {t("source.open")}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
