import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherBadge } from "@/components/WeatherBadge";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ServiceItem {
  icon: string;
  name: string;
  price_som: number;
  checked: boolean;
}

interface Split {
  owner: { amount_som: number };
  platform: { amount_som: number };
  fund: { amount_som: number };
}

interface PaymentResult {
  total_som: number;
  services: { icon: string; name: string; price_som: number }[];
  split: Split;
  message: string;
  point_name?: string;
}

const REST_POINTS = [
  { name: "Тамга", score: 65, emoji: "🏔", lat: 42.15, lon: 77.55 },
  { name: "Барскоон", score: 60, emoji: "🏔", lat: 42.12, lon: 77.62 },
  { name: "Джети-Өгүз", score: 57, emoji: "🌲", lat: 42.33, lon: 78.23 },
  { name: "Григорьевка", score: 63, emoji: "🏖", lat: 42.69, lon: 77.45 },
  { name: "Тамга-Юг", score: 63, emoji: "🏔", lat: 42.13, lon: 77.56 },
  { name: "Чолпон-Ата", score: 60, emoji: "🏖", lat: 42.64, lon: 77.08 },
  { name: "Каракол", score: 68, emoji: "🏔", lat: 42.49, lon: 78.39 },
  { name: "Семёновка", score: 57, emoji: "🌲", lat: 42.74, lon: 77.36 },
  { name: "Алтын-Арашан", score: 47, emoji: "♨️", lat: 42.41, lon: 78.65 },
  { name: "Ак-Суу", score: 63, emoji: "💧", lat: 42.45, lon: 78.55 },
  { name: "Кара-Ой", score: 59, emoji: "🏖", lat: 42.66, lon: 77.20 },
  { name: "Тон", score: 53, emoji: "🏔", lat: 42.10, lon: 77.00 },
  { name: "Сон-Куль", score: 31, emoji: "🏕", lat: 41.85, lon: 75.13 },
  { name: "Аныракай", score: 37, emoji: "🏜", lat: 42.20, lon: 76.40 },
  { name: "Балыкчы", score: 27, emoji: "🌊", lat: 42.46, lon: 76.19 },
  { name: "Кызыл-Суу", score: 61, emoji: "🏔", lat: 42.34, lon: 78.00 },
  { name: "Чон-Кызыл-Суу", score: 54, emoji: "🏔", lat: 42.30, lon: 77.95 },
];

const initialServices: ServiceItem[] = [
  { icon: "🛏", name: "Юрта (2 чел)", price_som: 2800, checked: false },
  { icon: "🍽", name: "Обед (национальная кухня)", price_som: 450, checked: false },
  { icon: "🐎", name: "Конная прогулка (2 часа)", price_som: 1200, checked: false },
  { icon: "📶", name: "Wi-Fi + зарядка", price_som: 100, checked: false },
  { icon: "📸", name: "Фототур с гидом", price_som: 2000, checked: false },
];

const TouristPage = () => {
  const [searchParams] = useSearchParams();
  const initialPoint = searchParams.get("point");
  const [selectedPoint, setSelectedPoint] = useState(
    initialPoint && REST_POINTS.some((p) => p.name === initialPoint)
      ? initialPoint
      : "Тамга"
  );

  useEffect(() => {
    const p = searchParams.get("point");
    if (p && REST_POINTS.some((r) => r.name === p)) setSelectedPoint(p);
  }, [searchParams]);

  const [services, setServices] = useState(initialServices);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");

  const total = services.filter((s) => s.checked).reduce((sum, s) => sum + s.price_som, 0);
  const currentPoint = REST_POINTS.find((p) => p.name === selectedPoint);

  const toggleService = (index: number) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, checked: !s.checked } : s)));
  };

  const fireConfetti = () => {
    const primary = "#00A651";
    const gold = "#F5B700";
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: [primary, gold, "#3B82F6", "#ffffff"],
    });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          spread: 100,
          angle: 60,
          origin: { x: 0, y: 0.6 },
          colors: [primary, gold],
        }),
      200
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          spread: 100,
          angle: 120,
          origin: { x: 1, y: 0.6 },
          colors: [primary, gold],
        }),
      400
    );
  };

  const handlePay = async () => {
    const selected = services.filter((s) => s.checked);
    if (!selected.length) return;
    if (!name.trim()) { setError("Введите имя"); return; }
    if (!country.trim()) { setError("Введите страну"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/tamga/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          point_name: selectedPoint,
          services: selected.map(({ name, icon, price_som }) => ({ name, icon, price_som })),
          tourist_name: name,
          tourist_country: country,
        }),
      });
      const data = await res.json();
      setReceipt({ ...data, point_name: selectedPoint });
      fireConfetti();
    } catch {
      setReceipt({
        total_som: total,
        services: selected.map(({ icon, name, price_som }) => ({ icon, name, price_som })),
        split: {
          owner: { amount_som: Math.round(total * 0.88) },
          platform: { amount_som: Math.round(total * 0.07) },
          fund: { amount_som: Math.round(total * 0.05) },
        },
        message: `✅ Спасибо, ${name}! Вы поддержали село и туризм Кыргызстана.`,
        point_name: selectedPoint,
      });
      fireConfetti();
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <Card className="overflow-hidden border-2 shadow-[var(--shadow-premium)]">
          <div
            className="px-6 py-8 text-center text-primary-foreground"
            style={{ background: "var(--gradient-premium)" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="text-7xl mb-2"
            >
              ✅
            </motion.div>
            <h2 className="text-2xl font-bold">Оплата прошла!</h2>
            <p className="text-sm opacity-90 mt-1">📍 {receipt.point_name}</p>
          </div>

          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Итого</p>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {receipt.total_som.toLocaleString("ru-RU")} <span className="text-lg font-medium text-muted-foreground">сом</span>
              </p>
            </div>

            <div className="divide-y divide-border text-left text-sm">
              {receipt.services.map((s, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span>{s.icon} {s.name}</span>
                  <span className="font-medium tabular-nums">
                    {s.price_som.toLocaleString("ru-RU")} сом
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border p-4">
              <SplitVisualization total={receipt.total_som} />
            </div>

            <p className="text-sm text-center text-muted-foreground">{receipt.message}</p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setReceipt(null);
                setServices(initialServices);
                setName("");
                setCountry("");
              }}
            >
              Новая оплата
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-center text-foreground">
        Оплата услуг Rest Point
      </h1>

      {/* Выбор Rest Point с TOUROSAT Score */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6 space-y-4">
          <label className="text-sm font-medium text-foreground block">
            📍 Выберите Rest Point
          </label>
          <select
            value={selectedPoint}
            onChange={(e) => setSelectedPoint(e.target.value)}
            className="w-full p-3 rounded-md border border-border bg-background text-foreground text-base"
          >
            {REST_POINTS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.emoji} {p.name} — Score {p.score}/100
              </option>
            ))}
          </select>

          {currentPoint && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPoint.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 pt-2"
              >
                <TourosatScore
                  score={currentPoint.score}
                  confidence={0.87}
                  size="lg"
                />
                <div className="w-full">
                  <WeatherBadge
                    lat={currentPoint.lat}
                    lon={currentPoint.lon}
                    variant="card"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Услуги */}
      <Card>
        <CardContent className="pt-6 space-y-1">
          {services.map((s, i) => (
            <label
              key={i}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-accent rounded-md px-2 transition-colors"
              onClick={() => toggleService(i)}
            >
              <div className="flex items-center gap-3">
                <Checkbox checked={s.checked} onCheckedChange={() => toggleService(i)} />
                <span className="text-lg">{s.icon}</span>
                <span className="text-foreground">{s.name}</span>
              </div>
              <span className="font-semibold text-foreground tabular-nums">
                {s.price_som.toLocaleString("ru-RU")} сом
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Total + live split */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Итого к оплате</span>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground tabular-nums"
            >
              {total.toLocaleString("ru-RU")} <span className="text-base font-medium text-muted-foreground">сом</span>
            </motion.span>
          </div>
          {total > 0 && <SplitVisualization total={total} />}
        </CardContent>
      </Card>

      {/* Имя и страна */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Имя</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Страна</label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ваша страна"
          />
        </div>
      </div>

      <Button
        className="w-full h-14 text-lg font-semibold shadow-[var(--shadow-premium)]"
        onClick={handlePay}
        disabled={loading || total === 0}
      >
        {loading ? "Обработка..." : `Оплатить ${total.toLocaleString("ru-RU")} сом`}
      </Button>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
};

export default TouristPage;
