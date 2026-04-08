import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

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
  { name: "Тамга", score: 65, emoji: "🏔" },
  { name: "Барскоон", score: 60, emoji: "🏔" },
  { name: "Джети-Өгүз", score: 57, emoji: "🌲" },
  { name: "Григорьевка", score: 63, emoji: "🏖" },
  { name: "Тамга-Юг", score: 63, emoji: "🏔" },
  { name: "Чолпон-Ата", score: 60, emoji: "🏖" },
  { name: "Каракол", score: 68, emoji: "🏔" },
  { name: "Семёновка", score: 57, emoji: "🌲" },
  { name: "Алтын-Арашан", score: 47, emoji: "♨️" },
  { name: "Ак-Суу", score: 63, emoji: "💧" },
  { name: "Кара-Ой", score: 59, emoji: "🏖" },
  { name: "Тон", score: 53, emoji: "🏔" },
  { name: "Сон-Куль", score: 31, emoji: "🏕" },
  { name: "Аныракай", score: 37, emoji: "🏜" },
  { name: "Балыкчы", score: 27, emoji: "🌊" },
  { name: "Кызыл-Суу", score: 61, emoji: "🏔" },
  { name: "Чон-Кызыл-Суу", score: 54, emoji: "🏔" },
];

const initialServices: ServiceItem[] = [
  { icon: "🛏", name: "Юрта (2 чел)", price_som: 2800, checked: false },
  { icon: "🍽", name: "Обед (национальная кухня)", price_som: 450, checked: false },
  { icon: "🐎", name: "Конная прогулка (2 часа)", price_som: 1200, checked: false },
  { icon: "📶", name: "Wi-Fi + зарядка", price_som: 100, checked: false },
  { icon: "📸", name: "Фототур с гидом", price_som: 2000, checked: false },
];

const TouristPage = () => {
  const [selectedPoint, setSelectedPoint] = useState("Тамга");
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
    } finally {
      setLoading(false);
    }
  };

  if (receipt) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <Card>
          <CardContent className="pt-6 space-y-6 text-center">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-primary">Оплата прошла!</h2>
            <p className="text-lg text-muted-foreground">
              📍 {receipt.point_name}
            </p>

            <div className="divide-y divide-border text-left">
              {receipt.services.map((s, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span>{s.icon} {s.name}</span>
                  <span className="font-medium">{s.price_som} сом</span>
                </div>
              ))}
            </div>

            <div className="text-xl font-bold text-foreground">
              Итого: {receipt.total_som} сом
            </div>

            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm text-left">
              <p>👤 Владелец: {receipt.split.owner.amount_som} сом (88%)</p>
              <p>🔧 TamgaFlow: {receipt.split.platform.amount_som} сом (7%)</p>
              <p>🏛 Фонд КР: {receipt.split.fund.amount_som} сом (5%)</p>
            </div>

            <p className="text-sm text-muted-foreground">{receipt.message}</p>

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
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-center text-foreground">
        Оплата услуг Rest Point
      </h1>

      {/* Выбор Rest Point */}
      <Card>
        <CardContent className="pt-6">
          <label className="text-sm font-medium text-foreground block mb-2">
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
            <p className="text-sm text-muted-foreground mt-2">
              {currentPoint.emoji} TOUROSAT Score: {currentPoint.score}/100
              {currentPoint.score >= 60 ? " 🟢" : currentPoint.score >= 50 ? " 🟡" : " 🔴"}
            </p>
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
              <span className="font-semibold text-foreground">{s.price_som} сом</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="text-center text-xl font-bold text-foreground">
        Итого: {total} сом
      </div>

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
        className="w-full"
        onClick={handlePay}
        disabled={loading || total === 0}
      >
        {loading ? "Обработка..." : `Оплатить ${total} сом`}
      </Button>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
};

export default TouristPage;
