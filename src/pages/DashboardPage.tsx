import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_DASHBOARD = {
  summary: {
    total_transactions: 47,
    total_revenue_display: "186,400 сом",
    fund_share_display: "9,320 сом",
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

const statLabels = [
  { key: "total_transactions" as const, label: "Транзакций" },
  { key: "total_revenue_display" as const, label: "Общий доход" },
  { key: "fund_share_display" as const, label: "Доля Фонда" },
  { key: "rest_points_active" as const, label: "Rest Points" },
];

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("📡 Fetching dashboard...");
    fetch("http://localhost:8000/api/tamgaflow/dashboard")
      .then((r) => {
        console.log("📡 Response status:", r.status);
        return r.json();
      })
      .then((json) => {
        console.log("📡 Dashboard data:", json);
        console.log("📡 Live feed:", json.live_feed);
        console.log("📡 Live feed length:", json.live_feed?.length);
        setData(json);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError("Используем демо-данные");
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
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Дашборд Фонда поддержки туризма КР
        </h1>
        <p className="text-muted-foreground">
          Powered by TOUROSAT AI (Sentinel-2 + SRTM + MODIS)
        </p>
        {error && <p className="text-sm text-yellow-500">{error}</p>}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statLabels.map(({ key, label }) => (
          <Card key={key}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {String(data.summary?.[key] ?? "—")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* National context */}
      <div className="bg-muted rounded-lg p-6 space-y-2">
        <h3 className="font-semibold text-foreground">Национальный контекст</h3>
        <p className="text-sm text-muted-foreground">
          Туризм КР 2025: $1.098 млрд (+8.1%)
        </p>
        <p className="text-sm text-muted-foreground">
          Проблема: 95% дохода в 5 местах
        </p>
        <p className="text-sm text-muted-foreground">
          TamgaFlow: цифровая монетизация каждого Rest Point
        </p>
      </div>

      {/* Top Points Table */}
      <Card>
        <CardHeader>
          <CardTitle>Топ Rest Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 text-muted-foreground font-medium">Статус</th>
                  <th className="py-2 pr-4 text-muted-foreground font-medium">Название</th>
                  <th className="py-2 pr-4 text-muted-foreground font-medium">Score</th>
                  <th className="py-2 pr-4 text-muted-foreground font-medium">Транзакций</th>
                  <th className="py-2 text-muted-foreground font-medium">Доход</th>
                </tr>
              </thead>
              <tbody>
                {topPoints.slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4">{p.status}</td>
                    <td className="py-2 pr-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-2 pr-4">{p.tourism_score}</td>
                    <td className="py-2 pr-4">{p.transactions_today}</td>
                    <td className="py-2">
                      {typeof p.revenue_som === "number"
                        ? p.revenue_som.toLocaleString() + " сом"
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Живой поток ({liveFeed.length} записей)</CardTitle>
        </CardHeader>
        <CardContent>
          {liveFeed.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Пока нет транзакций. Сделайте оплату на странице Турист.
            </p>
          ) : (
            <div className="space-y-0">
              {liveFeed.slice(0, 15).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-12 font-mono">
                      {item.time}
                    </span>
                    <span className="font-medium text-foreground">
                      {item.point}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">
                      {item.amount}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.tourist} ({item.country})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">AI Рекомендации</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {aiRecs.map((rec, i) => (
            <Card key={i}>
              <CardContent className="pt-6 flex gap-3">
                <span className="text-2xl">🤖</span>
                <p className="text-sm text-foreground">{rec.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        © 2025 TamgaFlow | Team THREATUX | Tourism Revenue Hackathon
      </div>
    </div>
  );
};

export default DashboardPage;
