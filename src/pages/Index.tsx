import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Satellite, Sparkles, TrendingUp } from "lucide-react";

const stats = [
  { value: "17", label: "Rest Points", accent: "primary" },
  { value: "$1.1B", label: "Туризм КР 2025", accent: "gold" },
  { value: "95%", label: "Не монетизированы", accent: "primary" },
  { value: "88/7/5", label: "Split-модель", accent: "success" },
];

const steps = [
  {
    icon: "🏠",
    title: "Владелец",
    desc: "AI создаёт карточку Rest Point на основе спутниковых данных и рассчитывает оптимальные цены.",
    cta: "Создать карточку",
    to: "/owner",
  },
  {
    icon: "🎒",
    title: "Турист",
    desc: "Выбирает услуги и оплачивает — деньги делятся автоматически по модели 88/7/5.",
    cta: "Оплатить услуги",
    to: "/tourist",
  },
  {
    icon: "📊",
    title: "Фонд",
    desc: "Видит живой поток платежей, AI-рекомендации и принимает решения по грантам.",
    cta: "Открыть дашборд",
    to: "/dashboard",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="relative pt-8 md:pt-16 pb-8">
        {/* Floating ornaments */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-gold/15 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border/60 shadow-sm">
            <Satellite className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Powered by TOUROSAT AI
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.05] tracking-tight">
            Цифровая монетизация{" "}
            <span className="text-gradient-premium">Rest Points</span>{" "}
            Кыргызстана
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            TamgaFlow подключает каждое село Иссык-Куля к мировому туризму
            через спутниковую AI-аналитику и прозрачное ценообразование.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/tourist")}
              className="h-12 px-7 text-base font-semibold shadow-[var(--shadow-premium)] bg-gradient-to-br from-primary to-primary-glow hover:opacity-95"
            >
              Попробовать оплату
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/map")}
              className="h-12 px-7 text-base font-semibold rounded-xl border-2 bg-card/60 backdrop-blur"
            >
              🗺 Открыть карту
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-16 max-w-4xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              className="glass rounded-2xl p-5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition-all"
            >
              <p
                className={`text-3xl md:text-4xl font-bold font-display tabular-nums ${
                  s.accent === "gold"
                    ? "text-[hsl(var(--gold))]"
                    : s.accent === "success"
                    ? "text-[hsl(var(--success))]"
                    : "text-primary"
                }`}
              >
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
            <Sparkles className="h-3 w-3 text-[hsl(var(--gold))]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--gold))]">
              Как это работает
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display">
            Три роли — одна экосистема
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <motion.button
              key={step.title}
              onClick={() => navigate(step.to)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group text-left relative overflow-hidden rounded-3xl p-7 bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition-all"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-colors" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-3xl shadow-sm border border-border/60">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-bold font-display text-muted-foreground/20 leading-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">
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
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-7 bg-card border border-destructive/20 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h3 className="text-xl font-bold font-display text-destructive">
              Проблема
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex gap-2"><span className="text-destructive">●</span>95% дохода — в 5 популярных местах</li>
            <li className="flex gap-2"><span className="text-destructive">●</span>Сёла не знают как привлечь туристов</li>
            <li className="flex gap-2"><span className="text-destructive">●</span>Нет данных для принятия решений</li>
            <li className="flex gap-2"><span className="text-destructive">●</span>Фонд не видит куда направлять гранты</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-7 bg-gradient-to-br from-card to-accent border border-primary/30 shadow-[var(--shadow-card)] relative overflow-hidden"
        >
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/15 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-success/15 flex items-center justify-center text-xl">
                <TrendingUp className="h-5 w-5 text-[hsl(var(--success))]" />
              </div>
              <h3 className="text-xl font-bold font-display text-[hsl(var(--success))]">
                TamgaFlow решает
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex gap-2"><span className="text-[hsl(var(--success))]">●</span>TOUROSAT AI оценивает каждую точку по спутнику</li>
              <li className="flex gap-2"><span className="text-[hsl(var(--success))]">●</span>Автоматическое ценообразование и карточка</li>
              <li className="flex gap-2"><span className="text-[hsl(var(--success))]">●</span>Прозрачный split: 88% / 7% / 5%</li>
              <li className="flex gap-2"><span className="text-[hsl(var(--success))]">●</span>Живой дашборд с AI-рекомендациями</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center text-primary-foreground shadow-[var(--shadow-premium)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative space-y-5 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-display leading-tight">
            Team THREATUX
          </h2>
          <p className="text-lg opacity-90">
            Tourism Revenue Hackathon 2025
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/owner")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95"
            >
              🏠 Владелец
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/tourist")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95"
            >
              🎒 Турист
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="h-12 px-6 font-semibold bg-white text-primary hover:bg-white/95"
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
