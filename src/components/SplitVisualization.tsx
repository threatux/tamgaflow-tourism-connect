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
        <div className="flex h-6 w-full overflow-hidden rounded-full bg-muted shadow-inner ring-1 ring-border/50">
          {segments.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 1.1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                boxShadow: `inset 0 1px 0 hsl(0 0% 100% / 0.4), inset 0 -2px 4px ${s.color}55`,
              }}
              className="h-full relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.7), transparent)",
                }}
              />
              {s.pct >= 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-sm tabular-nums">
                  {s.pct}%
                </span>
              )}
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
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-[var(--shadow-card)] transition-all"
              style={{
                background: `linear-gradient(135deg, ${s.color}08, transparent)`,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                    border: `1px solid ${s.color}55`,
                    boxShadow: `0 4px 12px ${s.color}22`,
                  }}
                >
                  {s.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{s.label}</p>
                  <p
                    className="text-[11px] font-bold tabular-nums tracking-wider"
                    style={{ color: s.color }}
                  >
                    {s.pct}%
                  </p>
                </div>
              </div>
              <motion.span
                key={amount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-extrabold tabular-nums text-lg shrink-0 font-display"
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
