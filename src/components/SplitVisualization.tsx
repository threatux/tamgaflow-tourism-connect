import { motion } from "framer-motion";

interface SplitVisualizationProps {
  total: number;
  compact?: boolean;
}

const segments = [
  {
    key: "owner",
    label: "Владельцу",
    icon: "👤",
    pct: 88,
    color: "hsl(var(--split-owner))",
  },
  {
    key: "platform",
    label: "TamgaFlow",
    icon: "🔧",
    pct: 7,
    color: "hsl(var(--split-platform))",
  },
  {
    key: "fund",
    label: "Фонд КР",
    icon: "🏛",
    pct: 5,
    color: "hsl(var(--split-fund))",
  },
];

export const SplitVisualization = ({ total, compact = false }: SplitVisualizationProps) => {
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Распределение платежа
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground tracking-wider px-2 py-0.5 rounded-full bg-muted">
            88 / 7 / 5
          </span>
        </div>
      )}

      {/* Stacked bar with shimmer */}
      <div className="relative">
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted shadow-inner">
          {segments.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.3)`,
              }}
              className="h-full relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.6), transparent)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {segments.map((s, i) => {
          const amount = Math.round((total * s.pct) / 100);
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                    border: `1px solid ${s.color}55`,
                  }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{s.label}</p>
                  <p className="text-[11px] text-muted-foreground font-medium tabular-nums">
                    {s.pct}%
                  </p>
                </div>
              </div>
              <motion.span
                key={amount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-foreground tabular-nums text-base shrink-0"
                style={{ color: s.color }}
              >
                {amount.toLocaleString("ru-RU")}{" "}
                <span className="text-xs font-medium text-muted-foreground">сом</span>
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
