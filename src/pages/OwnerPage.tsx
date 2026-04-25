import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Mountain,
  Wifi,
  Coffee,
  ParkingCircle,
  Utensils,
  Tent,
  Heart,
  Wand2,
  Satellite,
  TrendingUp,
  Award,
  Users,
  Clock,
  Check,
  ArrowRight,
  Languages,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { AnalyzingOverlay } from "@/components/owner/AnalyzingOverlay";
import { OwnerRecommendationCard } from "@/components/owner/RecommendationCard";
import { ForecastChart } from "@/components/owner/ForecastChart";
import { RoiCalculator } from "@/components/owner/RoiCalculator";
import { AiCopyHelper } from "@/components/owner/AiCopyHelper";
import { MediaUploader } from "@/components/owner/MediaUploader";
import { ScoreUpliftBar } from "@/components/owner/ScoreUpliftBar";
import { analyzeWithTourosat, type OwnerAnalysisResult } from "@/mocks/ownerData";
import { toast } from "sonner";

const SUGGESTION_CHIPS = [
  { icon: "🏔", label: "Вид на горы" },
  { icon: "💧", label: "У озера" },
  { icon: "🏕", label: "Юрточный лагерь" },
  { icon: "🐎", label: "Конные туры" },
  { icon: "📶", label: "Wi-Fi" },
  { icon: "🅿️", label: "Своя парковка" },
  { icon: "🍽", label: "Национальная кухня" },
  { icon: "👨‍👩‍👧", label: "Для семей" },
];

const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Парковка", icon: ParkingCircle },
  { id: "kitchen", label: "Кухня", icon: Utensils },
  { id: "breakfast", label: "Завтрак", icon: Coffee },
  { id: "yurts", label: "Юрты", icon: Tent },
  { id: "horses", label: "Лошади", icon: Heart },
];

const STEPS = [
  { id: "basic", label: "Основное", icon: MapPin },
  { id: "amenities", label: "Удобства", icon: Mountain },
  { id: "description", label: "Описание", icon: Wand2 },
  { id: "media", label: "Фото", icon: Award },
];

const OwnerPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(42.15);
  const [lon, setLon] = useState(77.55);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<OwnerAnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const completion =
    (description.length > 30 ? 25 : 0) +
    (name ? 15 : 0) +
    (amenities.length >= 3 ? 25 : amenities.length * 8) +
    (region ? 10 : 0) +
    25; // location

  const insertChip = (label: string) => {
    setDescription((prev) => (prev ? `${prev.trim()}, ${label.toLowerCase()}` : label));
  };

  const toggleAmenity = (id: string) => {
    setAmenities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAnalyze = async () => {
    if (description.length < 20) {
      toast.error("Опишите вашу точку подробнее (минимум 20 символов)");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await analyzeWithTourosat({ description, lat, lon, amenities });
      if (name) res.pointName = name;
      setResult(res);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch {
      toast.error("Не удалось получить анализ");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-up">
      <AnimatePresence>{analyzing && <AnalyzingOverlay visible={analyzing} />}</AnimatePresence>

      {/* Hero */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <Sparkles className="h-3 w-3 text-primary-dark" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            Для владельцев Rest Point
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.05]">
          Превратите ваше место в{" "}
          <span className="text-gradient-teal">премиум направление</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          TOUROSAT AI рассчитает справедливую цену на основе спутниковых данных, спроса и
          конкурентов. Вы получаете <span className="font-bold text-foreground">88%</span> с каждой
          брони. Прозрачно. Без посредников.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {[
            { icon: Satellite, label: "Sentinel-2" },
            { icon: TrendingUp, label: "Прогноз дохода" },
            { icon: Award, label: "88% владельцу" },
            { icon: Users, label: "AI advisor" },
          ].map((b) => (
            <div
              key={b.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground"
            >
              <b.icon className="h-3 w-3 text-primary" />
              {b.label}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="text-sm font-bold text-primary-dark hover:text-primary inline-flex items-center gap-1 transition-colors"
          >
            Открыть мой дашборд <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main grid: form + sticky insight */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-7xl mx-auto">
        {/* FORM */}
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="rounded-3xl bg-card border border-border p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 overflow-x-auto">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent border border-primary/20">
                    <s.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Basic info */}
          <section className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
              <h2 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                1. Основная информация
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Название, регион и координаты вашей точки
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Название точки
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Юрточный лагерь «Тамга»"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Регион
                  </label>
                  <Input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Иссык-Куль, Тонский район"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Широта
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="h-12 rounded-xl tabular-nums"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Долгота
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={lon}
                    onChange={(e) => setLon(Number(e.target.value))}
                    className="h-12 rounded-xl tabular-nums"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Amenities */}
          <section className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
              <h2 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                2. Удобства
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Влияет на TOUROSAT Score и конверсию в бронь
              </p>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map((a) => {
                const active = amenities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-premium text-left ${
                      active
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border bg-muted/30 hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? "bg-primary text-white" : "bg-card text-muted-foreground"
                      }`}
                    >
                      <a.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{a.label}</span>
                    {active && <Check className="h-4 w-4 text-primary ml-auto" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section: Description */}
          <section className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
              <h2 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                3. Опишите ваше место
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Чем подробнее — тем точнее AI рассчитает цену и Score
              </p>
            </div>
            <div className="p-6 space-y-4">
              <Textarea
                placeholder="Например: Уютный юрточный лагерь у южного берега Иссык-Куля. 5 юрт по 2-4 человека, домашняя кухня, конные прогулки по горам, Wi-Fi, парковка. Из окон — панорама Тянь-Шаня."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="rounded-2xl resize-none text-base leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">{description.length} символов · мин. 20</span>
                {description.length >= 20 && (
                  <span className="inline-flex items-center gap-1 text-success-deep font-bold">
                    <CheckCircle2 className="h-3 w-3" /> Готово к анализу
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Быстрые подсказки
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => insertChip(c.label)}
                      className="px-3 py-1.5 rounded-full bg-muted/40 border border-border hover:border-primary/40 hover:bg-accent text-xs font-bold text-foreground transition-premium"
                    >
                      <span className="mr-1">{c.icon}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Media */}
          <section className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-br from-accent/30 to-card">
              <h2 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                4. Фотографии
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Качественные фото повышают цену на 18-30%
              </p>
            </div>
            <div className="p-6">
              <MediaUploader />
            </div>
          </section>

          {/* PRIMARY CTA */}
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || description.length < 20}
            className="w-full h-16 text-base font-extrabold rounded-2xl shadow-[var(--shadow-glow-teal)] bg-gradient-to-br from-primary to-primary-dark hover:shadow-[var(--shadow-premium)] hover:scale-[1.01] transition-premium"
          >
            <Satellite className="h-5 w-5" />
            Проанализировать с TOUROSAT
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* STICKY INSIGHT PANEL */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white p-6 shadow-[var(--shadow-glow-teal)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/30 blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-95">
                  Live Insight
                </p>
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-tight">
                Заполненность профиля
              </h3>
              <div className="space-y-1.5">
                <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, completion)}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                  />
                </div>
                <p className="text-xs opacity-90 tabular-nums">{Math.min(100, completion)}% готово</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/15">
                <p className="text-[10px] uppercase tracking-wider opacity-80 font-bold">
                  Что увеличит ваш Score
                </p>
                {[
                  { ok: description.length > 50, label: "Подробное описание" },
                  { ok: amenities.length >= 3, label: "Минимум 3 удобства" },
                  { ok: !!name, label: "Название точки" },
                  { ok: !!region, label: "Указан регион" },
                ].map((it) => (
                  <div key={it.label} className="flex items-center gap-2 text-sm">
                    <div
                      className={`h-4 w-4 rounded-md flex items-center justify-center text-[10px] ${
                        it.ok ? "bg-success text-white" : "bg-white/15"
                      }`}
                    >
                      {it.ok ? "✓" : ""}
                    </div>
                    <span className={it.ok ? "opacity-100" : "opacity-70"}>{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings teaser */}
          <div className="rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)] space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gold" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
                Сколько вы можете заработать
              </p>
            </div>
            <p className="text-3xl font-extrabold font-display tabular-nums text-foreground">
              ~1.4M <span className="text-base text-muted-foreground">сом / сезон</span>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Среднее по аналогичным точкам с TOUROSAT Score 75+. После раздела{" "}
              <span className="font-bold text-success-deep">88% / 12%</span>
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Окупаемость от 4 месяцев</span>
            </div>
          </div>
        </aside>
      </div>

      {/* RESULT */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 max-w-7xl mx-auto"
          >
            {/* Hero score result */}
            <div className="rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)] bg-card">
              <div
                className="px-6 py-14 relative overflow-hidden text-center"
                style={{ background: "var(--gradient-surface)" }}
              >
                <div className="absolute -top-12 -right-12 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-gold/15 rounded-full blur-3xl" />

                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-success/10 border border-success/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success-deep" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-success-deep">
                      Анализ завершён
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extrabold font-display text-foreground tracking-tight">
                    {result.pointName}
                  </h2>
                  <p className="text-sm text-muted-foreground -mt-3">
                    📍 {result.region} · Спрос:{" "}
                    <span className="font-bold text-foreground">{result.demandLevel}</span>
                  </p>

                  <div className="flex justify-center pt-4">
                    <TourosatScore
                      score={result.tourosatScore}
                      confidence={result.confidence}
                      size="xl"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6">
                    <div className="rounded-2xl bg-card border border-border p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Рекомендованная цена
                      </p>
                      <p className="text-2xl font-extrabold font-display tabular-nums text-foreground mt-1">
                        {result.recommendedPrice.toLocaleString("ru-RU")}
                      </p>
                      <p className="text-xs text-muted-foreground">сом / ночь</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Доход за сезон
                      </p>
                      <p className="text-2xl font-extrabold font-display tabular-nums text-success-deep mt-1">
                        {Math.round(result.forecast.seasonRevenue / 1000)}K
                      </p>
                      <p className="text-xs text-muted-foreground">сом · 88% владельцу</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        Заполняемость
                      </p>
                      <p className="text-2xl font-extrabold font-display tabular-nums text-foreground mt-1">
                        {result.forecast.avgOccupancyPct}%
                      </p>
                      <p className="text-xs text-muted-foreground">в среднем за сезон</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center">
                    ✓
                  </div>
                  <h3 className="font-extrabold font-display text-foreground">Сильные стороны</h3>
                </div>
                <ul className="space-y-2.5">
                  {result.strengths.map((s) => (
                    <li
                      key={s.label}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/40 transition-colors"
                    >
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center">
                    !
                  </div>
                  <h3 className="font-extrabold font-display text-foreground">Что можно улучшить</h3>
                </div>
                <ul className="space-y-2.5">
                  {result.weaknesses.map((s) => (
                    <li
                      key={s.label}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/40 transition-colors"
                    >
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI generated description */}
            <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-card flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold font-display text-foreground">
                    Готовое описание для туристов
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Сгенерировано TOUROSAT AI на основе вашей точки
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(result.generatedDescription);
                    toast.success("Скопировано");
                  }}
                >
                  <Languages className="h-3.5 w-3.5" />
                  Копировать
                </Button>
              </div>
              <div className="p-6">
                <p className="text-base text-foreground leading-relaxed">
                  {result.generatedDescription}
                </p>
              </div>
            </div>

            {/* AI Copy Helper */}
            <AiCopyHelper text={result.generatedDescription} />

            {/* Score Uplift */}
            <ScoreUpliftBar
              current={result.tourosatScore}
              potential={result.potentialScore}
              revenueUpliftPct={result.recommendations.reduce((s, r) => s + r.revenueUpliftPct, 0)}
            />

            {/* Recommendations */}
            <div className="space-y-5">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
                  Как поднять <span className="text-gradient-teal">ваш Score</span>
                </h2>
                <p className="text-muted-foreground mt-2">
                  TOUROSAT AI выделил конкретные шаги, которые увеличат доход
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.recommendations.map((r, i) => (
                  <OwnerRecommendationCard key={r.id} rec={r} index={i} />
                ))}
              </div>
            </div>

            {/* Forecast */}
            <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <div className="p-7 border-b border-border bg-gradient-to-br from-success/5 to-card">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
                      Прогноз дохода на сезон
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Май — Октябрь · На основе спроса по региону
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        Доход (грязный)
                      </p>
                      <p className="text-xl font-extrabold tabular-nums font-display text-foreground">
                        {result.forecast.seasonRevenue.toLocaleString("ru-RU")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-success-deep font-bold">
                        Вам (88%)
                      </p>
                      <p className="text-xl font-extrabold tabular-nums font-display text-success-deep">
                        {Math.round(result.forecast.seasonRevenue * 0.88).toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7 space-y-6">
                <ForecastChart data={result.forecast.monthly} />
                <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Бронирований
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums font-display text-foreground">
                      {result.forecast.expectedBookingsSeason}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Средний месяц
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums font-display text-foreground">
                      {Math.round(result.forecast.avgMonthlyRevenue / 1000)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      Заполняемость
                    </p>
                    <p className="text-2xl font-extrabold tabular-nums font-display text-foreground">
                      {result.forecast.avgOccupancyPct}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Split */}
            <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <div className="p-7 border-b border-border bg-gradient-to-br from-success/5 to-card">
                <h3 className="text-xl font-extrabold font-display text-foreground tracking-tight">
                  Сколько вы получите с каждой брони
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Прозрачное распределение · Пример при цене {result.recommendedPrice.toLocaleString("ru-RU")} сом
                </p>
              </div>
              <div className="p-7">
                <SplitVisualization total={result.recommendedPrice} />
              </div>
            </div>

            {/* ROI Calculator */}
            <RoiCalculator defaultPrice={result.recommendedPrice} />

            {/* Final CTA */}
            <div className="rounded-[2rem] p-8 text-center text-white relative overflow-hidden shadow-[var(--shadow-premium)]" style={{ background: "var(--gradient-emerald)" }}>
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, white 1px, transparent 2px), radial-gradient(circle at 70% 80%, white 1px, transparent 2px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="relative space-y-5 max-w-xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
                  Готовы публиковать?
                </h3>
                <p className="text-base opacity-95">
                  Опубликуйте точку и получите первое бронирование уже на этой неделе
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={() => {
                      toast.success("Точка опубликована! (демо)");
                      navigate("/owner/dashboard");
                    }}
                    className="rounded-2xl bg-white text-success-deep hover:bg-white/95 font-extrabold h-12 px-7"
                  >
                    Опубликовать точку
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/owner/dashboard")}
                    className="rounded-2xl bg-transparent border-white/40 text-white hover:bg-white/10 font-bold h-12 px-7"
                  >
                    Перейти в дашборд
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerPage;
