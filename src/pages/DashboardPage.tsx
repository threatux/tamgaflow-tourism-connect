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
    { name: "Тамга", score: 77, transactions: 12, revenue: "54,200 сом", status: "🟢" },
    { name: "Барскоон", score: 72, transactions: 8, revenue: "32,100 сом", status: "🟢" },
    { name: "Каракол", score: 65, transactions: 15, revenue: "48,500 сом", status: "🟡" },
    { name: "Чолпон-Ата", score: 62, transactions: 18, revenue: "62,000 сом", status: "🟡" },
    { name: "Джети-Өгүз", score: 58, transactions: 5, revenue: "18,200 сом", status: "🟡" },
    { name: "Бостери", score: 55, transactions: 10, revenue: "35,400 сом", status: "🟡" },
    { name: "Балыкчы", score: 38, transactions: 2, revenue: "4,800 сом", status: "🔴" },
  ],
  live_feed: [
    { time: "14:23", point: "Тамга", amount: "4,450 сом", tourist: "Marco", country: "Германия" },
    { time: "14:19", point: "Барскоон", amount: "850 сом", tourist: "Sarah", country: "США" },
    { time: "14:15", point: "Каракол", amount: "3,200 сом", tourist: "Tanaka", country: "Япония" },
    { time: "14:08", point: "Тамга", amount: "2,800 сом", tourist: "Алексей", country: "Россия" },
    { time: "13:55", point: "Чолпон-Ата", amount: "1,200 сом", tourist: "Emma", country: "Франция" },
    { time: "13:42", point: "Джети-Өгүз", amount: "5,400 сом", tourist: "Lisa", country: "Германия" },
    { time: "13:30", point: "Бостери", amount: "900 сом", tourist: "Бакыт", country: "Казахстан" },
    { time: "13:15", point: "Тамга", amount: "3,600 сом", tourist: "Pierre", country: "Франция" },
    { time: "13:01", point: "Каракол", amount: "2,100 сом", tourist: "Tom", country: "Англия" },
    { time: "12:48", point: "Барскоон", amount: "1,800 сом", tourist: "Аида", country: "Бишкек" },
  ],
  ai_recommendations: [
    { message: "TOUROSAT AI: точка «Балыкчы» (Score 38) нуждается в поддержке. Рекомендуем грант 50,000 сом на улучшение инфраструктуры для повышения Score до 60+." },
    { message: "TOUROSAT AI: точка «Тамга» (Score 77) показывает лучшие результаты. Рекомендуем как модель для тиражирования на другие Rest Points." },
    { message: "TOUROSAT AI: средний Score по региону: 61/100. Активных точек: 6. Нуждаются в поддержке: 1." },
  ],
};

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

  useEffect(() => {
    fetch("http://localhost:8000/api/tamgaflow/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(MOCK_DASHBOARD as DashboardData));
  }, []);

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

      <div className="bg-muted rounded-lg p-6 space-y-2">
        <h3 className="font-semibold text-foreground">Национальный контекст</h3>
        <p className="text-sm text-muted-foreground">Туризм КР 2025: $1.098 млрд (+8.1%)</p>
        <p className="text-sm text-muted-foreground">Проблема: 95% дохода в 5 местах</p>
        <p className="text-sm text-muted-foreground">TamgaFlow: цифровая монетизация каждого Rest Point</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Топ Rest Points</CardTitle></CardHeader>
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

      <Card>
        <CardHeader><CardTitle>Живой поток</CardTitle></CardHeader>
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
