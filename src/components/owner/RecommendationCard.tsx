import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { ImprovementRec } from "@/mocks/ownerData";

const effortLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Низкое усилие", color: "hsl(160 84% 39%)" },
  medium: { label: "Среднее усилие", color: "hsl(38 92% 50%)" },
  high: { label: "Высокое усилие", color: "hsl(0 84% 60%)" },
};

export const OwnerRecommendationCard = ({
  rec,
  index = 0,
}: {
  rec: ImprovementRec;
  index?: number;
}) => {
  const effort = effortLabels[rec.effort];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/30 transition-premium overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/15 transition-colors" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-12 w-12 rounded-2xl bg-accent border border-primary/20 flex items-center justify-center text-2xl shrink-0">
            {rec.icon}
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${effort.color}15`, color: effort.color }}
          >
            {effort.label}
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="font-extrabold text-foreground font-display text-base leading-snug">
            {rec.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{rec.reason}</p>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="flex-1 flex items-center gap-1.5">
            <div className="h-7 px-2 rounded-lg bg-success/10 border border-success/30 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success-deep" />
              <span className="text-xs font-extrabold text-success-deep tabular-nums">
                +{rec.scoreUplift}
              </span>
              <span className="text-[10px] text-success-deep/80 uppercase font-bold tracking-wider">
                Score
              </span>
            </div>
          </div>
          <div className="h-7 px-2.5 rounded-lg bg-gold/10 border border-gold/30 flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-deep">
              Доход
            </span>
            <span className="text-xs font-extrabold text-gold-deep tabular-nums">
              +{rec.revenueUpliftPct}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
