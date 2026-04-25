import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { WeatherBadge } from "@/components/WeatherBadge";
import { TourosatScore } from "@/components/TourosatScore";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { USE_MOCKS, API_BASE_URL } from "@/config";
import { createOwnerListing } from "@/mocks/api";

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
      const data = USE_MOCKS
        ? await createOwnerListing({ description, lat, lon })
        : await fetch(`${API_BASE_URL}/api/tamga/generate-card`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, lat, lon }),
          }).then((r) => r.json());
      setResult(data);
    } catch {
      setResult(MOCK_CARD as ApiResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-up">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <Sparkles className="h-3 w-3 text-primary-dark" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            🏠 Карточка владельца
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
          Создайте карточку <span className="text-gradient-teal">Rest Point</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          TOUROSAT AI рассчитает цены на основе спутниковых данных
        </p>
      </div>

      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] p-7 space-y-5">
        <Textarea
          placeholder="Опишите ваш Rest Point: сколько юрт, есть ли кафе, Wi-Fi, какие активности, что рядом..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-2xl resize-none text-base"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Широта</label>
            <Input
              type="number"
              step="0.01"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Долгота</label>
            <Input
              type="number"
              step="0.01"
              value={lon}
              onChange={(e) => setLon(Number(e.target.value))}
              className="h-12 rounded-xl"
            />
          </div>
        </div>
        <Button
          className="w-full h-14 text-base font-bold rounded-2xl shadow-[var(--shadow-glow-teal)] bg-gradient-to-br from-primary to-primary-dark"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "⏳ AI анализирует спутниковые данные..." : "🛰 Создать карточку"}
        </Button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)] bg-card">
            {/* Hero score */}
            <div
              className="px-6 py-12 flex flex-col items-center text-center gap-4 relative overflow-hidden"
              style={{ background: "var(--gradient-surface)" }}
            >
              <div className="absolute -top-12 -right-12 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-gold/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-extrabold font-display text-foreground mb-8 tracking-tight">{result.card.name}</h2>
                <TourosatScore
                  score={result.card.tourism_score}
                  confidence={parseFloat(result.card.ai_confidence)}
                  size="xl"
                />
              </div>
            </div>

            <div className="p-7 space-y-6">
              <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                {result.services.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5 px-4 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <p className="font-bold text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.unit}</p>
                      </div>
                    </div>
                    {s.price_som === 0 ? (
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">Бесплатно</span>
                    ) : (
                      <span className="font-extrabold text-foreground tabular-nums font-display">
                        {s.price_som.toLocaleString("ru-RU")} <span className="text-xs font-medium text-muted-foreground">сом</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <WeatherBadge lat={lat} lon={lon} variant="card" />
                <p className="text-xs text-muted-foreground text-center italic">
                  Прогноз погоды учитывается в AI-ценообразовании TOUROSAT
                </p>
              </div>

              <p className="text-sm text-muted-foreground italic text-center px-2 leading-relaxed">{result.pricing_note}</p>

              <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center space-y-2 bg-muted/30">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">QR код для туристов</p>
                <p className="font-mono text-2xl font-bold text-foreground tracking-wider">
                  {result.qr_code.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  Покажите этот код туристам для оплаты
                </p>
              </div>

              <div
                className="rounded-2xl p-7 text-center text-primary-foreground relative overflow-hidden shadow-[var(--shadow-premium)]"
                style={{ background: "var(--gradient-emerald)" }}
              >
                <div className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, white 1px, transparent 2px), radial-gradient(circle at 70% 80%, white 1px, transparent 2px)",
                    backgroundSize: "50px 50px",
                  }}
                />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-90 font-bold">📈 Прогноз дохода за сезон</p>
                  <p className="text-4xl md:text-5xl font-extrabold font-display tracking-tight mt-2">
                    {result.revenue_forecast.season_revenue_som}
                  </p>
                  <p className="text-xs opacity-80 mt-2 font-semibold">88% этой суммы — ваш прямой доход</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OwnerPage;
