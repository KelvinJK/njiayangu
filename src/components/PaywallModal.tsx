import { useI18n } from "@/lib/i18n";
import { Lock, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaywallModalProps {
  isOpen: boolean;
  onVerify: () => void;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onVerify, onClose }: PaywallModalProps) {
  const { lang } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-brand" />
            {lang === "en" ? "Limit Reached" : "Kikomo Kimefikiwa"}
          </DialogTitle>
          <DialogDescription>
            {lang === "en"
              ? "You have used your 5 free search attempts. To continue seeing your personalized course matches, please pay a small fee of 500 TZS."
              : "Umetumia majaribio yako 5 ya bure ya kutafuta. Ili kuendelea kuona kozi unazostahili, tafadhali lipia kiasi kidogo cha TZS 500."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="rounded-md bg-accent p-4 text-sm">
            <ol className="list-decimal pl-4 space-y-2">
              <li>{lang === "en" ? "Click the button below to pay via Snippe.me." : "Bofya kitufe hapa chini ili kulipa kupitia Snippe.me."}</li>
              <li>{lang === "en" ? "Complete your 500 TZS payment." : "Kamilisha malipo yako ya TZS 500."}</li>
              <li>{lang === "en" ? "Return here and click 'Verify Payment'." : "Rudi hapa kisha bofya 'Thibitisha Malipo'."}</li>
            </ol>
          </div>

          <a
            href="https://snippe.me/pay/njia-yangu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand text-brand-foreground font-medium w-full shadow-sm hover:opacity-90 transition-opacity"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {lang === "en" ? "Pay Now (500 TZS)" : "Lipa Sasa (TZS 500)"}
          </a>
          
          <button
            onClick={onVerify}
            className="inline-flex h-11 items-center justify-center rounded-md border bg-surface font-medium w-full text-sm hover:bg-accent transition-colors"
          >
            {lang === "en" ? "I have paid (Verify Payment)" : "Nimelipa (Thibitisha Malipo)"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
