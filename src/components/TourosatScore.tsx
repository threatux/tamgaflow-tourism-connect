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
  sm: { box: 64, stroke: 6, font: "text-xl" },
  md: { box: 96, stroke: 8, font: "text-3xl" },
  lg: { box: 140, stroke: 10, font: "text-5xl" },
  xl: { box: 160, stroke: 12, font: "text-6xl" },
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${font} font-bold leading-none`}
            style={{ color }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {Math.round(score)}
          </motion.span>
          {(size === "lg" || size === "xl") && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              / 100
            </span>
          )}
        </div>
      </div>

      {(size === "lg" || size === "xl") && (
        <>
          <div
            className="px-3 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${color}1A`, color }}
          >
            TOUROSAT Score · {getLabel(score)}
          </div>
          {confPct != null && (
            <p className="text-xs text-muted-foreground">
              Confidence: <span className="font-semibold text-foreground">{confPct}%</span>
            </p>
          )}
          {showSources && (
            <p className="text-[10px] text-muted-foreground tracking-wide">
              Powered by Sentinel-2 + SRTM + MODIS
            </p>
          )}
        </>
      )}
    </div>
  );
};
