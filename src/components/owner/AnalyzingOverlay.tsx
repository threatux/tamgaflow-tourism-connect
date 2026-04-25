import { motion } from "framer-motion";
import { Satellite, Brain, Mountain, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const STAGES = [
  { icon: Satellite, label: "Получаем данные Sentinel-2 со спутника", duration: 700 },
  { icon: Mountain, label: "Анализируем рельеф и SRTM высоты", duration: 600 },
  { icon: Brain, label: "TOUROSAT AI рассчитывает Score", duration: 700 },
  { icon: TrendingUp, label: "Прогнозируем доход на сезон", duration: 600 },
];

export const AnalyzingOverlay = ({ visible }: { visible: boolean }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage(0);
      return;
    }
    let i = 0;
    const advance = () => {
      i += 1;
      if (i < STAGES.length) {
        setStage(i);
        setTimeout(advance, STAGES[i].duration);
      }
    };
    setTimeout(advance, STAGES[0].duration);
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl bg-background/70"
    >
      <div className="relative max-w-md w-full mx-6 rounded-3xl bg-card border border-border shadow-[var(--shadow-premium)] p-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gold/20 blur-3xl animate-pulse" />

        <div className="relative space-y-7">
          {/* Pulsing satellite */}
          <div className="flex justify-center">
            <div className="relative h-24 w-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-gold/40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[var(--shadow-glow-teal)]">
                  <Satellite className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-1.5">
            <h3 className="text-xl font-extrabold font-display text-foreground">
              TOUROSAT AI анализирует
            </h3>
            <p className="text-sm text-muted-foreground">
              Sentinel-2 · SRTM · MODIS · Спрос
            </p>
          </div>

          {/* Stage list */}
          <div className="space-y-2.5">
            {STAGES.map((s, i) => {
              const isDone = i < stage;
              const isActive = i === stage;
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.5, x: -4 }}
                  animate={{
                    opacity: isDone || isActive ? 1 : 0.45,
                    x: 0,
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-premium ${
                    isActive ? "bg-accent border border-primary/30" : "bg-muted/30"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isDone
                        ? "bg-success text-white"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? "✓" : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isDone || isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto inline-flex gap-0.5">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
