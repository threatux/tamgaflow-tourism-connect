import { motion } from "framer-motion";

interface TourosatScoreProps {
  score: number;
  confidence?: number; // 0..1 or 0..100
  size?: "sm" | "md" | "lg" | "xl";
  showSources?: boolean;
}

const getColors = (score: number) => {
  if (score >= 80) return { from: "#10B981", to: "#059669", label: "Excellent", text: "hsl(160 84% 39%)" };
  if (score >= 60) return { from: "#0891B2", to: "#0E7490", label: "Strong", text: "hsl(190 91% 36%)" };
  if (score >= 40) return { from: "#F59E0B", to: "#FCD34D", label: "Average", text: "hsl(38 92% 50%)" };
  return { from: "#EF4444", to: "#F87171", label: "Low", text: "hsl(0 84% 60%)" };
};

const sizeMap = {
  sm: { box: 80, stroke: 8, font: "text-2xl" },
  md: { box: 128, stroke: 10, font: "text-4xl" },
  lg: { box: 200, stroke: 14, font: "text-7xl" },
  xl: { box: 220, stroke: 16, font: "text-7xl" },
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
  const c = getColors(score);
  const gradId = `tourosat-grad-${size}-${Math.round(score)}`;
  const glowId = `tourosat-glow-${size}-${Math.round(score)}`;

  const confPct =
    confidence == null
      ? null
      : confidence <= 1
      ? Math.round(confidence * 100)
      : Math.round(confidence);

  const isLarge = size === "lg" || size === "xl";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: box, height: box }}>
        {/* Soft outer glow */}
        {isLarge && (
          <div
            className="absolute inset-0 rounded-full opacity-40 blur-3xl"
            style={{ backgroundColor: c.from }}
          />
        )}

        <svg width={box} height={box} className="-rotate-90 relative">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c.from} />
              <stop offset="100%" stopColor={c.to} />
            </linearGradient>
            {isLarge && (
              <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>
          {/* Track */}
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="hsl(214 32% 91%)"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            filter={isLarge ? `url(#${glowId})` : undefined}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${font} font-extrabold leading-none font-display tabular-nums text-foreground`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 180 }}
          >
            {Math.round(score)}
          </motion.span>
          {isLarge && (
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase mt-2.5"
              style={{ color: c.text }}
            >
              TOUROSAT Score
            </span>
          )}
        </div>
      </div>

      {isLarge && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          {confPct != null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${c.from}14`,
                color: c.text,
                border: `1px solid ${c.from}33`,
              }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: c.from }} />
              Confidence {confPct}%
            </div>
          )}
          {showSources && (
            <p className="text-[10px] text-muted-foreground tracking-[0.18em] uppercase font-semibold">
              Powered by Sentinel-2 · SRTM · MODIS
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
