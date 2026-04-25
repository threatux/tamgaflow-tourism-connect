import { motion } from "framer-motion";
import { Award, Banknote, Sparkles } from "lucide-react";
import { TOP_BY_REVENUE, TOP_BY_SCORE, STRATEGIC_OPPORTUNITIES, fmtCurrency } from "@/mocks/fundData";

const scoreColor = (s: number) => {
  if (s >= 80) return "text-success-deep bg-success/10 border-success/25";
  if (s >= 60) return "text-primary-dark bg-primary/10 border-primary/25";
  if (s >= 40) return "text-gold-deep bg-gold/15 border-gold/30";
  return "text-destructive bg-destructive/10 border-destructive/25";
};

const rankBadge = (i: number) => {
  if (i === 0) return "bg-gradient-to-br from-gold to-gold-deep text-white";
  if (i === 1) return "bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/15 text-foreground";
  if (i === 2) return "bg-gradient-to-br from-gold/40 to-gold-deep/30 text-foreground";
  return "bg-muted text-muted-foreground";
};

interface ListProps {
  title: string;
  subtitle: string;
  icon: typeof Award;
  accent: "teal" | "gold" | "emerald";
  items: { id: string; name: string; region: string; score: number; value: string; valueLabel: string }[];
}

const accentMap = {
  teal: "bg-primary/10 border-primary/25 text-primary-dark",
  gold: "bg-gold/15 border-gold/30 text-gold-deep",
  emerald: "bg-success/10 border-success/25 text-success-deep",
};

const RankingList = ({ title, subtitle, icon: Icon, accent, items }: ListProps) => (
  <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden flex flex-col">
    <div className="p-5 border-b border-border flex items-center gap-3">
      <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center ${accentMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-extrabold font-display text-foreground tracking-tight">{title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="divide-y divide-border/60 flex-1">
      {items.slice(0, 8).map((it, i) => (
        <motion.div
          key={it.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 transition-colors"
        >
          <span
            className={`h-7 w-7 rounded-xl flex items-center justify-center text-[11px] font-extrabold tabular-nums ${rankBadge(i)}`}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-[13px] truncate">{it.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{it.region}</p>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold tabular-nums border ${scoreColor(it.score)}`}
          >
            {it.score}
          </span>
          <div className="text-right w-[110px] shrink-0">
            <p className="text-[12px] font-bold text-foreground tabular-nums">{it.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">{it.valueLabel}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export const RankingsBlock = () => {
  const byRevenue = TOP_BY_REVENUE.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    score: p.tourosatScore,
    value: fmtCurrency(p.seasonRevenue),
    valueLabel: "season",
  }));
  const byScore = TOP_BY_SCORE.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    score: p.tourosatScore,
    value: `${p.confidence}%`,
    valueLabel: "confidence",
  }));
  const strategic = STRATEGIC_OPPORTUNITIES.map((p) => ({
    id: p.id,
    name: p.name,
    region: p.region,
    score: p.tourosatScore,
    value: `NDVI ${p.metrics.ndvi.toFixed(2)}`,
    valueLabel: "potential",
  }));

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <RankingList
        title="Top by Revenue"
        subtitle="Лидеры по обороту сезона"
        icon={Banknote}
        accent="emerald"
        items={byRevenue}
      />
      <RankingList
        title="Top by TOUROSAT Score"
        subtitle="Лучшее качество локации (AI)"
        icon={Award}
        accent="teal"
      items={byScore}
      />
      <RankingList
        title="Strategic Opportunities"
        subtitle="Низкий Score, высокий потенциал"
        icon={Sparkles}
        accent="gold"
        items={strategic}
      />
    </div>
  );
};
