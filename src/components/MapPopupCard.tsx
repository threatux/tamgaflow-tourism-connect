import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TourosatScore } from "@/components/TourosatScore";
import type { MockRestPoint } from "@/mocks/restPoints";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";

interface MapPopupCardProps {
  point: MockRestPoint;
  onPay: () => void;
  onDetails: () => void;
}

const accessLabel: Record<MockRestPoint["metrics"]["roadAccess"], string> = {
  Good: "Хороший",
  Average: "Средний",
  Hard: "Сложный",
};

const viewpointLabel: Record<MockRestPoint["metrics"]["viewpoint"], string> = {
  Excellent: "Отличный",
  Good: "Хороший",
  Average: "Средний",
};

const Metric = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <div className="rounded-xl bg-secondary border border-border px-3 py-2.5 transition-premium hover:border-primary/40 hover:shadow-[0_4px_14px_-6px_hsl(190_91%_36%/0.35)]">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
      <span className="text-sm leading-none">{icon}</span>
      <span>{label}</span>
    </div>
    <div className="text-sm font-extrabold text-foreground font-display tabular-nums mt-0.5">
      {value}
    </div>
  </div>
);

export const MapPopupCard = ({ point, onPay, onDetails }: MapPopupCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-[360px] rounded-3xl overflow-hidden border border-border/80 bg-card/95 backdrop-blur-xl shadow-[var(--shadow-premium)]"
      style={{ fontFamily: "Inter, Manrope, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[19px] font-extrabold font-display text-foreground tracking-tight leading-tight truncate">
            {point.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-[12px] text-muted-foreground">
            <MapPin className="size-3" />
            <span className="truncate">{point.region}</span>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent border border-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary-dark">
          <Sparkles className="size-2.5" />
          Verified
        </span>
      </div>

      {/* Score */}
      <div className="px-5 pb-3 flex justify-center">
        <TourosatScore
          score={point.tourosatScore}
          confidence={point.confidence}
          size="md"
          showSources={false}
        />
      </div>

      {/* Description */}
      <p className="px-5 text-[13px] leading-relaxed text-slate-600 line-clamp-3">
        {point.description}
      </p>

      {/* Metrics */}
      <div className="px-5 pt-4 grid grid-cols-2 gap-2">
        <Metric icon="🌿" label="NDVI" value={point.metrics.ndvi.toFixed(2)} />
        <Metric icon="💧" label="До озера" value={point.metrics.distanceToLake} />
        <Metric icon="🛣" label="Дорога" value={accessLabel[point.metrics.roadAccess]} />
        <Metric icon="🏕" label="Конкуренты" value={`${point.metrics.competitors} рядом`} />
        <Metric icon="🏔" label="Виды" value={viewpointLabel[point.metrics.viewpoint]} />
        <Metric
          icon={point.weather.icon}
          label="Погода"
          value={`${point.weather.temp}° · ${point.weather.condition}`}
        />
      </div>

      {/* Recommended price */}
      <div className="mx-5 mt-4 rounded-2xl border border-border bg-gradient-to-br from-secondary to-card px-4 py-3 flex items-center gap-3">
        <div
          className="size-9 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ background: "var(--gradient-gold)" }}
        >
          ✨
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[22px] font-extrabold font-display text-foreground leading-none tabular-nums tracking-tight">
            {point.recommendedPrice.toLocaleString("ru-RU")}{" "}
            <span className="text-sm font-medium text-muted-foreground">сом / ночь</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Цена рекомендована TOUROSAT AI
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="p-5 pt-4 grid grid-cols-2 gap-2.5">
        <Button
          variant="outline"
          className="h-11 rounded-2xl font-semibold border-border bg-card hover:bg-secondary"
          onClick={onDetails}
        >
          Подробнее
        </Button>
        <Button
          className="h-11 rounded-2xl font-bold bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-[var(--shadow-glow-teal)] hover:opacity-95 transition-premium"
          onClick={onPay}
        >
          К оплате
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </motion.div>
  );
};
