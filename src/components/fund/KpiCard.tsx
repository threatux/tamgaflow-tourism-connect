import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fmtCurrency, fmtDecimal, fmtNumber, type FundKpi } from "@/mocks/fundData";

type Accent = "teal" | "gold" | "emerald" | "ink";

interface Props {
  kpi: FundKpi;
  icon: LucideIcon;
  accent: Accent;
  index: number;
}

const accentMap: Record<Accent, { ring: string; bg: string; text: string; glow: string }> = {
  teal: {
    ring: "border-primary/25",
    bg: "from-primary/12 to-primary/0",
    text: "text-primary-dark",
    glow: "bg-primary/30",
  },
  gold: {
    ring: "border-gold/30",
    bg: "from-gold/15 to-gold/0",
    text: "text-gold-deep",
    glow: "bg-gold/30",
  },
  emerald: {
    ring: "border-success/25",
    bg: "from-success/12 to-success/0",
    text: "text-success-deep",
    glow: "bg-success/30",
  },
  ink: {
    ring: "border-foreground/15",
    bg: "from-foreground/8 to-foreground/0",
    text: "text-foreground",
    glow: "bg-foreground/15",
  },
};

const formatValue = (v: number, format: FundKpi["format"]): string => {
  if (format === "currency") return fmtCurrency(v);
  if (format === "decimal") return fmtDecimal(v);
  return fmtNumber(v);
};

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#spark-${color})`}
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const sparkColorMap: Record<Accent, string> = {
  teal: "hsl(190 91% 36%)",
  gold: "hsl(38 92% 50%)",
  emerald: "hsl(160 84% 39%)",
  ink: "hsl(222 47% 11%)",
};

export const KpiCard = ({ kpi, icon: Icon, accent, index }: Props) => {
  const a = accentMap[accent];
  const positive = kpi.delta >= 0;
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => formatValue(v, kpi.format));
  const [text, setText] = useState(formatValue(0, kpi.format));

  useEffect(() => {
    const controls = animate(mv, kpi.value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      delay: index * 0.07,
    });
    const unsub = display.on("change", (v) => setText(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [kpi.value, kpi.format, index, mv, display]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative rounded-3xl bg-card border border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium overflow-hidden",
      )}
    >
      <div
        className={cn("absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity", a.glow)}
      />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div
            className={cn(
              "h-11 w-11 rounded-2xl flex items-center justify-center bg-gradient-to-br border shadow-sm",
              a.bg,
              a.ring,
              a.text,
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums",
              positive
                ? "bg-success/10 text-success-deep border border-success/20"
                : "bg-destructive/10 text-destructive border border-destructive/20",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(kpi.delta).toFixed(1)}%
          </div>
        </div>

        <p className="text-3xl md:text-[34px] font-extrabold font-display text-foreground tabular-nums leading-none tracking-tight">
          {text}
        </p>

        <p className="text-[11px] text-muted-foreground mt-3 font-bold uppercase tracking-[0.14em]">
          {kpi.label}
        </p>
        <p className="text-[11px] text-muted-foreground/80 mt-1">{kpi.hint}</p>

        <div className="mt-3 -mx-1">
          <Sparkline data={kpi.sparkline} color={sparkColorMap[accent]} />
        </div>
      </div>
    </motion.div>
  );
};
