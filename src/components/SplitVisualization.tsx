import { motion } from "framer-motion";

interface SplitVisualizationProps {
  total: number;
  compact?: boolean;
}

const segments = [
  {
    key: "owner",
    label: "Rest Point Owner",
    sublabel: "Прямой доход селу",
    icon: "🏠",
    pct: 88,
    gradient: "linear-gradient(135deg, #059669, #10B981)",
    color: "hsl(160 84% 39%)",
    colorHex: "#10B981",
  },
  {
    key: "platform",
    label: "TamgaFlow",
    sublabel: "Инфраструктура и AI",
    icon: "⚡",
    pct: 12,
    gradient: "linear-gradient(135deg, #0E7490, #0891B2)",
    color: "hsl(190 91% 36%)",
    colorHex: "#0891B2",
  },
];

export const SplitVisualization = ({ total, compact = false }: SplitVisualizationProps) => {
  return (
    <div className="space-y-5">
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            <h3 className="text-[11px] font-bold text-foreground uppercase tracking-[0.2em]">
              Распределение платежа
            </h3>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground tracking-[0.15em] uppercase">
            88 / 12 Split
          </span>
        </div>
      )}

      {/* Premium stacked bar */}
      <div className="flex h-16 w-full overflow-hidden rounded-2xl bg-muted/60 ring-1 ring-border/60 gap-0.5 p-0.5">
        {segments.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 1.0, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: s.gradient,
              boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.25), 0 4px 14px ${s.colorHex}40`,
            }}
            className="h-full relative overflow-hidden rounded-[14px] flex items-center justify-between px-4"
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 opacity-30 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.6), transparent)",
                width: "40%",
              }}
            />
            <span className="relative text-white font-extrabold font-display text-lg tabular-nums drop-shadow-sm">
              {s.pct}%
            </span>
            {s.pct >= 30 && (
              <span className="relative text-white/95 font-bold text-xs tabular-nums tracking-wide hidden sm:inline">
                {Math.round((total * s.pct) / 100).toLocaleString("ru-RU")} сом
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Detail rows */}
      <div className="grid grid-cols-1 gap-2.5">
        {segments.map((s, i) => {
          const amount = Math.round((total * s.pct) / 100);
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card/80 backdrop-blur transition-premium hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${s.colorHex}1a, ${s.colorHex}08)`,
                    border: `1px solid ${s.colorHex}33`,
                  }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {s.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                    {s.sublabel}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <motion.div
                  key={amount}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-extrabold font-display text-xl tabular-nums leading-none"
                  style={{ color: s.color }}
                >
                  {amount.toLocaleString("ru-RU")}
                </motion.div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold mt-1">
                  сом · {s.pct}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
