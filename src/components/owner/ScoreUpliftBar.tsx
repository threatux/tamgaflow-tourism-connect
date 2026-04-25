import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  current: number;
  potential: number;
  revenueUpliftPct?: number;
}

const colorFor = (s: number) => {
  if (s >= 80) return "hsl(160 84% 39%)";
  if (s >= 60) return "hsl(190 91% 36%)";
  if (s >= 40) return "hsl(38 92% 50%)";
  return "hsl(0 84% 60%)";
};

export const ScoreUpliftBar = ({ current, potential, revenueUpliftPct }: Props) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary/8 via-card to-gold/8 border border-border p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-foreground">
          Потенциал улучшений
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Сейчас
          </p>
          <motion.p
            className="text-4xl font-extrabold font-display tabular-nums"
            style={{ color: colorFor(current) }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {current}
          </motion.p>
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground" />

        <div className="flex-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Потенциал
          </p>
          <motion.p
            className="text-4xl font-extrabold font-display tabular-nums"
            style={{ color: colorFor(potential) }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {potential}
          </motion.p>
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${current}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: colorFor(current) }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${potential - current}%`, left: `${current}%` }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 rounded-full"
          style={{
            background: `repeating-linear-gradient(45deg, ${colorFor(potential)}, ${colorFor(potential)} 4px, ${colorFor(potential)}80 4px, ${colorFor(potential)}80 8px)`,
          }}
        />
      </div>

      {revenueUpliftPct != null && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Возможный рост дохода:{" "}
          <span className="font-extrabold text-success-deep tabular-nums">
            +{revenueUpliftPct}%
          </span>{" "}
          при внедрении всех рекомендаций
        </p>
      )}
    </div>
  );
};
