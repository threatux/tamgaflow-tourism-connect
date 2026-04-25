import type { CulturalTip } from "@/mocks/touristData";

export const CulturalGuideCard = ({ tip }: { tip: CulturalTip }) => (
  <div className="rounded-2xl border border-border bg-card p-4 hover:border-gold/40 hover:shadow-[var(--shadow-soft)] transition-premium">
    <div className="flex items-start gap-3">
      <div className="size-10 shrink-0 rounded-xl bg-gradient-to-br from-gold/20 to-gold-light/30 border border-gold/30 flex items-center justify-center text-lg">
        {tip.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-foreground leading-tight">{tip.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{tip.desc}</p>
      </div>
    </div>
  </div>
);
