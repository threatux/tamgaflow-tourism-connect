import { motion } from "framer-motion";

interface SplitVisualizationProps {
  total: number;
  compact?: boolean;
}

const segments = [
  {
    key: "owner",
    label: "👤 Владельцу",
    pct: 88,
    color: "hsl(var(--split-owner))",
  },
  {
    key: "platform",
    label: "🔧 TamgaFlow",
    pct: 7,
    color: "hsl(var(--split-platform))",
  },
  {
    key: "fund",
    label: "🏛 Фонд КР",
    pct: 5,
    color: "hsl(var(--split-fund))",
  },
];

export const SplitVisualization = ({ total, compact = false }: SplitVisualizationProps) => {
  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Распределение платежа</h3>
          <span className="text-xs text-muted-foreground">88 / 7 / 5</span>
        </div>
      )}

      {/* Stacked bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ width: 0 }}
            animate={{ width: `${s.pct}%` }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
            style={{ backgroundColor: s.color }}
            className="h-full"
          />
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {segments.map((s, i) => {
          const amount = Math.round((total * s.pct) / 100);
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-foreground">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.pct}%</span>
              </div>
              <motion.span
                key={amount}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-semibold text-foreground tabular-nums"
              >
                {amount.toLocaleString("ru-RU")} сом
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
