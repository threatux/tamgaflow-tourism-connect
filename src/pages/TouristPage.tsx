import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { WeatherBadge } from "@/components/WeatherBadge";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { USE_MOCKS, API_BASE_URL } from "@/config";
import { createPayment } from "@/mocks/api";

interface ServiceItem {
  icon: string;
  name: string;
  price_som: number;
  checked: boolean;
}

interface Split {
  owner: { amount_som: number };
  platform: { amount_som: number };
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
    const palette = ["#0891B2", "#0E7490", "#F59E0B", "#FCD34D", "#10B981", "#ffffff"];
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.4 }, colors: palette });
    setTimeout(() => confetti({ particleCount: 100, spread: 110, angle: 60, origin: { x: 0, y: 0.6 }, colors: palette }), 200);
    setTimeout(() => confetti({ particleCount: 100, spread: 110, angle: 120, origin: { x: 1, y: 0.6 }, colors: palette }), 400);
    setTimeout(() => confetti({ particleCount: 80, spread: 360, startVelocity: 25, origin: { y: 0.5 }, colors: palette, scalar: 0.8 }), 700);
  };

  const handlePay = async () => {
    const selected = services.filter((s) => s.checked);
    if (!selected.length) return;
    if (!name.trim()) { setError("Введите имя"); return; }
    if (!country.trim()) { setError("Введите страну"); return; }
    setLoading(true);
    setError("");
    try {
      const payload = {
        point_name: selectedPoint,
        services: selected.map(({ name, icon, price_som }) => ({ name, icon, price_som })),
        tourist_name: name,
        tourist_country: country,
      };
      const data = USE_MOCKS
        ? await createPayment(payload)
        : await fetch(`${API_BASE_URL}/api/tamga/payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then((r) => r.json());
      setReceipt({ ...data, point_name: selectedPoint });
      fireConfetti();
    } catch {
      setReceipt({
        total_som: total,
        services: selected.map(({ icon, name, price_som }) => ({ icon, name, price_som })),
        split: {
          owner: { amount_som: Math.round(total * 0.88) },
          platform: { amount_som: Math.round(total * 0.12) },
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
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg mx-auto"
      >
        <div className="rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)] bg-card">
          {/* Hero success */}
          <div
            className="px-6 py-12 text-center text-primary-foreground relative overflow-hidden"
            style={{ background: "var(--gradient-emerald)" }}
          >
            <div className="absolute inset-0 opacity-15" style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
              backgroundSize: "40px 40px",
            }} />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
              className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur mb-4 shadow-2xl ring-4 ring-white/20"
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold font-display tracking-tight"
            >
              Оплата прошла!
            </motion.h2>
            <p className="text-sm opacity-90 mt-2 font-semibold tracking-wide">📍 {receipt.point_name}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center -mt-14 relative">
              <div className="inline-block bg-card rounded-2xl px-8 py-5 border border-border shadow-[var(--shadow-elevated)]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Итого</p>
                <p className="text-5xl font-extrabold font-display text-foreground tabular-nums leading-tight tracking-tight mt-1">
                  {receipt.total_som.toLocaleString("ru-RU")}
                  <span className="text-xl font-medium text-muted-foreground ml-1">сом</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {receipt.services.map((s, i) => (
                <div key={i} className="flex justify-between py-3 px-4 bg-card">
                  <span className="font-medium text-sm">{s.icon} {s.name}</span>
                  <span className="font-bold tabular-nums text-sm">
                    {s.price_som.toLocaleString("ru-RU")} сом
                  </span>
                </div>
              ))}
            </div>

            <SplitVisualization total={receipt.total_som} />

            <p className="text-sm text-center text-muted-foreground italic px-4">{receipt.message}</p>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold border-2"
              onClick={() => {
                setReceipt(null);
                setServices(initialServices);
                setName("");
                setCountry("");
              }}
            >
              Новая оплата
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-up">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            🎒 Платежи туриста
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
          Оплата услуг <span className="text-gradient-teal">Rest Point</span>
        </h1>
      </div>

      {/* Point + Score */}
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 space-y-5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground block">
            📍 Выберите Rest Point
          </label>
          <select
            value={selectedPoint}
            onChange={(e) => setSelectedPoint(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-premium"
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-5 pt-4"
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
        </div>
      </div>

      {/* Services */}
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Услуги</h3>
        </div>
        <div className="p-3 space-y-1">
          {services.map((s, i) => (
            <label
              key={i}
              className={`flex items-center justify-between py-3 px-3 cursor-pointer rounded-2xl transition-premium ${
                s.checked ? "bg-accent" : "hover:bg-muted/50"
              }`}
              onClick={() => toggleService(i)}
            >
              <div className="flex items-center gap-3">
                <Checkbox checked={s.checked} onCheckedChange={() => toggleService(i)} />
                <span className="text-xl">{s.icon}</span>
                <span className="text-foreground font-semibold">{s.name}</span>
              </div>
              <span className="font-extrabold text-foreground tabular-nums font-display">
                {s.price_som.toLocaleString("ru-RU")} <span className="text-xs text-muted-foreground font-medium">сом</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Total + live split */}
      <div className="rounded-3xl bg-gradient-to-br from-card via-card to-accent border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-bold">
              Итого к оплате
            </span>
            <motion.span
              key={total}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold font-display text-foreground tabular-nums tracking-tight"
            >
              {total.toLocaleString("ru-RU")}{" "}
              <span className="text-lg font-medium text-muted-foreground">сом</span>
            </motion.span>
          </div>
          {total > 0 && <SplitVisualization total={total} />}
        </div>
      </div>

      {/* Имя и страна */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Имя</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="h-12 rounded-xl bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Страна</label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ваша страна"
            className="h-12 rounded-xl bg-card"
          />
        </div>
      </div>

      <Button
        className="w-full h-16 text-lg font-bold rounded-2xl shadow-[var(--shadow-glow-teal)] bg-gradient-to-br from-primary to-primary-dark hover:opacity-95 active:scale-[0.99] transition-premium"
        onClick={handlePay}
        disabled={loading || total === 0}
      >
        {loading
          ? "⏳ Обработка..."
          : total === 0
          ? "Выберите услуги"
          : `Оплатить ${total.toLocaleString("ru-RU")} сом →`}
      </Button>

      {error && <p className="text-sm text-destructive text-center font-semibold">{error}</p>}
    </div>
  );
};

export default TouristPage;
