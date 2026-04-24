import { motion } from "framer-motion";

interface TourosatScoreProps {
  score: number;
  confidence?: number; // 0..1 or 0..100
  size?: "sm" | "md" | "lg" | "xl";
  showSources?: boolean;
}

const getColor = (score: number) => {
  if (score >= 80) return "hsl(var(--score-excellent))";
  if (score >= 60) return "hsl(var(--score-good))";
  if (score >= 40) return "hsl(var(--score-medium))";
  return "hsl(var(--score-low))";
};

const getLabel = (score: number) => {
  if (score >= 80) return "Отлично";
  if (score >= 60) return "Хорошо";
  if (score >= 40) return "Средне";
  return "Низкий";
};

const sizeMap = {
  sm: { box: 72, stroke: 7, font: "text-2xl" },
  md: { box: 120, stroke: 10, font: "text-4xl" },
  lg: { box: 180, stroke: 14, font: "text-6xl" },
  xl: { box: 208, stroke: 16, font: "text-7xl" },
};

export const TourosatScore = ({
  score,
  confidence,
  size = "lg",
  showSources = true,
}: TourosatScoreProps) => {
  const { box, stroke, font } = sizeMap[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, score));
  const offset = circumference - (pct / 100) * circumference;
  const color = getColor(score);

  const confPct =
    confidence == null
      ? null
      : confidence <= 1
      ? Math.round(confidence * 100)
      : Math.round(confidence);

  const isLarge = size === "lg" || size === "xl";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{
          width: box,
          height: box,
          filter: isLarge ? `drop-shadow(0 0 32px ${color}66)` : undefined,
        }}
      >
        {/* Soft outer glow */}
        {isLarge && (
          <>
            <div
              className="absolute inset-0 rounded-full opacity-50 blur-3xl animate-pulse"
              style={{ backgroundColor: color, animationDuration: "3s" }}
            />
            <div
              className="absolute inset-2 rounded-full opacity-30 blur-xl"
              style={{ backgroundColor: color }}
            />
          </>
        )}

        <svg width={box} height={box} className="-rotate-90 relative">
          <defs>
            <linearGradient id={`grad-${size}-${Math.round(score)}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
            opacity={0.5}
          />
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={`url(#grad-${size}-${Math.round(score)})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${font} font-bold leading-none font-display tabular-nums`}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          >
            {Math.round(score)}
          </motion.span>
          {isLarge && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-semibold">
              / 100
            </span>
          )}
        </div>
      </div>

      {isLarge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <div
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              color,
              border: `1px solid ${color}44`,
            }}
          >
            TOUROSAT Score · {getLabel(score)}
          </div>
          {confPct != null && (
            <p className="text-xs text-muted-foreground">
              Confidence:{" "}
              <span className="font-bold text-foreground tabular-nums">{confPct}%</span>
            </p>
          )}
          {showSources && (
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase font-medium">
              Sentinel-2 · SRTM · MODIS
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
