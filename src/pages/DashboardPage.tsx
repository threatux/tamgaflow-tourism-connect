import { motion } from "framer-motion";
import {
  Activity,
  Banknote,
  Building2,
  CalendarRange,
  LineChart,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { KpiCard } from "@/components/fund/KpiCard";
import { LivePaymentStream } from "@/components/fund/LivePaymentStream";
import { FundAiRecCard } from "@/components/fund/FundAiRecCard";
import { RegionalAnalytics } from "@/components/fund/RegionalAnalytics";
import { ImpactForecast } from "@/components/fund/ImpactForecast";
import { RankingsBlock } from "@/components/fund/RankingsBlock";
import { TransactionsTable } from "@/components/fund/TransactionsTable";
import { FUND_AI_RECS, FUND_KPIS } from "@/mocks/fundData";

const KPI_META = [
  { icon: Banknote, accent: "teal" as const },
  { icon: TrendingUp, accent: "gold" as const },
  { icon: Building2, accent: "ink" as const },
  { icon: Star, accent: "emerald" as const },
  { icon: CalendarRange, accent: "teal" as const },
  { icon: LineChart, accent: "gold" as const },
];

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: typeof Sparkles;
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
    <div>
      <div className="inline-flex items-center gap-2 mb-2">
        <span className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-dark">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-dark">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground tracking-tight">
        {title}
      </h2>
      <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="space-y-10 sm:space-y-14 animate-fade-in max-w-[1320px] mx-auto pb-8 sm:pb-12">
      {/* Executive header */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-border/80 bg-gradient-to-br from-card via-card to-accent/40 p-5 sm:p-8 md:p-10 shadow-[var(--shadow-card)]"
      >
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full blur-3xl bg-primary/15" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full blur-3xl bg-gold/15" />

        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-primary/20 backdrop-blur-sm max-w-full">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-dark shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-primary-dark truncate">
                Tourism Development Fund · Decision Cockpit
              </span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-[52px] font-extrabold font-display tracking-tight leading-[1.05]">
              Дашборд <span className="text-gradient-teal">Фонда развития</span>
              <br />
              туризма Кыргызстана
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Реальное движение туристических платежей, аналитика TOUROSAT AI и сценарии распределения средств.
              Доля Фонда — <span className="font-bold text-gold-deep">12%</span> от каждой транзакции в системе TamgaFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-2xl bg-card border border-border px-4 sm:px-5 py-4 shadow-sm sm:min-w-[180px]">
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-muted-foreground">
                Источники данных
              </p>
              <p className="text-[12px] sm:text-[13px] text-foreground mt-1 leading-snug">
                Sentinel-2 · MODIS · SRTM · TamgaFlow Ledger
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-primary-foreground px-4 sm:px-5 py-4 shadow-[var(--shadow-glow-teal)]">
              <p className="text-[10px] uppercase tracking-[0.16em] font-bold opacity-80">Status</p>
              <p className="text-[12px] sm:text-[13px] mt-1 font-bold inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live · 12% Fund layer active
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* KPI grid */}
      <section>
        <SectionHeader
          eyebrow="Executive overview"
          title="Ключевые показатели"
          subtitle="Финансовое состояние, активность сети и качество, рассчитанное TOUROSAT AI."
          icon={Activity}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUND_KPIS.map((k, i) => (
            <KpiCard key={k.key} kpi={k} icon={KPI_META[i].icon} accent={KPI_META[i].accent} index={i} />
          ))}
        </div>
      </section>

      {/* Live stream — hero */}
      <section>
        <SectionHeader
          eyebrow="Live operations"
          title="Поток транзакций в реальном времени"
          subtitle="Каждая транзакция автоматически отделяет 12% в Фонд. Поток обновляется каждые несколько секунд."
          icon={Activity}
        />
        <LivePaymentStream />
      </section>

      {/* AI recommendations */}
      <section>
        <SectionHeader
          eyebrow="AI decision support"
          title="Куда направить поддержку Фонда"
          subtitle="Приоритизация на основе TOUROSAT Score, регионального спроса и потенциальной отдачи. Рекомендации сформированы AI-моделью TamgaFlow."
          icon={Sparkles}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FUND_AI_RECS.map((rec, i) => (
            <FundAiRecCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      </section>

      {/* Regional analytics */}
      <section>
        <SectionHeader
          eyebrow="Regional intelligence"
          title="Карта распределения дохода"
          subtitle="Где формируется оборот и доля Фонда. Помогает определить регионы с дефицитом инфраструктуры и точки роста."
          icon={LineChart}
        />
        <RegionalAnalytics />
      </section>

      {/* Forecast */}
      <section>
        <SectionHeader
          eyebrow="Impact & growth"
          title="Прогноз и сценарии расширения сети"
          subtitle="Сезонная динамика дохода Фонда и моделирование подключения новых Rest Points с прогнозом дополнительного финансирования."
          icon={TrendingUp}
        />
        <ImpactForecast />
      </section>

      {/* Rankings */}
      <section>
        <SectionHeader
          eyebrow="Top performers"
          title="Рейтинги Rest Points"
          subtitle="Топ по обороту, по AI-оценке и стратегические возможности с потенциалом роста."
          icon={Star}
        />
        <RankingsBlock />
      </section>

      {/* Transactions */}
      <section>
        <SectionHeader
          eyebrow="Operations ledger"
          title="Журнал транзакций"
          subtitle="Полная финансовая операционная таблица с фильтрацией, сортировкой и экспортом в CSV."
          icon={Banknote}
        />
        <TransactionsTable />
      </section>
    </div>
  );
};

export default DashboardPage;
