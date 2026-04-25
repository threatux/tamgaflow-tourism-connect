import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  CalendarCheck,
  Banknote,
  Activity,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Award,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { ComparisonCard } from "@/components/owner/ComparisonCard";
import { getOwnerDashboard, type OwnerDashboardData } from "@/mocks/ownerData";

const KPI_CARDS = [
  { key: "views" as const, label: "Просмотры", icon: Eye, color: "hsl(190 91% 36%)" },
  { key: "saves" as const, label: "В избранном", icon: Heart, color: "hsl(38 92% 50%)" },
  { key: "bookings" as const, label: "Брони", icon: CalendarCheck, color: "hsl(160 84% 39%)" },
  { key: "ownerShare" as const, label: "Ваш доход (88%)", icon: Banknote, color: "hsl(160 84% 39%)" },
];

const OwnerDashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OwnerDashboardData | null>(null);

  useEffect(() => {
    getOwnerDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-32 rounded-3xl bg-muted/50" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-muted/40" />
          ))}
        </div>
        <div className="h-72 rounded-3xl bg-muted/40" />
      </div>
    );
  }

  const { kpi, trend, comparison, recentBookings } = data;
  const maxRevenue = Math.max(...trend.map((t) => t.revenue));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-5">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
              Командный центр
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Мой <span className="text-gradient-teal">Rest Point</span>
          </h1>
          <p className="text-muted-foreground">Аналитика, доход и рекомендации в одном месте</p>
        </div>
        <Button
          onClick={() => navigate("/owner")}
          className="h-12 px-6 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-[var(--shadow-glow-teal)]"
        >
          <Plus className="h-4 w-4" />
          Добавить точку
        </Button>
      </div>

      {/* Hero card: listing summary */}
      <div className="rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)] bg-card">
        <div
          className="grid md:grid-cols-[280px_1fr] gap-0"
          style={{ background: "var(--gradient-surface)" }}
        >
          <div className="p-8 flex items-center justify-center">
            <TourosatScore score={kpi.avgScore} confidence={0.9} size="lg" />
          </div>
          <div className="p-8 space-y-5 border-t md:border-t-0 md:border-l border-border">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Активный листинг
              </p>
              <h2 className="text-2xl font-extrabold font-display text-foreground tracking-tight mt-1">
                Юрточный лагерь «Тамга»
              </h2>
              <p className="text-sm text-muted-foreground">📍 Иссык-Куль · Тонский район</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-card border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Цена
                </p>
                <p className="text-lg font-extrabold tabular-nums font-display text-foreground mt-0.5">
                  {kpi.avgPrice.toLocaleString("ru-RU")}
                </p>
                <p className="text-[10px] text-muted-foreground">сом / ночь</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Конверсия
                </p>
                <p className="text-lg font-extrabold tabular-nums font-display text-foreground mt-0.5">
                  {kpi.conversionPct}%
                </p>
                <p className="text-[10px] text-muted-foreground">view → booking</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Показов
                </p>
                <p className="text-lg font-extrabold tabular-nums font-display text-foreground mt-0.5">
                  {kpi.impressions.toLocaleString("ru-RU")}
                </p>
                <p className="text-[10px] text-muted-foreground">за 30 дней</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Статус
                </p>
                <p className="text-sm font-extrabold font-display text-success-deep mt-1.5 inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Активно
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline" className="rounded-xl">
                Изменить листинг
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl" onClick={() => navigate("/owner")}>
                <Sparkles className="h-3.5 w-3.5" />
                Перезапустить TOUROSAT
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            className="rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium relative overflow-hidden group"
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-15 group-hover:opacity-30 transition-opacity"
              style={{ backgroundColor: c.color }}
            />
            <div className="relative">
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${c.color}26, ${c.color}0d)`,
                  border: `1px solid ${c.color}40`,
                  color: c.color,
                }}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold font-display tabular-nums text-foreground leading-none tracking-tight">
                {c.key === "ownerShare"
                  ? `${Math.round(kpi[c.key] / 1000)}K`
                  : kpi[c.key].toLocaleString("ru-RU")}
              </p>
              <p className="text-[11px] text-muted-foreground mt-2.5 font-bold uppercase tracking-[0.15em]">
                {c.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Earnings + Split */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-br from-success/5 to-card">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                  Доход за неделю
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Динамика бронирований и выручки</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-bold text-success-deep">
                  Ваша доля 88%
                </p>
                <p className="text-2xl font-extrabold tabular-nums font-display text-success-deep">
                  +{Math.round(kpi.ownerShare / 1000)}K сом
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between gap-3 h-44">
              {trend.map((t, i) => (
                <div key={t.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] tabular-nums text-foreground font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(t.revenue / 1000)}K
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(t.revenue / maxRevenue) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-xl"
                      style={{
                        background: "linear-gradient(180deg, hsl(160 84% 39% / 0.95), hsl(160 84% 39% / 0.5))",
                        boxShadow: "0 4px 14px hsl(160 84% 39% / 0.25)",
                      }}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground">{t.day}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
            <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight">
              Раздел дохода
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              С каждой брони · {kpi.avgPrice.toLocaleString("ru-RU")} сом
            </p>
          </div>
          <div className="p-6">
            <SplitVisualization total={kpi.avgPrice} compact />
          </div>
        </div>
      </div>

      {/* Comparison */}
      <ComparisonCard
        yourScore={comparison.yourScore}
        nearbyAvgScore={comparison.nearbyAvgScore}
        yourPrice={comparison.yourPrice}
        nearbyAvgPrice={comparison.nearbyAvgPrice}
        yourVisibility={comparison.yourVisibility}
        nearbyAvgVisibility={comparison.nearbyAvgVisibility}
      />

      {/* Recent bookings */}
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight">
              Последние брони
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Все выплаты в режиме 88/12</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/30">
            <Activity className="h-3 w-3 text-success-deep" />
            <span className="text-xs font-bold text-success-deep uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-5 hover:bg-accent/30 transition-colors"
            >
              <div className="text-xs text-muted-foreground font-mono tabular-nums w-16 shrink-0">
                {b.date}
              </div>
              <div>
                <p className="font-bold text-foreground">{b.guest}</p>
                <p className="text-xs text-muted-foreground">
                  {b.country} · {b.nights} {b.nights === 1 ? "ночь" : "ночей"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {b.gross.toLocaleString("ru-RU")} сом
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Грязный
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold font-display tabular-nums text-success-deep">
                  +{b.payout.toLocaleString("ru-RU")}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-success-deep font-bold">
                  88% вам
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions / improvement banner */}
      <div className="rounded-3xl p-7 text-center text-white relative overflow-hidden shadow-[var(--shadow-premium)]" style={{ background: "var(--gradient-teal)" }}>
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-gold/20 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto space-y-4">
          <Award className="h-8 w-8 mx-auto text-gold-light" />
          <h3 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight">
            Поднимите Score до 90+
          </h3>
          <p className="opacity-90 text-sm">
            TOUROSAT AI нашёл 5 точечных улучшений, которые могут увеличить ваш доход до{" "}
            <span className="font-extrabold">+38%</span>
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/owner")}
            className="rounded-2xl bg-white text-primary-dark hover:bg-white/95 font-extrabold h-12 px-7"
          >
            <TrendingUp className="h-4 w-4" />
            Посмотреть рекомендации
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
