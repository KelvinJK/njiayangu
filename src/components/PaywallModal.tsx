import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Lock, CreditCard, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore, PAYMENT_AMOUNT_TZS, GENERATIONS_PER_PAYMENT } from "@/lib/store";

interface PaywallModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onClose: () => void;
  /** true = user has finished their 5 generations and must top up again. */
  outOfCredits?: boolean;
}

export function PaywallModal({ isOpen, onVerified, onClose, outOfCredits }: PaywallModalProps) {
  const { lang } = useI18n();
  const { redeemPayment } = useStore();
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const priceLabel = `${PAYMENT_AMOUNT_TZS.toLocaleString()} TZS`;

  const handleVerify = () => {
    setError(null);
    setBusy(true);
    const result = redeemPayment(reference);
    setBusy(false);
    if (!result.ok) {
      setError(
        lang === "en"
          ? result.reason
          : result.reason === "This reference has already been used."
            ? "Rejea hii tayari imetumika."
            : "Weka rejea sahihi ya malipo (angalau herufi 4).",
      );
      return;
    }
    setReference("");
    onVerified();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-brand" />
            {outOfCredits
              ? lang === "en"
                ? "Top up to continue"
                : "Ongeza malipo kuendelea"
              : lang === "en"
                ? "Unlock your results"
                : "Fungua matokeo yako"}
          </DialogTitle>
          <DialogDescription>
            {outOfCredits
              ? lang === "en"
                ? `You have used all ${GENERATIONS_PER_PAYMENT} generations from your last payment. Pay ${priceLabel} to unlock ${GENERATIONS_PER_PAYMENT} more.`
                : `Umetumia migao yote ${GENERATIONS_PER_PAYMENT} kutoka malipo yako ya mwisho. Lipa ${priceLabel} kupata ${GENERATIONS_PER_PAYMENT} zaidi.`
              : lang === "en"
                ? `Pay a one-time fee of ${priceLabel} via Snippe to unlock ${GENERATIONS_PER_PAYMENT} personalized programme-match generations.`
                : `Lipa ${priceLabel} mara moja kupitia Snippe kufungua migao ${GENERATIONS_PER_PAYMENT} ya kozi zinazokufaa.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="rounded-md bg-accent p-4 text-sm">
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>
                {lang === "en"
                  ? "Tap the button below to pay via Snippe.me."
                  : "Bofya kitufe hapa chini ili kulipa kupitia Snippe.me."}
              </li>
              <li>
                {lang === "en"
                  ? `Complete your ${priceLabel} payment.`
                  : `Kamilisha malipo yako ya ${priceLabel}.`}
              </li>
              <li>
                {lang === "en"
                  ? "Copy the Snippe transaction reference and paste it below."
                  : "Nakili rejea ya muamala wa Snippe kisha bandika hapa chini."}
              </li>
            </ol>
          </div>

          <a
            href="https://snippe.me/pay/njia-yangu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand text-brand-foreground font-medium w-full shadow-sm hover:opacity-90 transition-opacity"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {lang === "en" ? `Pay Now (${priceLabel})` : `Lipa Sasa (${priceLabel})`}
          </a>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="snippe-ref" className="text-sm font-medium">
              {lang === "en" ? "Snippe payment reference" : "Rejea ya malipo ya Snippe"}
            </label>
            <input
              id="snippe-ref"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                if (error) setError(null);
              }}
              placeholder={lang === "en" ? "e.g. SNP-8FJK21" : "mfano: SNP-8FJK21"}
              className="w-full h-11 px-3 rounded-md border bg-surface text-base sm:text-sm font-mono"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              {lang === "en"
                ? "You'll find this on your Snippe receipt or confirmation SMS."
                : "Utaipata kwenye risiti ya Snippe au ujumbe wa uthibitisho."}
            </p>
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
          </div>

          <button
            onClick={handleVerify}
            disabled={busy || reference.trim().length < 4}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-surface font-medium w-full text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            {lang === "en" ? "Verify & unlock" : "Thibitisha na fungua"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
