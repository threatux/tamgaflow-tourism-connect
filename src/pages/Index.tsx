import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Satellite, Sparkles, TrendingUp, MapPin } from "lucide-react";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";

const stats = [
  { value: "17", label: "Rest Points", color: "primary" },
  { value: "$1.1B", label: "Туризм КР 2025", color: "gold" },
  { value: "88%", label: "Владельцу", color: "success" },
  { value: "12%", label: "Платформе", color: "primary" },
];

const steps = [
  {
    icon: "🏠",
    title: "Владелец",
    desc: "TOUROSAT AI создаёт карточку Rest Point по спутниковым данным и считает оптимальные цены.",
    cta: "Создать карточку",
    to: "/owner",
  },
  {
    icon: "🎒",
    title: "Турист",
    desc: "Выбирает услуги и оплачивает — деньги делятся прозрачно: 88% владельцу, 12% платформе.",
    cta: "Оплатить услуги",
    to: "/tourist",
  },
  {
    icon: "📊",
    title: "Фонд",
    desc: "Видит живой поток платежей, AI-рекомендации и принимает решения по грантам в реальном времени.",
    cta: "Открыть дашборд",
    to: "/dashboard",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-32">
      {/* HERO */}
      <section className="relative pt-8 md:pt-16 pb-8">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute top-10 right-[5%] w-[36rem] h-[36rem] bg-primary/15 rounded-full blur-[140px] -z-10" />
        <div className="pointer-events-none absolute top-40 left-[5%] w-[30rem] h-[30rem] bg-gold/10 rounded-full blur-[140px] -z-10" />
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] bg-success/8 rounded-full blur-[160px] -z-10" />

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
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
                Powered by TOUROSAT
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold font-display leading-[1.02] tracking-[-0.03em] text-balance">
              Каждый Rest Point.<br />
              Каждый турист. <span className="text-gradient-gold">Каждый сом</span>
              <span className="text-muted-foreground/80"> — на своём месте.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[58ch] leading-relaxed">
              Платформа, которая превращает локальные Rest Points Кыргызстана
              в реальный доход — с самого первого туриста.
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

            {/* Trust row */}
            <div className="pt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">
                Geo-Verification Stack
              </span>
              <div className="flex items-center gap-6 text-[11px] font-bold tracking-wider text-muted-foreground">
                <span>🛰 Sentinel-2</span>
                <span>🗺 SRTM</span>
                <span>🌍 MODIS</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Live showcase cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Score card */}
            <div className="glass-strong rounded-[2rem] p-7 shadow-[var(--shadow-premium)] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-5 relative">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  TOUROSAT Score
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-success/10 text-success-deep border border-success/20">
                  Live · 14m ago
                </span>
              </div>
              <div className="flex flex-col items-center relative">
                <TourosatScore score={92} confidence={0.92} size="lg" />
              </div>
            </div>

            {/* Split mini card — overlapping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="glass-strong rounded-3xl p-5 shadow-[var(--shadow-elevated)] mt-5 relative animate-ambient"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                  Payment Split
                </span>
                <span className="text-sm font-extrabold font-display tabular-nums text-foreground">
                  6,550 KGS
                </span>
              </div>
              <SplitVisualization total={6550} compact />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-20"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="rounded-2xl p-5 bg-card border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-premium"
            >
              <p
                className={`text-3xl md:text-4xl font-extrabold font-display tabular-nums tracking-tight ${
                  s.color === "gold"
                    ? "text-gradient-gold"
                    : s.color === "success"
                    ? "text-success-deep"
                    : "text-primary"
                }`}
              >
                {s.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-semibold uppercase tracking-wider">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30">
            <Sparkles className="h-3 w-3 text-gold-deep" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-deep">
              Как это работает
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Три роли — одна экосистема
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Прозрачный split в момент оплаты. Каждый сом виден и каждому понятно, куда он ушёл.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.button
              key={step.title}
              onClick={() => navigate(step.to)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group text-left relative overflow-hidden rounded-3xl p-7 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-premium"
            >
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-colors" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-3xl shadow-sm border border-border/60">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-extrabold font-display text-muted-foreground/15 leading-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold font-display text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary pt-2">
                  {step.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 bg-card border border-destructive/15 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h3 className="text-2xl font-extrabold font-display text-destructive">
              Проблема
            </h3>
          </div>
          <ul className="space-y-3 text-[15px] text-foreground/85 leading-relaxed">
            <li className="flex gap-2.5"><span className="text-destructive mt-1.5">●</span><span>95% дохода — в 5 популярных местах</span></li>
            <li className="flex gap-2.5"><span className="text-destructive mt-1.5">●</span><span>Сёла не знают как привлечь туристов</span></li>
            <li className="flex gap-2.5"><span className="text-destructive mt-1.5">●</span><span>Нет данных для принятия решений</span></li>
            <li className="flex gap-2.5"><span className="text-destructive mt-1.5">●</span><span>Фонд не видит, куда направлять гранты</span></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 bg-gradient-to-br from-card to-accent border border-primary/30 shadow-[var(--shadow-elevated)] relative overflow-hidden"
        >
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-primary/15 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-success/15 flex items-center justify-center text-xl">
                <TrendingUp className="h-5 w-5 text-success-deep" />
              </div>
              <h3 className="text-2xl font-extrabold font-display text-success-deep">
                TamgaFlow решает
              </h3>
            </div>
            <ul className="space-y-3 text-[15px] text-foreground/85 leading-relaxed">
              <li className="flex gap-2.5"><span className="text-success-deep mt-1.5">●</span><span>TOUROSAT AI оценивает каждую точку по спутнику</span></li>
              <li className="flex gap-2.5"><span className="text-success-deep mt-1.5">●</span><span>Автоматическое ценообразование и карточка</span></li>
              <li className="flex gap-2.5"><span className="text-success-deep mt-1.5">●</span><span>Прозрачный split: <strong>88% владельцу · 12% платформе</strong></span></li>
              <li className="flex gap-2.5"><span className="text-success-deep mt-1.5">●</span><span>Живой дашборд с AI-рекомендациями</span></li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center shadow-[var(--shadow-premium)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative space-y-6 max-w-2xl mx-auto text-primary-foreground">
          <h2 className="text-4xl md:text-6xl font-extrabold font-display leading-tight tracking-tight">
            Team THREATUX
          </h2>
          <p className="text-lg md:text-xl opacity-90 font-medium">
            Tourism Revenue Hackathon 2025 · Powered by TOUROSAT
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/owner")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95 rounded-xl"
            >
              🏠 Владелец
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/tourist")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95 rounded-xl"
            >
              🎒 Турист
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95 rounded-xl"
            >
              📊 Дашборд
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
