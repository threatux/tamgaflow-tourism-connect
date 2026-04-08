import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Summary {
  total_transactions: number;
  total_revenue_display: string;
  fund_share_display: string;
  rest_points_active: number;
}

interface TopPoint {
  status: string;
  name: string;
  score: number;
  transactions: number;
  revenue: string;
}

interface LiveFeedItem {
  time: string;
  point: string;
  amount: string;
  tourist: string;
  country: string;
}

interface AiRec {
  message: string;
}

interface DashboardData {
  summary: Summary;
  top_points: TopPoint[];
  live_feed: LiveFeedItem[];
  ai_recommendations: AiRec[];
}

const statLabels = [
  { key: "total_transactions" as const, label: "Транзакций" },
  { key: "total_revenue_display" as const, label: "Общий доход" },
  { key: "fund_share_display" as const, label: "Доля Фонда" },
  { key: "rest_points_active" as const, label: "Rest Points" },
];

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/tamgaflow/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Не удалось загрузить данные"));
  }, []);

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Дашборд Фонда поддержки туризма КР</h1>
        <p className="text-muted-foreground">Powered by TOUROSAT AI (Sentinel-2 + SRTM + MODIS)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statLabels.map(({ key, label }) => (
          <Card key={key}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {String(data.summary[key])}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* National context */}
      <div className="bg-muted rounded-lg p-6 space-y-2">
        <h3 className="font-semibold text-foreground">Национальный контекст</h3>
        <p className="text-sm text-muted-foreground">Туризм КР 2025: $1.098 млрд (+8.1%)</p>
        <p className="text-sm text-muted-foreground">Проблема: 95% дохода в 5 местах</p>
        <p className="text-sm text-muted-foreground">TamgaFlow: цифровая монетизация каждого Rest Point</p>
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
                {data.top_points.slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4">{p.status}</td>
                    <td className="py-2 pr-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-2 pr-4">{p.score}</td>
                    <td className="py-2 pr-4">{p.transactions}</td>
                    <td className="py-2">{p.revenue}</td>
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
          <CardTitle>Живой поток</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.live_feed.slice(0, 10).map((item, i) => (
              <div key={i} className="flex flex-wrap gap-2 text-sm py-1 border-b border-border last:border-0">
                <span className="text-muted-foreground">{item.time}</span>
                <span className="text-foreground font-medium">{item.point}</span>
                <span className="text-primary font-semibold">{item.amount}</span>
                <span className="text-muted-foreground">{item.tourist} ({item.country})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">AI Рекомендации</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.ai_recommendations.map((rec, i) => (
            <Card key={i}>
              <CardContent className="pt-6 flex gap-3">
                <span className="text-2xl">🤖</span>
                <p className="text-sm text-foreground">{rec.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
