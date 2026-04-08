import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Service {
  icon: string;
  name: string;
  unit: string;
  price_som: number;
}

interface CardData {
  name: string;
  tourism_score: number;
  ai_confidence: string;
}

interface ApiResponse {
  card: CardData;
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
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/tamga/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, lat, lon }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-success text-success-foreground";
    if (score >= 50) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Создайте карточку вашего Rest Point</h1>
        <p className="text-muted-foreground">TOUROSAT AI рассчитает цены на основе спутниковых данных</p>
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
              <Input type="number" step="0.01" value={lat} onChange={(e) => setLat(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Долгота</label>
              <Input type="number" step="0.01" value={lon} onChange={(e) => setLon(Number(e.target.value))} />
            </div>
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Создание..." : "Создать карточку"}
          </Button>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
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
            <p className="text-sm text-muted-foreground">AI Confidence: {result.card.ai_confidence}</p>
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
                    <span className="text-sm font-medium text-primary">Бесплатно</span>
                  ) : (
                    <span className="font-semibold text-foreground">{s.price_som} сом</span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">{result.pricing_note}</p>

            <div className="bg-muted rounded-lg p-4 text-center space-y-1">
              <p className="font-mono text-xl font-bold text-foreground">{result.qr_code.id}</p>
              <p className="text-sm text-muted-foreground">Покажите этот код туристам</p>
            </div>

            <div className="bg-accent rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Прогноз дохода</p>
              <p className="text-xl font-bold text-foreground">{result.revenue_forecast.season_revenue_som}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OwnerPage;
