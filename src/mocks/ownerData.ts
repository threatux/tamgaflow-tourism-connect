// Owner-side mock data: TOUROSAT analysis, recommendations, forecast, ROI, dashboard

import { MOCK_LATENCY_MAX, MOCK_LATENCY_MIN } from "@/config";

const delay = (min = MOCK_LATENCY_MIN, max = MOCK_LATENCY_MAX) =>
  new Promise<void>((r) => setTimeout(r, min + Math.random() * (max - min)));

// ---------- Types ----------
export type EffortLevel = "low" | "medium" | "high";

export interface ImprovementRec {
  id: string;
  icon: string;
  title: string;
  reason: string;
  scoreUplift: number; // points
  revenueUpliftPct: number; // %
  effort: EffortLevel;
}

export interface MonthlyForecast {
  month: string;
  bookings: number;
  occupancyPct: number;
  revenue: number; // total gross
}

export interface AnalysisStrength {
  icon: string;
  label: string;
  detail: string;
}

export interface AnalysisWeakness {
  icon: string;
  label: string;
  detail: string;
}

export interface OwnerAnalysisResult {
  id: string;
  pointName: string;
  region: string;
  tourosatScore: number;
  confidence: number; // 0..1
  recommendedPrice: number; // KGS / night
  demandLevel: "Низкий" | "Средний" | "Высокий" | "Премиум";
  generatedDescription: string;
  strengths: AnalysisStrength[];
  weaknesses: AnalysisWeakness[];
  recommendations: ImprovementRec[];
  forecast: {
    seasonRevenue: number;
    avgMonthlyRevenue: number;
    expectedBookingsSeason: number;
    avgOccupancyPct: number;
    avgPrice: number;
    monthly: MonthlyForecast[];
  };
  metrics: {
    ndvi: number;
    distanceToWater: string;
    roadAccess: "Good" | "Average" | "Hard";
    competitors: number;
    altitude: string;
    viewpoint: "Excellent" | "Good" | "Average";
  };
  potentialScore: number; // if all recs applied
}

export interface OwnerListingDraft {
  description: string;
  lat: number;
  lon: number;
  amenities?: string[];
  capacity?: number;
}

// ---------- Mock generation ----------
const RECOMMENDATIONS_POOL: ImprovementRec[] = [
  {
    id: "wifi",
    icon: "📶",
    title: "Добавить Wi-Fi",
    reason: "Туристы фильтруют точки с интернетом — особенно зарубежные гости и удалённые работники.",
    scoreUplift: 12,
    revenueUpliftPct: 14,
    effort: "low",
  },
  {
    id: "photo-spot",
    icon: "📸",
    title: "Создать фото-зону с видом",
    reason: "Живописные фото-точки увеличивают шеры в соцсетях и привлекают новых гостей.",
    scoreUplift: 8,
    revenueUpliftPct: 9,
    effort: "low",
  },
  {
    id: "parking",
    icon: "🅿️",
    title: "Указать парковку и подъезд",
    reason: "Чёткая информация о парковке повышает доверие и конверсию в бронирование.",
    scoreUplift: 15,
    revenueUpliftPct: 11,
    effort: "low",
  },
  {
    id: "exterior-photos",
    icon: "🖼",
    title: "Загрузить экстерьерные фото при дневном свете",
    reason: "Качественные фото повышают воспринимаемое качество и оправдывают премиальную цену.",
    scoreUplift: 6,
    revenueUpliftPct: 8,
    effort: "medium",
  },
  {
    id: "breakfast",
    icon: "🍳",
    title: "Добавить меню завтраков",
    reason: "Готовое питание — топ-фактор выбора для семей и пар.",
    scoreUplift: 9,
    revenueUpliftPct: 12,
    effort: "medium",
  },
  {
    id: "road-clarity",
    icon: "🛣",
    title: "Уточнить тип дороги к точке",
    reason: "Снижает страх «не доеду» — особенно для городских туристов на седанах.",
    scoreUplift: 7,
    revenueUpliftPct: 5,
    effort: "low",
  },
  {
    id: "horse-tour",
    icon: "🐎",
    title: "Запустить конную прогулку",
    reason: "Конные туры — главный мотиватор поездки в высокогорье. Хорошая маржа.",
    scoreUplift: 11,
    revenueUpliftPct: 22,
    effort: "high",
  },
  {
    id: "english-info",
    icon: "🌍",
    title: "Добавить описание на английском",
    reason: "Иностранные туристы платят в среднем на 35% больше за ночь.",
    scoreUplift: 5,
    revenueUpliftPct: 18,
    effort: "low",
  },
];

const STRENGTHS_POOL: AnalysisStrength[] = [
  { icon: "🏔", label: "Видовые качества", detail: "Открытые панорамы Тянь-Шаня по NDVI и DEM" },
  { icon: "🛣", label: "Удобный доступ", detail: "Дорога 4G, до асфальта менее 2 км" },
  { icon: "💧", label: "Близко к воде", detail: "Озеро/река в радиусе 1.5 км" },
  { icon: "🌿", label: "Высокая зелень", detail: "NDVI > 0.55 — здоровая растительность" },
  { icon: "🏕", label: "Низкая конкуренция", detail: "Менее 4 точек в радиусе 5 км" },
];

const WEAKNESSES_POOL: AnalysisWeakness[] = [
  { icon: "📶", label: "Нет данных о Wi-Fi", detail: "Это снижает рейтинг у молодых туристов" },
  { icon: "🖼", label: "Мало фотографий", detail: "Минимум 6 фото для премиум-листинга" },
  { icon: "🍽", label: "Нет описания питания", detail: "Добавьте меню или схему завтраков" },
  { icon: "🚗", label: "Не указана парковка", detail: "Туристы боятся ехать без чёткой info" },
];

const REGIONS = ["Иссык-Куль", "Нарын", "Талас", "Чуй", "Ош", "Джалал-Абад", "Баткен"];

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function buildMonthly(base: number, occupancyBase: number): MonthlyForecast[] {
  const months = ["Май", "Июнь", "Июль", "Август", "Сент.", "Окт."];
  // Seasonal curve (peak July-August)
  const curve = [0.45, 0.85, 1.0, 0.95, 0.7, 0.45];
  return months.map((m, i) => {
    const occ = Math.min(95, Math.round(occupancyBase * curve[i]));
    const bookings = Math.round((occ / 100) * 30);
    const revenue = Math.round(base * bookings);
    return { month: m, bookings, occupancyPct: occ, revenue };
  });
}

function generateDescription(input: string): string {
  const seed = input.trim().split(/[.,\n]/)[0] || "Юрточный лагерь";
  return `${seed} — гостеприимное место отдыха в самом сердце Кыргызстана. Просыпайтесь под пение горных птиц, наслаждайтесь национальной кухней у очага и встречайте закат среди величественных пейзажей. Идеально для семей, пар и путешественников, ценящих аутентичность, природу и тишину. Гостеприимные хозяева помогут организовать конные прогулки, треккинг и знакомство с традициями кочевников.`;
}

export async function analyzeWithTourosat(draft: OwnerListingDraft): Promise<OwnerAnalysisResult> {
  // Longer, dramatic delay (feels like satellite analysis)
  await delay(1800, 2600);

  const score = Math.round(58 + Math.random() * 34);
  const confidence = +(0.78 + Math.random() * 0.18).toFixed(2);
  const basePrice = Math.round(2200 + (score / 100) * 4800);
  const avgOccupancy = Math.round(48 + (score - 60) * 0.7);
  const monthly = buildMonthly(basePrice, Math.max(35, avgOccupancy));
  const seasonRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const expectedBookings = monthly.reduce((s, m) => s + m.bookings, 0);
  const recommendations = pick(RECOMMENDATIONS_POOL, 5);
  const potentialScore = Math.min(98, score + recommendations.reduce((s, r) => s + Math.round(r.scoreUplift * 0.45), 0));
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

  return {
    id: `tf-${Math.random().toString(16).slice(2, 10)}`,
    pointName: draft.description.split(/[.,\n]/)[0].slice(0, 40) || "Новый Rest Point",
    region,
    tourosatScore: score,
    confidence,
    recommendedPrice: basePrice,
    demandLevel: score >= 85 ? "Премиум" : score >= 70 ? "Высокий" : score >= 55 ? "Средний" : "Низкий",
    generatedDescription: generateDescription(draft.description),
    strengths: pick(STRENGTHS_POOL, 4),
    weaknesses: pick(WEAKNESSES_POOL, 3),
    recommendations,
    forecast: {
      seasonRevenue,
      avgMonthlyRevenue: Math.round(seasonRevenue / monthly.length),
      expectedBookingsSeason: expectedBookings,
      avgOccupancyPct: Math.round(monthly.reduce((s, m) => s + m.occupancyPct, 0) / monthly.length),
      avgPrice: basePrice,
      monthly,
    },
    metrics: {
      ndvi: +(0.4 + Math.random() * 0.4).toFixed(2),
      distanceToWater: `${(0.4 + Math.random() * 3).toFixed(1)} км`,
      roadAccess: score >= 75 ? "Good" : score >= 55 ? "Average" : "Hard",
      competitors: Math.floor(Math.random() * 6) + 1,
      altitude: `${Math.round(1500 + Math.random() * 1800)} м`,
      viewpoint: score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Average",
    },
    potentialScore,
  };
}

// ---------- AI rewrite ----------
const REWRITE_VARIANTS: Record<string, (text: string) => string> = {
  premium: (text) =>
    `Эксклюзивный приют посреди величественных гор Кыргызстана. ${text} Каждая деталь продумана для гостей, ценящих премиальный отдых: тёплые юрты с натуральным текстилем, авторская кухня от шеф-повара, конные прогулки с опытными проводниками и виды, ради которых стоит ехать через полмира.`,
  warm: (text) =>
    `Добро пожаловать в наш дом среди гор. ${text} Здесь вас встретит настоящее кыргызское гостеприимство: горячий чай у очага, домашние лепёшки и истории, которые передаются из поколения в поколение. Уезжать не захочется.`,
  short: (text) => {
    const first = text.split(".")[0];
    return `${first}. Природа, тишина, аутентичность — всё включено.`;
  },
  family: (text) =>
    `Идеальное место для семейного отдыха. ${text} Безопасная территория, мягкие пастбища для детских игр, домашние животные, простые тропы для прогулок и тёплая атмосфера. Дети полюбят это место с первой минуты.`,
  english: () =>
    `A serene yurt camp nestled in the heart of Kyrgyzstan's majestic mountains. Wake up to alpine breeze, taste authentic nomadic cuisine by the open fire, and experience genuine Central Asian hospitality. Perfect for families, couples and adventurous travelers seeking nature, culture and tranquility.`,
};

export async function rewriteDescription(text: string, mode: keyof typeof REWRITE_VARIANTS): Promise<string> {
  await delay(900, 1400);
  return REWRITE_VARIANTS[mode]?.(text) ?? text;
}

// ---------- Owner Dashboard ----------
export interface OwnerDashboardData {
  kpi: {
    views: number;
    impressions: number;
    saves: number;
    bookings: number;
    conversionPct: number;
    revenueGross: number;
    ownerShare: number; // 88%
    avgScore: number;
    avgPrice: number;
  };
  trend: { day: string; bookings: number; revenue: number }[];
  comparison: {
    yourScore: number;
    nearbyAvgScore: number;
    yourPrice: number;
    nearbyAvgPrice: number;
    yourVisibility: number; // index 0..100
    nearbyAvgVisibility: number;
  };
  recentBookings: {
    date: string;
    guest: string;
    country: string;
    nights: number;
    gross: number;
    payout: number;
  }[];
}

export async function getOwnerDashboard(): Promise<OwnerDashboardData> {
  await delay();
  const trend = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d, i) => ({
    day: d,
    bookings: Math.floor(2 + Math.random() * 8 + (i > 4 ? 4 : 0)),
    revenue: Math.floor(8000 + Math.random() * 22000 + (i > 4 ? 12000 : 0)),
  }));
  const revenueGross = trend.reduce((s, t) => s + t.revenue, 0);
  return {
    kpi: {
      views: 1248,
      impressions: 8420,
      saves: 187,
      bookings: trend.reduce((s, t) => s + t.bookings, 0),
      conversionPct: 4.6,
      revenueGross,
      ownerShare: Math.round(revenueGross * 0.88),
      avgScore: 78,
      avgPrice: 5400,
    },
    trend,
    comparison: {
      yourScore: 78,
      nearbyAvgScore: 64,
      yourPrice: 5400,
      nearbyAvgPrice: 4200,
      yourVisibility: 82,
      nearbyAvgVisibility: 58,
    },
    recentBookings: [
      { date: "23 Апр", guest: "Marco R.", country: "🇩🇪 Германия", nights: 3, gross: 19500, payout: 17160 },
      { date: "22 Апр", guest: "Алексей П.", country: "🇷🇺 Россия", nights: 2, gross: 11200, payout: 9856 },
      { date: "21 Апр", guest: "Sarah K.", country: "🇺🇸 США", nights: 4, gross: 24800, payout: 21824 },
      { date: "20 Апр", guest: "Айгуль Б.", country: "🇰🇬 КР", nights: 1, gross: 5400, payout: 4752 },
      { date: "19 Апр", guest: "Tanaka H.", country: "🇯🇵 Япония", nights: 5, gross: 32500, payout: 28600 },
    ],
  };
}
