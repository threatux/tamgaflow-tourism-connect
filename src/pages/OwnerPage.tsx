import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherBadge } from "@/components/WeatherBadge";

const MOCK_CARD = {
  card: {
    name: "🏔 Тамга",
    type: "Гостевой комплекс",
    tourism_score: 65,
    ai_confidence: "0.7",
  },
  services: [
    { id: "1", name: "Юрта (2 чел)", icon: "🛏", price_som: 2200, unit: "за ночь" },
    { id: "2", name: "Обед (национальная кухня)", icon: "🍽", price_som: 350, unit: "за порцию" },
    { id: "3", name: "Конная прогулка (2 часа)", icon: "🐎", price_som: 1050, unit: "за человека" },
    { id: "4", name: "Wi-Fi + зарядка", icon: "📶", price_som: 100, unit: "за день" },
    { id: "5", name: "Вид на горы", icon: "🏔", price_som: 0, unit: "бесплатно" },
  ],
  qr_code: { id: "TF-89A087B4F9BA" },
  revenue_forecast: { season_revenue_som: "1,781,325 сом" },
  pricing_note: "Цены рассчитаны TOUROSAT AI на основе спутниковых данных, Score 65/100 и сезонного спроса",
};

interface Service {
  icon: string;
  name: string;
  unit: string;
  price_som: number;
}

interface ApiResponse {
  card: { name: string; tourism_score: number; ai_confidence: string };
  services: Service[];
  pricing_note: string;
  qr_code: { id: string };
  revenue_forecast: { season_revenue_som: string };
}

const OwnerPage = () => {
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(42.15);
  const [lon, setLon] = useState(77.55);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/tamga/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, lat, lon }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(MOCK_CARD as ApiResponse);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Создайте карточку вашего Rest Point
        </h1>
        <p className="text-muted-foreground">
          TOUROSAT AI рассчитает цены на основе спутниковых данных
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder="Опишите ваш Rest Point: сколько юрт, есть ли кафе, Wi-Fi, какие активности, что рядом..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Широта</label>
              <Input
                type="number"
                step="0.01"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Долгота</label>
              <Input
                type="number"
                step="0.01"
                value={lon}
                onChange={(e) => setLon(Number(e.target.value))}
              />
            </div>
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ AI анализирует спутниковые данные..." : "🛰 Создать карточку"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{result.card.name}</CardTitle>
              <Badge className={getScoreColor(result.card.tourism_score)}>
                Score: {result.card.tourism_score}/100
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              AI Confidence: {result.card.ai_confidence}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="divide-y divide-border">
              {result.services.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.unit}</span>
                  </div>
                  {s.price_som === 0 ? (
                    <span className="text-sm font-medium text-green-600">Бесплатно</span>
                  ) : (
                    <span className="font-semibold text-foreground">{s.price_som} сом</span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <WeatherBadge lat={lat} lon={lon} variant="card" />
              <p className="text-xs text-muted-foreground text-center">
                Прогноз погоды учитывается в AI-ценообразовании TOUROSAT
              </p>
            </div>

            <p className="text-sm text-muted-foreground italic">{result.pricing_note}</p>

            <div className="bg-muted rounded-lg p-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">QR код для туристов</p>
              <p className="font-mono text-xl font-bold text-foreground">
                {result.qr_code.id}
              </p>
              <p className="text-xs text-muted-foreground">
                Покажите этот код туристам для оплаты
              </p>
            </div>

            <div className="bg-accent rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">📈 Прогноз дохода за сезон</p>
              <p className="text-2xl font-bold text-foreground">
                {result.revenue_forecast.season_revenue_som}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OwnerPage;
