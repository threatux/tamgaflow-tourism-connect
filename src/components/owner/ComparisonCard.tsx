import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Row {
  label: string;
  yours: number;
  market: number;
  unit?: string;
  better: "higher" | "lower";
  formatter?: (n: number) => string;
}

const fmtNum = (n: number) => n.toLocaleString("ru-RU");

interface Props {
  yourScore: number;
  nearbyAvgScore: number;
  yourPrice: number;
  nearbyAvgPrice: number;
  yourVisibility: number;
  nearbyAvgVisibility: number;
}

export const ComparisonCard = (p: Props) => {
  const rows: Row[] = [
    { label: "TOUROSAT Score", yours: p.yourScore, market: p.nearbyAvgScore, better: "higher" },
    { label: "Цена за ночь", yours: p.yourPrice, market: p.nearbyAvgPrice, unit: "сом", better: "higher", formatter: fmtNum },
    { label: "Видимость", yours: p.yourVisibility, market: p.nearbyAvgVisibility, unit: "/100", better: "higher" },
  ];

  return (
    <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
        <h3 className="text-lg font-extrabold font-display text-foreground tracking-tight">
          Сравнение с соседями
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Среди похожих Rest Points в радиусе 25 км
        </p>
      </div>
      <div className="divide-y divide-border">
        {rows.map((r, i) => {
          const diff = r.yours - r.market;
          const diffPct = Math.round((diff / r.market) * 100);
          const isWinning =
            r.better === "higher" ? r.yours > r.market : r.yours < r.market;
          const Icon = diff === 0 ? Minus : isWinning ? TrendingUp : TrendingDown;
          const color = diff === 0
            ? "hsl(215 20% 35%)"
            : isWinning
            ? "hsl(160 84% 39%)"
            : "hsl(0 84% 60%)";
          return (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-5 grid grid-cols-3 gap-4 items-center"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Вы</p>
                <p className="text-xl font-extrabold tabular-nums font-display text-foreground">
                  {r.formatter ? r.formatter(r.yours) : r.yours}
                  {r.unit && <span className="text-xs text-muted-foreground"> {r.unit}</span>}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-extrabold tabular-nums">
                    {diff > 0 ? "+" : ""}{diffPct}%
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Рынок: {r.formatter ? r.formatter(r.market) : r.market}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
