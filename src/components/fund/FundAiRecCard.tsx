import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtCurrency, type FundAiRec } from "@/mocks/fundData";

const priorityStyle = (p: FundAiRec["priority"]) => {
  switch (p) {
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "Strategic":
      return "bg-gold/15 text-gold-deep border-gold/30";
    case "Medium":
      return "bg-primary/10 text-primary-dark border-primary/25";
  }
};

const tagStyle: Record<FundAiRec["tag"], string> = {
  Infrastructure: "bg-foreground/8 text-foreground border-foreground/15",
  Marketing: "bg-primary/8 text-primary-dark border-primary/20",
  Onboarding: "bg-success/10 text-success-deep border-success/25",
  Partnership: "bg-gold/10 text-gold-deep border-gold/25",
  Quality: "bg-accent text-primary-dark border-primary/20",
};

const scoreColor = (s: number) => {
  if (s >= 80) return "text-success-deep";
  if (s >= 60) return "text-primary-dark";
  if (s >= 40) return "text-gold-deep";
  return "text-destructive";
};

interface Props {
  rec: FundAiRec;
  index: number;
}

export const FundAiRecCard = ({ rec, index }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/70">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] border",
                priorityStyle(rec.priority),
              )}
            >
              {rec.priority === "Strategic" ? "★ Strategic" : `${rec.priority} priority`}
            </span>
            <span
              className={cn(
                "inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] border",
                tagStyle[rec.tag],
              )}
            >
              {rec.tag}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-primary-dark/80 shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]">AI</span>
          </div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-extrabold font-display text-foreground text-lg leading-tight truncate">
              {rec.pointName}
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">{rec.region}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={cn("text-2xl font-extrabold font-display tabular-nums leading-none", scoreColor(rec.score))}>
              {rec.score}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.14em] font-bold">
              TOUROSAT
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3 flex-1">
        <p className="text-[13px] text-muted-foreground leading-relaxed">{rec.insight}</p>
        <div className="rounded-2xl bg-accent/60 border border-primary/15 p-3.5">
          <p className="text-[10px] font-bold text-primary-dark uppercase tracking-[0.14em] mb-1">
            Recommended action
          </p>
          <p className="text-[13px] text-foreground font-semibold leading-snug">{rec.action}</p>
        </div>
      </div>

      {/* Impact */}
      <div className="grid grid-cols-3 border-t border-border/70 bg-muted/30">
        <div className="p-3.5 border-r border-border/70">
          <p className="text-[9px] uppercase tracking-[0.14em] font-bold text-muted-foreground">Score</p>
          <p className="text-base font-extrabold font-display text-success-deep tabular-nums mt-0.5">
            +{rec.potentialUplift.score}
          </p>
        </div>
        <div className="p-3.5 border-r border-border/70">
          <p className="text-[9px] uppercase tracking-[0.14em] font-bold text-muted-foreground">Revenue</p>
          <p className="text-base font-extrabold font-display text-foreground tabular-nums mt-0.5">
            +{fmtCurrency(rec.potentialUplift.revenue)}
          </p>
        </div>
        <div className="p-3.5">
          <p className="text-[9px] uppercase tracking-[0.14em] font-bold text-muted-foreground">Fund</p>
          <p className="text-base font-extrabold font-display text-gold-deep tabular-nums mt-0.5">
            +{fmtCurrency(rec.potentialUplift.fundGain)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 flex items-center justify-between border-t border-border/70">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-success-deep" />
          <span>
            Грант: <span className="font-bold text-foreground">{rec.supportAmount > 0 ? fmtCurrency(rec.supportAmount) : "Без финансирования"}</span>
          </span>
        </div>
        <button className="inline-flex items-center gap-1 text-[12px] font-bold text-primary-dark hover:text-primary transition-colors">
          Подробнее <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
