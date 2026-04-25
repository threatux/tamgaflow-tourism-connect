import { MOCK_REST_POINTS, type MockRestPoint } from "./restPoints";

export const FUND_SHARE_RATE = 0.12; // 12% Platform/Fund share (88/12 split)

export type TransactionStatus = "completed" | "processing" | "settled";

export interface FundTransaction {
  id: string;
  timestamp: number; // ms
  pointId: string;
  pointName: string;
  region: string;
  payer: string;
  payerCountry: string;
  payerFlag: string;
  grossAmount: number;
  fundShare: number;
  status: TransactionStatus;
  tourosatScore: number;
  method: "Visa" | "Mastercard" | "Elcart" | "MBank" | "O!Dengi";
}

export interface FundKpi {
  key: string;
  label: string;
  value: number;
  format: "currency" | "number" | "decimal";
  delta: number; // percentage
  sparkline: number[];
  hint: string;
}

export interface FundAiRec {
  id: string;
  pointId: string;
  pointName: string;
  region: string;
  score: number;
  priority: "High" | "Medium" | "Strategic";
  tag: "Infrastructure" | "Marketing" | "Onboarding" | "Partnership" | "Quality";
  insight: string;
  action: string;
  supportAmount: number;
  potentialUplift: { score: number; revenue: number; fundGain: number };
}

export interface RegionStat {
  region: string;
  revenue: number;
  fundShare: number;
  activePoints: number;
  avgScore: number;
  bookings: number;
}

export interface ForecastScenario {
  id: string;
  label: string;
  addedPoints: number;
  addedBookings: number;
  addedGmv: number;
  addedFundShare: number;
  scoreImpact: number;
  region: string;
}

const PAYERS: { name: string; country: string; flag: string }[] = [
  { name: "Marco R.", country: "Германия", flag: "🇩🇪" },
  { name: "Sarah K.", country: "США", flag: "🇺🇸" },
  { name: "Tanaka H.", country: "Япония", flag: "🇯🇵" },
  { name: "Алексей В.", country: "Россия", flag: "🇷🇺" },
  { name: "Emma L.", country: "Франция", flag: "🇫🇷" },
  { name: "Айгерим Т.", country: "Кыргызстан", flag: "🇰🇬" },
  { name: "Liu Wei", country: "Китай", flag: "🇨🇳" },
  { name: "Oliver S.", country: "Великобритания", flag: "🇬🇧" },
  { name: "Bota N.", country: "Казахстан", flag: "🇰🇿" },
  { name: "Diego M.", country: "Испания", flag: "🇪🇸" },
];

const METHODS: FundTransaction["method"][] = ["Visa", "Mastercard", "Elcart", "MBank", "O!Dengi"];

let txCounter = 0;
const nextId = () => `tx-${Date.now().toString(36)}-${(++txCounter).toString(36)}`;

export const generateTransaction = (offsetMs = 0): FundTransaction => {
  const point = MOCK_REST_POINTS[Math.floor(Math.random() * MOCK_REST_POINTS.length)];
  const payer = PAYERS[Math.floor(Math.random() * PAYERS.length)];
  // Realistic spread around recommended price
  const variance = 0.6 + Math.random() * 0.9;
  const gross = Math.round((point.recommendedPrice * variance) / 50) * 50;
  const fundShare = Math.round(gross * FUND_SHARE_RATE);
  const statuses: TransactionStatus[] = ["completed", "completed", "completed", "settled", "processing"];
  return {
    id: nextId(),
    timestamp: Date.now() - offsetMs,
    pointId: point.id,
    pointName: point.name,
    region: point.region,
    payer: payer.name,
    payerCountry: payer.country,
    payerFlag: payer.flag,
    grossAmount: gross,
    fundShare,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    tourosatScore: point.tourosatScore,
    method: METHODS[Math.floor(Math.random() * METHODS.length)],
  };
};

// Pre-seed an initial transaction history (last ~6 hours)
export const seedTransactions = (count = 24): FundTransaction[] => {
  const list: FundTransaction[] = [];
  for (let i = 0; i < count; i++) {
    list.push(generateTransaction(i * 60_000 * (3 + Math.random() * 9)));
  }
  return list.sort((a, b) => b.timestamp - a.timestamp);
};

// ── Aggregates ────────────────────────────────────────────────────────────────
const totalGmv = MOCK_REST_POINTS.reduce((s, p) => s + p.revenueSom * 6, 0); // season-ish
const totalFund = Math.round(totalGmv * FUND_SHARE_RATE);
const totalBookings = MOCK_REST_POINTS.reduce((s, p) => s + p.transactionsToday * 6, 0);
const avgScore =
  MOCK_REST_POINTS.reduce((s, p) => s + p.tourosatScore, 0) / MOCK_REST_POINTS.length;

const spark = (base: number, variance = 0.15, n = 14) =>
  Array.from({ length: n }, (_, i) => {
    const trend = i / n;
    const noise = (Math.random() - 0.4) * variance;
    return Math.max(0, base * (0.7 + trend * 0.5 + noise));
  });

export const FUND_KPIS: FundKpi[] = [
  {
    key: "gmv",
    label: "Общий оборот (GMV)",
    value: totalGmv,
    format: "currency",
    delta: 12.4,
    sparkline: spark(totalGmv / 14),
    hint: "Сумма всех транзакций сезона",
  },
  {
    key: "fund",
    label: "Доля Фонда (12%)",
    value: totalFund,
    format: "currency",
    delta: 14.1,
    sparkline: spark(totalFund / 14, 0.18),
    hint: "Поступления в Фонд развития туризма",
  },
  {
    key: "points",
    label: "Активные Rest Points",
    value: MOCK_REST_POINTS.length,
    format: "number",
    delta: 8.7,
    sparkline: spark(MOCK_REST_POINTS.length / 2, 0.08),
    hint: "Точки, генерирующие транзакции",
  },
  {
    key: "score",
    label: "Средний TOUROSAT Score",
    value: avgScore,
    format: "decimal",
    delta: 3.2,
    sparkline: spark(avgScore / 14, 0.05),
    hint: "Среднее качество сети по AI-оценке",
  },
  {
    key: "bookings",
    label: "Бронирований / сезон",
    value: totalBookings,
    format: "number",
    delta: 22.6,
    sparkline: spark(totalBookings / 14, 0.2),
    hint: "Подтверждённые транзакции",
  },
  {
    key: "forecast",
    label: "Прогноз дохода Фонда",
    value: Math.round(totalFund * 1.34),
    format: "currency",
    delta: 18.9,
    sparkline: spark(totalFund / 12, 0.22),
    hint: "Сценарий конца сезона",
  },
];

// ── AI Recommendations ────────────────────────────────────────────────────────
const findPoint = (id: string): MockRestPoint | undefined =>
  MOCK_REST_POINTS.find((p) => p.id === id);

const buildRec = (
  pointId: string,
  priority: FundAiRec["priority"],
  tag: FundAiRec["tag"],
  insight: string,
  action: string,
  supportAmount: number,
  uplift: { score: number; revenue: number },
): FundAiRec | null => {
  const p = findPoint(pointId);
  if (!p) return null;
  return {
    id: `rec-${pointId}`,
    pointId,
    pointName: p.name,
    region: p.region,
    score: p.tourosatScore,
    priority,
    tag,
    insight,
    action,
    supportAmount,
    potentialUplift: {
      score: uplift.score,
      revenue: uplift.revenue,
      fundGain: Math.round(uplift.revenue * FUND_SHARE_RATE),
    },
  };
};

export const FUND_AI_RECS: FundAiRec[] = [
  buildRec(
    "altyn-arashan",
    "High",
    "Infrastructure",
    "Высокий потенциал (NDVI 0.71, термальные источники), но Hard road access ограничивает поток туристов.",
    "Микро-грант на улучшение подъездной дороги и санитарной инфраструктуры.",
    50_000,
    { score: 14, revenue: 320_000 },
  ),
  buildRec(
    "barskoon",
    "Medium",
    "Marketing",
    "Стабильный спрос и сильная локация у входа в ущелье. Слабая видимость в международном поиске.",
    "Сезонная маркетинговая поддержка и продвижение в EN/RU/KG каналах.",
    35_000,
    { score: 9, revenue: 240_000 },
  ),
  buildRec(
    "jeti-oguz",
    "High",
    "Quality",
    "Уникальная природа (Score 81), но низкое качество фото и описания снижают конверсию.",
    "Онбординг-поддержка: профессиональная съёмка + AI-копирайтинг листинга.",
    18_000,
    { score: 7, revenue: 180_000 },
  ),
  buildRec(
    "tamga",
    "Strategic",
    "Partnership",
    "Топ-перформер сети (Score 92). Кандидат для якорного партнёрства и эталонной точки.",
    "Партнёрский статус Premium + витрина для региональной экспансии.",
    0,
    { score: 4, revenue: 410_000 },
  ),
  buildRec(
    "son-kul",
    "Strategic",
    "Marketing",
    "Сильный кочевой бренд (Score 88). Идеальная локация для международной кампании «Звёзды Сон-Куля».",
    "Кампания по культурному туризму совместно с Фондом и Минкультуры.",
    65_000,
    { score: 6, revenue: 520_000 },
  ),
  buildRec(
    "cholpon-ata",
    "Medium",
    "Onboarding",
    "Высокий трафик, но фрагментированное предложение. Нужна агрегация мелких владельцев.",
    "Программа онбординга для 15+ малых гестхаусов в районе.",
    42_000,
    { score: 11, revenue: 380_000 },
  ),
].filter((r): r is FundAiRec => r !== null);

// ── Regional analytics ───────────────────────────────────────────────────────
export const REGION_STATS: RegionStat[] = (() => {
  const map = new Map<string, RegionStat>();
  MOCK_REST_POINTS.forEach((p) => {
    const existing = map.get(p.region) ?? {
      region: p.region,
      revenue: 0,
      fundShare: 0,
      activePoints: 0,
      avgScore: 0,
      bookings: 0,
    };
    existing.revenue += p.revenueSom * 6;
    existing.bookings += p.transactionsToday * 6;
    existing.activePoints += 1;
    existing.avgScore += p.tourosatScore;
    map.set(p.region, existing);
  });
  return Array.from(map.values())
    .map((r) => ({
      ...r,
      avgScore: Math.round(r.avgScore / r.activePoints),
      fundShare: Math.round(r.revenue * FUND_SHARE_RATE),
    }))
    .sort((a, b) => b.revenue - a.revenue);
})();

// ── Top rankings ─────────────────────────────────────────────────────────────
export const TOP_BY_REVENUE = [...MOCK_REST_POINTS]
  .map((p) => ({ ...p, seasonRevenue: p.revenueSom * 6 }))
  .sort((a, b) => b.seasonRevenue - a.seasonRevenue)
  .slice(0, 10);

export const TOP_BY_SCORE = [...MOCK_REST_POINTS]
  .sort((a, b) => b.tourosatScore - a.tourosatScore)
  .slice(0, 10);

export const STRATEGIC_OPPORTUNITIES = [...MOCK_REST_POINTS]
  .filter((p) => p.tourosatScore < 70 && p.metrics.ndvi > 0.55)
  .sort((a, b) => b.metrics.ndvi - a.metrics.ndvi)
  .slice(0, 5);

// ── Growth forecast ──────────────────────────────────────────────────────────
export interface GrowthPoint {
  month: string;
  gmv: number;
  fund: number;
  points: number;
}

export const GROWTH_TIMELINE: GrowthPoint[] = (() => {
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  let basePoints = 8;
  let baseGmv = totalGmv * 0.04;
  return months.map((m, i) => {
    const seasonal = 1 + 0.55 * Math.sin(((i - 2) / 12) * Math.PI * 2);
    basePoints += i < 8 ? 2 + Math.floor(Math.random() * 3) : 1;
    baseGmv = totalGmv * (0.04 + i * 0.012) * seasonal;
    return {
      month: m,
      gmv: Math.round(baseGmv),
      fund: Math.round(baseGmv * FUND_SHARE_RATE),
      points: Math.min(basePoints, MOCK_REST_POINTS.length + 30),
    };
  });
})();

const avgRevenuePerPoint =
  MOCK_REST_POINTS.reduce((s, p) => s + p.revenueSom * 6, 0) / MOCK_REST_POINTS.length;

export const FORECAST_SCENARIOS: ForecastScenario[] = [
  {
    id: "s1",
    label: "+20 Rest Points",
    addedPoints: 20,
    addedBookings: 20 * 60,
    addedGmv: Math.round(avgRevenuePerPoint * 20 * 0.85),
    addedFundShare: Math.round(avgRevenuePerPoint * 20 * 0.85 * FUND_SHARE_RATE),
    scoreImpact: 2,
    region: "Иссык-Куль · Нарын",
  },
  {
    id: "s2",
    label: "+50 Rest Points",
    addedPoints: 50,
    addedBookings: 50 * 55,
    addedGmv: Math.round(avgRevenuePerPoint * 50 * 0.78),
    addedFundShare: Math.round(avgRevenuePerPoint * 50 * 0.78 * FUND_SHARE_RATE),
    scoreImpact: 4,
    region: "Все регионы",
  },
  {
    id: "s3",
    label: "+100 Rest Points",
    addedPoints: 100,
    addedBookings: 100 * 50,
    addedGmv: Math.round(avgRevenuePerPoint * 100 * 0.72),
    addedFundShare: Math.round(avgRevenuePerPoint * 100 * 0.72 * FUND_SHARE_RATE),
    scoreImpact: 6,
    region: "Национальный охват",
  },
];

// ── Formatters ───────────────────────────────────────────────────────────────
export const fmtCurrency = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M сом";
  if (n >= 1_000) return Math.round(n).toLocaleString("ru-RU") + " сом";
  return n.toLocaleString("ru-RU") + " сом";
};

export const fmtNumber = (n: number): string => Math.round(n).toLocaleString("ru-RU");
export const fmtDecimal = (n: number): string => n.toFixed(1);

export const fmtTime = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
};

export const fmtRelative = (ts: number): string => {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return `${h}h`;
};
