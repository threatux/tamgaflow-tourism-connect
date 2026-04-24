import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherBadge } from "@/components/WeatherBadge";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-2 shadow-[var(--shadow-premium)]">
            {/* Hero score */}
            <div className="bg-gradient-to-br from-accent to-background px-6 py-8 flex flex-col items-center text-center gap-4">
              <h2 className="text-3xl font-bold text-foreground">{result.card.name}</h2>
              <TourosatScore
                score={result.card.tourism_score}
                confidence={parseFloat(result.card.ai_confidence)}
                size="xl"
              />
            </div>

            <CardContent className="space-y-6 pt-6">
              <div className="divide-y divide-border">
                {result.services.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{s.icon}</span>
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.unit}</span>
                    </div>
                    {s.price_som === 0 ? (
                      <span className="text-sm font-medium text-primary">Бесплатно</span>
                    ) : (
                      <span className="font-semibold text-foreground tabular-nums">
                        {s.price_som.toLocaleString("ru-RU")} сом
                      </span>
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

              <div
                className="rounded-lg p-5 text-center text-primary-foreground"
                style={{ background: "var(--gradient-premium)" }}
              >
                <p className="text-sm opacity-90">📈 Прогноз дохода за сезон</p>
                <p className="text-3xl font-bold tracking-tight">
                  {result.revenue_forecast.season_revenue_som}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerPage;
