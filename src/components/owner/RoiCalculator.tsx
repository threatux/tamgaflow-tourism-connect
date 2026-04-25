import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  defaultPrice?: number;
}

export const RoiCalculator = ({ defaultPrice = 5500 }: Props) => {
  const [investment, setInvestment] = useState(150000);
  const [price, setPrice] = useState(defaultPrice);
  const [occupancy, setOccupancy] = useState(55);
  const [nightsPerMonth] = useState(30);

  const result = useMemo(() => {
    const grossPerMonth = price * (occupancy / 100) * nightsPerMonth;
    const ownerShare = grossPerMonth * 0.88;
    const monthsToPayback = Math.ceil(investment / ownerShare);
    const seasonProfit = ownerShare * 6 - investment; // 6-month season
    const guestsNeeded = Math.ceil(investment / (price * 0.88));
    return { grossPerMonth, ownerShare, monthsToPayback, seasonProfit, guestsNeeded };
  }, [investment, price, occupancy, nightsPerMonth]);

  return (
    <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-7 border-b border-border bg-gradient-to-br from-accent/40 to-card">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-md">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight">
              ROI / Окупаемость
            </h3>
            <p className="text-xs text-muted-foreground">Сколько вернётся при улучшении точки</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Inputs */}
        <div className="p-7 space-y-6">
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Инвестиции
              </label>
              <span className="text-lg font-extrabold tabular-nums font-display text-foreground">
                {investment.toLocaleString("ru-RU")} <span className="text-xs text-muted-foreground">сом</span>
              </span>
            </div>
            <Slider
              value={[investment]}
              min={50000}
              max={1000000}
              step={10000}
              onValueChange={([v]) => setInvestment(v)}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Цена за ночь
              </label>
              <span className="text-lg font-extrabold tabular-nums font-display text-foreground">
                {price.toLocaleString("ru-RU")} <span className="text-xs text-muted-foreground">сом</span>
              </span>
            </div>
            <Slider
              value={[price]}
              min={1500}
              max={15000}
              step={100}
              onValueChange={([v]) => setPrice(v)}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Заполняемость
              </label>
              <span className="text-lg font-extrabold tabular-nums font-display text-foreground">
                {occupancy}<span className="text-xs text-muted-foreground">%</span>
              </span>
            </div>
            <Slider
              value={[occupancy]}
              min={20}
              max={95}
              step={1}
              onValueChange={([v]) => setOccupancy(v)}
            />
          </div>
        </div>

        {/* Outputs */}
        <div className="p-7 space-y-4 bg-gradient-to-br from-success/5 to-card">
          <motion.div
            key={result.monthsToPayback}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-success-deep to-success p-5 text-white shadow-[var(--shadow-glow-emerald)]"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-90 font-bold">
              Срок окупаемости
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-4xl font-extrabold font-display tabular-nums">{result.monthsToPayback}</p>
              <p className="text-sm font-bold opacity-90">месяцев</p>
            </div>
            <p className="text-xs opacity-85 mt-1.5">При выплате 88% владельцу</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">
                Гостей нужно
              </p>
              <p className="text-2xl font-extrabold font-display tabular-nums text-foreground mt-1">
                {result.guestsNeeded}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">
                Доход / месяц
              </p>
              <p className="text-2xl font-extrabold font-display tabular-nums text-foreground mt-1">
                {Math.round(result.ownerShare / 1000)}K
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl border p-4 flex items-center gap-3 ${
              result.seasonProfit > 0
                ? "bg-success/10 border-success/30"
                : "bg-warning/10 border-warning/40"
            }`}
          >
            <TrendingUp
              className={`h-5 w-5 ${result.seasonProfit > 0 ? "text-success-deep" : "text-warning"}`}
            />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Прибыль за сезон (6 мес)
              </p>
              <p
                className={`text-lg font-extrabold tabular-nums font-display ${
                  result.seasonProfit > 0 ? "text-success-deep" : "text-warning"
                }`}
              >
                {result.seasonProfit > 0 ? "+" : ""}
                {Math.round(result.seasonProfit).toLocaleString("ru-RU")} сом
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
