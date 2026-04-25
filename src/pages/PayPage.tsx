import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { WeatherBadge } from "@/components/WeatherBadge";
import { USE_MOCKS, API_BASE_URL } from "@/config";
import { createPayment } from "@/mocks/api";
import { MOCK_REST_POINTS } from "@/mocks/restPoints";

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

const initialServices: ServiceItem[] = [
  { icon: "🛏", name: "Юрта (2 чел)", price_som: 2800, checked: true },
  { icon: "🍽", name: "Обед (национальная кухня)", price_som: 450, checked: false },
  { icon: "🐎", name: "Конная прогулка (2 часа)", price_som: 1200, checked: false },
  { icon: "📶", name: "Wi-Fi + зарядка", price_som: 100, checked: false },
  { icon: "📸", name: "Фототур с гидом", price_som: 2000, checked: false },
];

const PayPage = () => {
  const [params] = useSearchParams();
  const initialPoint = params.get("point");
  const [selectedPoint, setSelectedPoint] = useState(
    initialPoint && MOCK_REST_POINTS.some((p) => p.name === initialPoint)
      ? initialPoint
      : MOCK_REST_POINTS[0].name
  );
  const [services, setServices] = useState(initialServices);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const p = params.get("point");
    if (p && MOCK_REST_POINTS.some((r) => r.name === p)) setSelectedPoint(p);
  }, [params]);

  const total = services.filter((s) => s.checked).reduce((sum, s) => sum + s.price_som, 0);
  const point = MOCK_REST_POINTS.find((p) => p.name === selectedPoint);

  const fireConfetti = () => {
    const palette = ["#0891B2", "#0E7490", "#F59E0B", "#FCD34D", "#10B981", "#ffffff"];
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.4 }, colors: palette });
    setTimeout(
      () =>
        confetti({
          particleCount: 100,
          spread: 110,
          angle: 60,
          origin: { x: 0, y: 0.6 },
          colors: palette,
        }),
      200
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 100,
          spread: 110,
          angle: 120,
          origin: { x: 1, y: 0.6 },
          colors: palette,
        }),
      400
    );
  };

  const pay = async () => {
    const selected = services.filter((s) => s.checked);
    if (!selected.length) return;
    if (!name.trim()) return setError("Введите имя");
    if (!country.trim()) return setError("Введите страну");
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
        message: `Спасибо, ${name}! Вы поддержали село и туризм Кыргызстана.`,
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
        className="max-w-xl mx-auto"
      >
        <div className="rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)] bg-card">
          <div
            className="px-6 py-12 text-center text-primary-foreground relative overflow-hidden"
            style={{ background: "var(--gradient-emerald)" }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
                backgroundSize: "40px 40px",
              }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
              className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur mb-4 shadow-2xl ring-4 ring-white/20"
            >
              <Check className="h-12 w-12 text-white" strokeWidth={3} />
            </motion.div>
            <h2 className="text-4xl font-extrabold font-display tracking-tight">
              Оплата прошла!
            </h2>
            <p className="text-sm opacity-90 mt-2 font-semibold tracking-wide">
              📍 {receipt.point_name}
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center -mt-14 relative">
              <div className="inline-block bg-card rounded-2xl px-8 py-5 border border-border shadow-[var(--shadow-elevated)]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                  Итого
                </p>
                <p className="text-5xl font-extrabold font-display text-foreground tabular-nums leading-tight tracking-tight mt-1">
                  {receipt.total_som.toLocaleString("ru-RU")}
                  <span className="text-xl font-medium text-muted-foreground ml-1">сом</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
              {receipt.services.map((s, i) => (
                <div key={i} className="flex justify-between py-3 px-4 bg-card">
                  <span className="font-medium text-sm">
                    {s.icon} {s.name}
                  </span>
                  <span className="font-bold tabular-nums text-sm">
                    {s.price_som.toLocaleString("ru-RU")} сом
                  </span>
                </div>
              ))}
            </div>

            <SplitVisualization total={receipt.total_som} />

            <p className="text-sm text-center text-muted-foreground italic px-4">
              ✨ {receipt.message}
            </p>

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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            💳 Оплата · Прозрачный split 88 / 12
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
          Бронирование <span className="text-gradient-teal">Rest Point</span>
        </h1>
      </div>

      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 space-y-5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground block">
            📍 Rest Point
          </label>
          <select
            value={selectedPoint}
            onChange={(e) => setSelectedPoint(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border bg-background text-foreground text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-premium"
          >
            {MOCK_REST_POINTS.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} — {p.region} · Score {p.tourosatScore}
              </option>
            ))}
          </select>

          {point && (
            <AnimatePresence mode="wait">
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-5 pt-4"
              >
                <TourosatScore score={point.tourosatScore} confidence={point.confidence} size="lg" />
                <div className="w-full">
                  <WeatherBadge lat={point.lat} lon={point.lng} variant="card" />
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Услуги
          </h3>
        </div>
        <div className="p-3 space-y-1">
          {services.map((s, i) => (
            <label
              key={i}
              className={`flex items-center justify-between py-3 px-3 cursor-pointer rounded-2xl transition-premium ${
                s.checked ? "bg-accent" : "hover:bg-muted/50"
              }`}
              onClick={() =>
                setServices((prev) =>
                  prev.map((x, idx) => (idx === i ? { ...x, checked: !x.checked } : x))
                )
              }
            >
              <div className="flex items-center gap-3">
                <Checkbox checked={s.checked} />
                <span className="text-xl">{s.icon}</span>
                <span className="text-foreground font-semibold">{s.name}</span>
              </div>
              <span className="font-extrabold text-foreground tabular-nums font-display">
                {s.price_som.toLocaleString("ru-RU")}{" "}
                <span className="text-xs text-muted-foreground font-medium">сом</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-card via-card to-accent border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 space-y-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-bold">
              Итого
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Имя
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="h-12 rounded-xl bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Страна
          </label>
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
        onClick={pay}
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

export default PayPage;
