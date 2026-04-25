import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Satellite,
  Sparkles,
  TrendingUp,
  MapPin,
  Home as HomeIcon,
  Backpack,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe2,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  Mountain,
  Radio,
} from "lucide-react";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { CountUp } from "@/components/home/CountUp";
import heroImage from "@/assets/hero-issyk-kul.jpg";

const kpis = [
  {
    value: 17,
    suffix: "",
    label: "Rest Points",
    sub: "Pilot network of digitized locations",
    icon: MapPin,
    accent: "teal" as const,
  },
  {
    value: 1.1,
    prefix: "$",
    suffix: "B",
    decimals: 1,
    label: "Tourism · KG 2025",
    sub: "Massive market opportunity",
    icon: Globe2,
    accent: "gold" as const,
  },
  {
    value: 88,
    suffix: "%",
    label: "to Owner",
    sub: "Transparent payout model",
    icon: HomeIcon,
    accent: "emerald" as const,
  },
  {
    value: 12,
    suffix: "%",
    label: "to Platform",
    sub: "Platform economics for scale",
    icon: Zap,
    accent: "ink" as const,
  },
];

const accentMap = {
  teal: { ring: "border-primary/20", bg: "from-primary/12 to-primary/0", text: "text-primary-dark", glow: "bg-primary/30" },
  gold: { ring: "border-gold/25", bg: "from-gold/15 to-gold/0", text: "text-gold-deep", glow: "bg-gold/30" },
  emerald: { ring: "border-success/20", bg: "from-success/12 to-success/0", text: "text-success-deep", glow: "bg-success/30" },
  ink: { ring: "border-foreground/12", bg: "from-foreground/8 to-foreground/0", text: "text-foreground", glow: "bg-foreground/15" },
};

const roles = [
  {
    icon: HomeIcon,
    badge: "FOR OWNERS",
    title: "Владелец",
    desc: "TOUROSAT создаёт карточку и рекомендует цену.",
    steps: ["Опишите точку", "Получите TOUROSAT Score", "Запустите листинг"],
    cta: "Создать карточку",
    to: "/owner",
    accent: "teal" as const,
  },
  {
    icon: Backpack,
    badge: "FOR TOURISTS",
    title: "Турист",
    desc: "Находит, оплачивает, получает лучший опыт.",
    steps: ["Откройте карту", "Получите AI-подбор", "Оплатите за секунды"],
    cta: "Открыть карту",
    to: "/map",
    accent: "gold" as const,
  },
  {
    icon: BarChart3,
    badge: "FOR THE FUND",
    title: "Фонд",
    desc: "Видит живой поток и получает аналитику.",
    steps: ["Live payment stream", "AI-рекомендации", "Решения по грантам"],
    cta: "Открыть дашборд",
    to: "/dashboard",
    accent: "emerald" as const,
  },
];

const trustChips = [
  { icon: Satellite, label: "TOUROSAT AI Scoring" },
  { icon: Layers, label: "Satellite Intelligence" },
  { icon: CircleDollarSign, label: "88 / 12 Smart Split" },
  { icon: Activity, label: "Live Tourism Analytics" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-28 md:space-y-36">
      {/* ============== HERO ============== */}
      <section className="relative pt-6 md:pt-12 pb-4">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute top-10 right-[5%] w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px] -z-10" />
        <div className="pointer-events-none absolute top-40 left-[5%] w-[30rem] h-[30rem] bg-gold/10 rounded-full blur-[140px] -z-10" />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] bg-success/8 rounded-full blur-[160px] -z-10" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <Satellite className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary-dark">
                Powered by TOUROSAT · Satellite Intelligence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold font-display leading-[1.02] tracking-[-0.03em] text-balance">
              Каждый Rest Point.<br />
              Каждый турист.{" "}
              <span className="text-gradient-gold">Каждый сом</span>
              <span className="text-muted-foreground/80"> — на своём месте.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[58ch] leading-relaxed">
              Спутниковый ИИ помогает владельцам Rest Points запускать доходный
              бизнес, а туристам — легко находить и оплачивать лучшие места.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate("/map")}
                className="group relative h-14 px-8 text-base font-bold rounded-2xl bg-gradient-to-br from-primary to-primary-dark hover:shadow-[var(--shadow-glow-teal)] hover:-translate-y-0.5 transition-premium shadow-[var(--shadow-elevated)]"
              >
                <MapPin className="mr-1 h-5 w-5" />
                Открыть карту
                <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/owner")}
                className="h-14 px-8 text-base font-bold rounded-2xl border-2 border-border bg-card hover:border-foreground/30 hover:-translate-y-0.5 transition-premium"
              >
                Я владелец Rest Point
              </Button>
            </div>

            {/* Trust chips */}
            <div className="pt-6 flex flex-wrap gap-2">
              {trustChips.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-[11px] font-semibold text-muted-foreground shadow-[var(--shadow-soft)]"
                >
                  <c.icon className="h-3 w-3 text-primary" />
                  {c.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: layered showcase cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Big visual base */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-[var(--shadow-premium)] aspect-[4/5] lg:aspect-[5/6]">
              <img
                src={heroImage}
                alt="Issyk-Kul lake — premium Kyrgyzstan tourism intelligence"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute inset-0 bg-dots opacity-20 mix-blend-overlay" />

              {/* Mini-map chip top-left */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-5 left-5 glass-strong rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-[var(--shadow-card)]"
              >
                <div className="relative h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary-dark" />
                  <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-success animate-pulse" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold">
                    Live Map
                  </p>
                  <p className="text-xs font-bold text-foreground">17 Rest Points</p>
                </div>
              </motion.div>

              {/* Recommendation chip top-right */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute top-5 right-5 glass-strong rounded-2xl px-3.5 py-2.5 max-w-[210px] shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-3 w-3 text-gold-deep" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep font-bold">
                    AI Recommendation
                  </p>
                </div>
                <p className="text-xs font-semibold text-foreground leading-snug">
                  Tamga Coast — high scenery + strong access
                </p>
              </motion.div>
            </div>

            {/* Score card — overlapping */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="absolute -left-4 lg:-left-10 -bottom-6 glass-strong rounded-[1.75rem] p-5 shadow-[var(--shadow-premium)] w-[230px] animate-ambient"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  TOUROSAT Score
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success-deep border border-success/20">
                  ● Live
                </span>
              </div>
              <div className="flex justify-center">
                <TourosatScore score={92} confidence={0.92} size="md" showSources={false} />
              </div>
            </motion.div>

            {/* Split mini card — overlapping bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="absolute -right-4 lg:-right-8 -bottom-10 glass-strong rounded-2xl p-4 shadow-[var(--shadow-elevated)] w-[230px]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Split · 6,550 KGS
                </span>
                <CircleDollarSign className="h-3.5 w-3.5 text-primary" />
              </div>
              <SplitVisualization total={6550} compact />
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Fund · 5%
                </span>
                <span className="text-xs font-extrabold text-gold-deep tabular-nums">
                  +325 KGS
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============== KPI BLOCK ============== */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <span className="pill bg-accent text-primary-dark border border-primary/20">
              <Activity className="h-3 w-3" /> Platform at a glance
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
              Цифры, которые объясняют продукт
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Прозрачная экономика. Реальный рынок. Понятный масштаб с первого дня.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {kpis.map((k, i) => {
            const a = accentMap[k.accent];
            return (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="group relative rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium overflow-hidden p-6"
              >
                <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity ${a.glow}`} />
                <div className="relative">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center bg-gradient-to-br border ${a.bg} ${a.ring} ${a.text} mb-5`}>
                    <k.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <p className="text-3xl md:text-[38px] font-extrabold font-display tabular-nums leading-none tracking-tight text-foreground">
                    <CountUp
                      to={k.value}
                      prefix={k.prefix ?? ""}
                      suffix={k.suffix ?? ""}
                      decimals={k.decimals ?? 0}
                    />
                  </p>
                  <p className="text-[11px] mt-3 font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {k.label}
                  </p>
                  <p className="text-[12px] mt-1 text-muted-foreground/80 leading-snug">
                    {k.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============== HOW IT WORKS / 3 ROLES ============== */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="pill bg-gold/10 text-gold-deep border border-gold/30 mx-auto">
            <Sparkles className="h-3 w-3" /> Как это работает
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Три роли — одна экосистема
          </h2>
          <p className="text-muted-foreground text-lg">
            TamgaFlow связывает владельцев, путешественников и Фонд развития
            одной прозрачной экономикой и единым уровнем интеллекта.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {roles.map((r, i) => {
            const a = accentMap[r.accent];
            return (
              <motion.button
                key={r.title}
                onClick={() => navigate(r.to)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group text-left relative overflow-hidden rounded-3xl p-7 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-premium"
              >
                <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity ${a.glow}`} />
                <div className="relative space-y-5">
                  <div className="flex items-center justify-between">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border bg-gradient-to-br ${a.bg} ${a.ring} ${a.text} shadow-sm`}>
                      <r.icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <span className="text-5xl font-extrabold font-display text-muted-foreground/15 leading-none">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {r.badge}
                    </span>
                    <h3 className="text-2xl font-extrabold font-display text-foreground mt-1">
                      {r.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {r.desc}
                    </p>
                  </div>

                  {/* Mini step flow */}
                  <ul className="space-y-2 pt-2 border-t border-border/60">
                    {r.steps.map((s, idx) => (
                      <li key={s} className="flex items-center gap-2.5 text-[13px] text-foreground/80">
                        <span className={`size-5 rounded-md text-[10px] font-bold flex items-center justify-center bg-gradient-to-br ${a.bg} ${a.ring} ${a.text} border`}>
                          {idx + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary pt-1">
                    {r.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ============== PROBLEM → SOLUTION ============== */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="pill bg-destructive/10 text-destructive border border-destructive/20 mx-auto">
            <AlertTriangle className="h-3 w-3" /> Проблема → Решение
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Что мы меняем в туризме Кыргызстана
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 border border-destructive/20 shadow-[var(--shadow-card)] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(0 84% 97%), hsl(0 60% 99%) 60%, hsl(0 0% 100%))",
            }}
          >
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-destructive/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive">
                    Текущее состояние
                  </span>
                  <h3 className="text-2xl font-extrabold font-display text-foreground">
                    Проблема
                  </h3>
                </div>
              </div>

              <ul className="space-y-3.5">
                {[
                  { strong: "95%", text: "туристического дохода — в нескольких популярных местах" },
                  { strong: null, text: "Малые Rest Points остаются невидимыми и без аудитории" },
                  { strong: null, text: "У владельцев нет понятного ценообразования и инструментов" },
                  { strong: null, text: "У туристов нет удобного способа находить качественные места" },
                  { strong: null, text: "У Фонда нет живой прозрачной аналитики потока дохода" },
                ].map((p, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-foreground/85">
                    <span className="mt-1.5 size-1.5 rounded-full bg-destructive shrink-0" />
                    <span>
                      {p.strong && (
                        <strong className="text-destructive font-extrabold mr-1">{p.strong}</strong>
                      )}
                      {p.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-8 border border-primary/25 shadow-[var(--shadow-elevated)] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(188 95% 96%), hsl(160 60% 97%) 60%, hsl(0 0% 100%))",
            }}
          >
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />
            <div className="absolute -top-12 -left-12 w-44 h-44 bg-success/15 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-11 w-11 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success-deep" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-success-deep">
                    TamgaFlow Solution
                  </span>
                  <h3 className="text-2xl font-extrabold font-display text-foreground">
                    Что мы делаем
                  </h3>
                </div>
              </div>

              <ul className="space-y-3.5">
                {[
                  "TOUROSAT делает малые Rest Points видимыми и даёт им рейтинг",
                  "Владелец запускает доходный digital listing за минуты",
                  "Турист быстро находит и оплачивает прозрачно",
                  "Прозрачный split: 88% владельцу · 12% платформе · +5% Фонду",
                  "Спутниковые данные → практические решения и AI-аналитика",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-foreground/85">
                    <CheckCircle2 className="h-4 w-4 text-success-deep shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-success/20 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-2xl font-extrabold font-display text-success-deep tabular-nums">+18%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Owner uplift</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-display text-primary-dark tabular-nums">2.4×</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Visibility</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-display text-gold-deep tabular-nums">100%</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">Transparency</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== TOUROSAT CREDIBILITY STRIP ============== */}
      <section className="relative rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-card)]">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 80% 0%, hsl(190 91% 36% / 0.12), transparent 60%), radial-gradient(ellipse 800px 400px at 0% 100%, hsl(38 92% 50% / 0.08), transparent 60%), linear-gradient(180deg, hsl(0 0% 100%), hsl(210 40% 99%))",
          }}
        />
        <div className="absolute inset-0 bg-dots opacity-40 -z-10" />

        <div className="grid lg:grid-cols-12 gap-10 p-8 md:p-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="pill bg-card border border-primary/20 text-primary-dark">
              <Satellite className="h-3 w-3" /> TOUROSAT · Satellite Intelligence Layer
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight leading-tight">
              <span className="text-gradient-teal">TOUROSAT</span> превращает спутниковые данные<br className="hidden md:block" />
              {" "}в туристическую экономику.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              Мы анализируем рельеф, доступность, природный контекст и quality
              signals каждой локации, чтобы превратить их в понятный TOUROSAT
              Score и рекомендованную цену.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: Mountain, t: "Scenic value", d: "Качество ландшафта по спутнику" },
                { icon: Compass, t: "Access", d: "Дорожная доступность и логистика" },
                { icon: Radio, t: "Quality signals", d: "Контекст, активность, спрос" },
                { icon: ShieldCheck, t: "AI-assisted scoring", d: "Прозрачная модель оценки" },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl p-4 bg-card border border-border flex gap-3 items-start">
                  <div className="h-9 w-9 rounded-xl bg-accent border border-primary/20 flex items-center justify-center text-primary-dark shrink-0">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-extrabold text-foreground">{f.t}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data sources strip */}
            <div className="pt-6 border-t border-border/80">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold mb-3">
                Data sources
              </p>
              <div className="flex flex-wrap gap-2">
                {["Sentinel-2", "SRTM", "MODIS", "OpenStreetMap"].map((src) => (
                  <span
                    key={src}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-bold tracking-wider text-foreground/80 shadow-[var(--shadow-soft)]"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: live score showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-card border border-border shadow-[var(--shadow-elevated)] p-7 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                      Sample Output
                    </p>
                    <p className="text-base font-extrabold text-foreground">Tamga Coast Camp</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-success/10 text-success-deep border border-success/20">
                    Confidence 91%
                  </span>
                </div>

                <div className="flex justify-center py-2">
                  <TourosatScore score={83} confidence={0.91} size="md" showSources={false} />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl p-3 bg-accent/60 border border-primary/15">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Recommended price</p>
                    <p className="text-lg font-extrabold text-foreground tabular-nums mt-0.5">6,550 KGS</p>
                  </div>
                  <div className="rounded-2xl p-3 bg-gold/10 border border-gold/20">
                    <p className="text-[10px] uppercase tracking-wider text-gold-deep font-bold">Expected uplift</p>
                    <p className="text-lg font-extrabold text-gold-deep tabular-nums mt-0.5">+18%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PRODUCT PREVIEW STRIP ============== */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="pill bg-accent text-primary-dark border border-primary/20 mx-auto">
            <Layers className="h-3 w-3" /> Product preview
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
            Один продукт — четыре сильных surface
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, title: "Live Map", desc: "Маркеры, фильтры и рекомендации в реальном времени.", to: "/map", accent: "teal" as const },
            { icon: HomeIcon, title: "Owner Studio", desc: "Создание листинга и TOUROSAT-анализ.", to: "/owner", accent: "gold" as const },
            { icon: Backpack, title: "Tourist Discover", desc: "AI-подборки, события и аудио-гиды.", to: "/tourist", accent: "emerald" as const },
            { icon: BarChart3, title: "Fund Cockpit", desc: "Live payment stream и AI-рекомендации.", to: "/dashboard", accent: "ink" as const },
          ].map((p, i) => {
            const a = accentMap[p.accent];
            return (
              <motion.button
                key={p.title}
                onClick={() => navigate(p.to)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -3 }}
                className="group text-left relative rounded-3xl p-5 bg-card border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:border-primary/30 transition-premium overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity ${a.glow}`} />
                <div className="relative">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border bg-gradient-to-br ${a.bg} ${a.ring} ${a.text} mb-3`}>
                    <p.icon className="h-4 w-4" strokeWidth={2.2} />
                  </div>
                  <p className="text-base font-extrabold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3">
                    Открыть
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ============== BOTTOM CTA ============== */}
      <section
        className="relative rounded-[2rem] overflow-hidden p-10 md:p-16 shadow-[var(--shadow-premium)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary-glow/40 rounded-full blur-3xl" />

        <div className="relative grid lg:grid-cols-12 gap-10 items-center text-primary-foreground">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-[11px] font-bold tracking-[0.18em] uppercase backdrop-blur">
              <Satellite className="h-3 w-3" /> Ready for demo · Series-A grade
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold font-display leading-[1.05] tracking-tight">
              От спутника — <span className="text-gold-light">к доходу</span> каждой юрты.
            </h2>
            <p className="text-base md:text-lg opacity-90 font-medium max-w-xl">
              Для владельцев — больше дохода. Для туристов — лучший выбор.
              Для Фонда — прозрачный поток и точные решения.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/map")}
              className="h-14 px-7 font-bold rounded-2xl bg-white text-primary-dark hover:bg-white/95 shadow-[var(--shadow-elevated)] justify-between group"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Открыть карту
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/owner")}
              variant="outline"
              className="h-14 px-7 font-bold rounded-2xl bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 hover:text-primary-foreground backdrop-blur justify-between group"
            >
              <span className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" /> Создать карточку Rest Point
              </span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="h-12 px-5 font-semibold rounded-2xl text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground justify-between"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Fund Dashboard
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
