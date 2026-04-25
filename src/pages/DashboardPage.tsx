import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Banknote, MapPin, TrendingUp, Sparkles } from "lucide-react";

const MOCK_DASHBOARD = {
  summary: {
    total_transactions: 47,
    total_revenue_display: "186,400 сом",
    fund_share_display: "22,368 сом",
    rest_points_active: 12,
  },
  top_points: [
    { name: "Тамга", tourism_score: 77, transactions_today: 12, revenue_som: 54200, status: "🟢" },
    { name: "Барскоон", tourism_score: 72, transactions_today: 8, revenue_som: 32100, status: "🟢" },
    { name: "Каракол", tourism_score: 65, transactions_today: 15, revenue_som: 48500, status: "🟡" },
    { name: "Чолпон-Ата", tourism_score: 62, transactions_today: 18, revenue_som: 62000, status: "🟡" },
    { name: "Джети-Өгүз", tourism_score: 58, transactions_today: 5, revenue_som: 18200, status: "🟡" },
    { name: "Бостери", tourism_score: 55, transactions_today: 10, revenue_som: 35400, status: "🟡" },
    { name: "Балыкчы", tourism_score: 38, transactions_today: 2, revenue_som: 4800, status: "🔴" },
  ],
  live_feed: [
    { time: "14:23", point: "Тамга", amount: "4,450 сом", tourist: "Marco", country: "Германия" },
    { time: "14:19", point: "Барскоон", amount: "850 сом", tourist: "Sarah", country: "США" },
    { time: "14:15", point: "Каракол", amount: "3,200 сом", tourist: "Tanaka", country: "Япония" },
    { time: "14:08", point: "Тамга", amount: "2,800 сом", tourist: "Алексей", country: "Россия" },
    { time: "13:55", point: "Чолпон-Ата", amount: "1,200 сом", tourist: "Emma", country: "Франция" },
  ],
  ai_recommendations: [
    { message: "TOUROSAT AI: точка «Балыкчы» (Score 38) нуждается в поддержке." },
    { message: "TOUROSAT AI: точка «Тамга» (Score 77) показывает лучшие результаты." },
    { message: "TOUROSAT AI: средний Score по региону: 61/100." },
  ],
};

interface DashboardData {
  summary: {
    total_transactions: number;
    total_revenue_display: string;
    fund_share_display: string;
    rest_points_active: number;
  };
  top_points: Array<{
    status: string;
    name: string;
    tourism_score: number;
    transactions_today: number;
    revenue_som: number;
  }>;
  live_feed: Array<{
    time: string;
    point: string;
    amount: string;
    tourist: string;
    country: string;
  }>;
  ai_recommendations: Array<{
    message: string;
  }>;
}

const statCards = [
  { key: "total_transactions" as const, label: "Транзакций", icon: Activity, accent: "primary" },
  { key: "total_revenue_display" as const, label: "Общий доход", icon: Banknote, accent: "success" },
  { key: "fund_share_display" as const, label: "Доля платформы (12%)", icon: TrendingUp, accent: "gold" },
  { key: "rest_points_active" as const, label: "Rest Points", icon: MapPin, accent: "primary" },
];

const scoreColor = (score: number) => {
  if (score >= 70) return "hsl(160 84% 39%)";
  if (score >= 50) return "hsl(190 91% 36%)";
  if (score >= 40) return "hsl(38 92% 50%)";
  return "hsl(0 84% 60%)";
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/tamgaflow/dashboard")
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(() => {
        setError("Демо-данные");
        setData(MOCK_DASHBOARD as DashboardData);
      });
  }, []);

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  const liveFeed = data.live_feed || [];
  const topPoints = data.top_points || [];
  const aiRecs = data.ai_recommendations || [];

  return (
    <div className="space-y-12 animate-fade-up max-w-7xl mx-auto">
      {/* Hero header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            Live Dashboard {error && `· ${error}`}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight">
          Дашборд <span className="text-gradient-teal">Фонда</span> туризма КР
        </h1>
        <p className="text-muted-foreground text-base">
          Powered by TOUROSAT AI · Sentinel-2 + SRTM + MODIS
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, accent }, i) => {
          const accentColor =
            accent === "gold"
              ? "hsl(38 92% 50%)"
              : accent === "success"
              ? "hsl(160 84% 39%)"
              : "hsl(190 91% 36%)";
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="group relative rounded-3xl p-6 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium overflow-hidden"
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: accentColor }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}26, ${accentColor}0d)`,
                      border: `1px solid ${accentColor}40`,
                      color: accentColor,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    Live
                  </span>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold font-display text-foreground tabular-nums leading-none tracking-tight">
                  {String(data.summary?.[key] ?? "—")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-2.5 font-bold uppercase tracking-[0.15em]">
                  {label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* National context */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-7 bg-gradient-to-br from-primary/5 via-card to-gold/5 border border-border shadow-[var(--shadow-card)]"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-2xl shrink-0 shadow-md">
            🏔
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-foreground font-display text-lg">Национальный контекст</h3>
            <p className="text-sm text-muted-foreground">Туризм КР 2025: <span className="font-bold text-foreground">$1.098 млрд</span> (+8.1%)</p>
            <p className="text-sm text-muted-foreground">Проблема: <span className="font-bold text-foreground">95% дохода в 5 местах</span></p>
            <p className="text-sm text-muted-foreground">TamgaFlow: цифровая монетизация каждого Rest Point</p>
          </div>
        </div>
      </motion.div>

      {/* Top Points Table */}
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-7 border-b border-border">
          <h2 className="text-2xl font-extrabold font-display text-foreground tracking-tight">Топ Rest Points</h2>
          <p className="text-sm text-muted-foreground mt-1">Ранжирование по TOUROSAT Score</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <th className="py-3 px-6 font-bold">Статус</th>
                <th className="py-3 px-4 font-bold">Название</th>
                <th className="py-3 px-4 font-bold">Score</th>
                <th className="py-3 px-4 font-bold">Транзакций</th>
                <th className="py-3 px-6 font-bold text-right">Доход</th>
              </tr>
            </thead>
            <tbody>
              {topPoints.slice(0, 10).map((p, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/60 last:border-0 hover:bg-accent/40 transition-colors group"
                >
                  <td className="py-4 px-6 text-lg">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-muted/60 group-hover:bg-card group-hover:shadow-sm transition-all">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground tabular-nums w-5">
                        {i + 1}
                      </span>
                      <span className="font-bold text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.tourism_score}%` }}
                          transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${scoreColor(p.tourism_score)}, ${scoreColor(p.tourism_score)}cc)`,
                            boxShadow: `0 0 8px ${scoreColor(p.tourism_score)}55`,
                          }}
                        />
                      </div>
                      <span
                        className="font-extrabold tabular-nums text-base font-display"
                        style={{ color: scoreColor(p.tourism_score) }}
                      >
                        {p.tourism_score}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 tabular-nums font-semibold text-foreground">
                    {p.transactions_today}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-foreground tabular-nums">
                    {typeof p.revenue_som === "number"
                      ? p.revenue_som.toLocaleString("ru-RU") + " сом"
                      : "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Feed */}
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-7 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold font-display text-foreground tracking-tight">Живой поток</h2>
            <p className="text-sm text-muted-foreground mt-1">{liveFeed.length} последних транзакций</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/30">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-success-deep uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {liveFeed.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm text-center">
              Пока нет транзакций. Сделайте оплату на странице Турист.
            </p>
          ) : (
            liveFeed.slice(0, 15).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-5 hover:bg-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs text-muted-foreground w-12 font-mono shrink-0 tabular-nums">
                    {item.time}
                  </span>
                  <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center text-sm font-bold shrink-0 border border-primary/20 shadow-sm">
                    📍
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-background animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{item.point}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.tourist} · {item.country}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-extrabold text-success-deep tabular-nums text-base font-display">
                    +{item.amount}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-bold">
                    Split 88 / 12
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-sm shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-foreground tracking-tight">AI Рекомендации</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {aiRecs.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 bg-card border border-border hover:border-primary/40 hover:shadow-[var(--shadow-card)] transition-premium"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-base shrink-0 border border-primary/15">
                  🤖
                </div>
                <p className="text-sm text-foreground leading-relaxed">{rec.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
