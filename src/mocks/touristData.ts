// Tourist-facing mock data: imagery, events, audio guides, reviews,
// cultural tips, travel-style tags, transport options, and AI replies.

import { MOCK_REST_POINTS, type MockRestPoint } from "./restPoints";
import heroIssyk from "@/assets/hero-issyk-kul.jpg";
import imgSongkul from "@/assets/rp-songkul.jpg";
import imgJeti from "@/assets/rp-jeti-oguz.jpg";
import imgKarakol from "@/assets/rp-karakol.jpg";
import imgSary from "@/assets/rp-sary-chelek.jpg";
import imgAla from "@/assets/rp-ala-archa.jpg";
import imgTash from "@/assets/rp-tash-rabat.jpg";
import imgArslan from "@/assets/rp-arslanbob.jpg";

// ───────────────────────────────────────────────────────────
// Imagery — match real points to atmospheric photography
// ───────────────────────────────────────────────────────────
const POINT_IMAGE_OVERRIDES: Record<string, string> = {
  tamga: heroIssyk,
  barskoon: heroIssyk,
  "cholpon-ata": heroIssyk,
  "jeti-oguz": imgJeti,
  "altyn-arashan": imgKarakol,
  karakol: imgKarakol,
  "son-kul": imgSongkul,
  "tash-rabat": imgTash,
  "naryn-city": imgTash,
  "talas-besh-tash": imgArslan,
  "talas-manas": imgArslan,
  "ala-archa": imgAla,
  burana: imgAla,
  "osh-suleiman": imgJeti,
  "alay-valley": imgSongkul,
  arslanbob: imgArslan,
  "sary-chelek": imgSary,
  "batken-aigul": imgJeti,
  balykchy: heroIssyk,
};

export const HERO_IMAGE = heroIssyk;

export const getPointImage = (id: string): string =>
  POINT_IMAGE_OVERRIDES[id] ?? heroIssyk;

// ───────────────────────────────────────────────────────────
// Travel-style tags (used for filters + AI matching)
// ───────────────────────────────────────────────────────────
export type TravelStyle =
  | "lake"
  | "mountains"
  | "yurt"
  | "horse"
  | "culture"
  | "family"
  | "premium"
  | "nature"
  | "quiet";

export const TRAVEL_STYLES: { id: TravelStyle; label: string; emoji: string }[] = [
  { id: "lake", label: "У озера", emoji: "💧" },
  { id: "mountains", label: "Горы", emoji: "🏔" },
  { id: "yurt", label: "Юрты", emoji: "🛖" },
  { id: "horse", label: "Конные туры", emoji: "🐎" },
  { id: "culture", label: "Культура", emoji: "🎭" },
  { id: "family", label: "Семейные", emoji: "👨‍👩‍👧" },
  { id: "premium", label: "Premium escape", emoji: "✨" },
  { id: "nature", label: "Природа", emoji: "🌿" },
  { id: "quiet", label: "Тихо", emoji: "🤫" },
];

const POINT_STYLES: Record<string, TravelStyle[]> = {
  tamga: ["lake", "yurt", "quiet", "premium", "nature"],
  barskoon: ["mountains", "nature", "horse"],
  karakol: ["mountains", "culture", "family"],
  "cholpon-ata": ["lake", "family", "culture"],
  "jeti-oguz": ["mountains", "nature", "horse", "premium"],
  "altyn-arashan": ["mountains", "nature", "quiet"],
  "son-kul": ["lake", "yurt", "horse", "culture", "premium"],
  "tash-rabat": ["yurt", "culture", "quiet"],
  "naryn-city": ["culture", "family"],
  "talas-besh-tash": ["nature", "quiet", "mountains"],
  "talas-manas": ["culture", "family"],
  "ala-archa": ["mountains", "nature", "family"],
  burana: ["culture", "family"],
  "osh-suleiman": ["culture", "family"],
  "alay-valley": ["mountains", "yurt", "quiet", "premium"],
  arslanbob: ["nature", "culture", "family", "quiet"],
  "sary-chelek": ["lake", "nature", "premium", "quiet"],
  "batken-aigul": ["nature", "quiet"],
  balykchy: ["lake"],
};

export const getPointStyles = (id: string): TravelStyle[] =>
  POINT_STYLES[id] ?? ["nature"];

// ───────────────────────────────────────────────────────────
// Tourist-friendly reasons ("Why TOUROSAT recommends")
// ───────────────────────────────────────────────────────────
export interface FriendlyReason {
  icon: string;
  title: string;
  desc: string;
}

export const buildReasons = (p: MockRestPoint): FriendlyReason[] => {
  const reasons: FriendlyReason[] = [];

  if (p.metrics.viewpoint === "Excellent")
    reasons.push({
      icon: "🏔",
      title: "Сильные виды",
      desc: "Панорамные пейзажи, идеально для созерцательного отдыха и фото.",
    });

  if (p.metrics.roadAccess === "Good")
    reasons.push({
      icon: "🛣",
      title: "Простой доезд",
      desc: "Хорошая дорога — комфортно с детьми и без внедорожника.",
    });
  else if (p.metrics.roadAccess === "Hard")
    reasons.push({
      icon: "🧭",
      title: "Для подготовленных",
      desc: "Сложная дорога — ценят те, кто хочет уединения и приключений.",
    });

  if (p.metrics.distanceToLake !== "—" && parseFloat(p.metrics.distanceToLake) <= 3)
    reasons.push({
      icon: "💧",
      title: "Близко к воде",
      desc: `${p.metrics.distanceToLake} до берега — купание, рыбалка, рассветы у воды.`,
    });

  if (p.metrics.competitors <= 2)
    reasons.push({
      icon: "🤫",
      title: "Мало людей рядом",
      desc: "Низкая плотность точек — больше тишины и приватности.",
    });

  if (p.metrics.ndvi >= 0.6)
    reasons.push({
      icon: "🌿",
      title: "Богатая природа",
      desc: "Высокий NDVI — живая зелень, лес, чистый воздух.",
    });

  if (p.tourosatScore >= 85)
    reasons.push({
      icon: "✨",
      title: "Premium точка",
      desc: "Один из лучших Rest Points в Кыргызстане по версии TOUROSAT.",
    });

  return reasons.slice(0, 5);
};

// ───────────────────────────────────────────────────────────
// Events (festivals, treks, food, crafts) — keyed by region
// ───────────────────────────────────────────────────────────
export type EventType = "festival" | "trek" | "horse" | "food" | "craft" | "music";

export interface MockEvent {
  id: string;
  title: string;
  type: EventType;
  region: string;
  date: string; // ISO
  durationDays: number;
  distanceKm: number;
  description: string;
  image: string;
}

const EVENT_TYPE_META: Record<EventType, { label: string; emoji: string }> = {
  festival: { label: "Фестиваль", emoji: "🎉" },
  trek: { label: "Трекинг", emoji: "🥾" },
  horse: { label: "Конный тур", emoji: "🐎" },
  food: { label: "Гастрономия", emoji: "🍽" },
  craft: { label: "Ремёсла", emoji: "🧶" },
  music: { label: "Музыка", emoji: "🎶" },
};

export const getEventTypeMeta = (t: EventType) => EVENT_TYPE_META[t];

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "ev-worldnomad",
    title: "World Nomad Games",
    type: "festival",
    region: "Иссык-Куль",
    date: "2026-09-08",
    durationDays: 7,
    distanceKm: 8,
    description: "Главный кочевой фестиваль мира: кок-бору, эпос Манас, юрточный городок.",
    image: imgSongkul,
  },
  {
    id: "ev-kymyz",
    title: "Праздник кумыса",
    type: "food",
    region: "Нарын",
    date: "2026-06-20",
    durationDays: 2,
    distanceKm: 4,
    description: "Дегустация кумыса, бешбармака и национальных молочных блюд у юртачей.",
    image: imgSongkul,
  },
  {
    id: "ev-alakol",
    title: "Трек к озеру Ала-Кёль",
    type: "trek",
    region: "Иссык-Куль",
    date: "2026-07-12",
    durationDays: 3,
    distanceKm: 12,
    description: "Классический 3-дневный трек через Каракольское ущелье на 3500 м.",
    image: imgKarakol,
  },
  {
    id: "ev-songkol-horse",
    title: "Конный тур по джайлоо",
    type: "horse",
    region: "Нарын",
    date: "2026-07-25",
    durationDays: 4,
    distanceKm: 2,
    description: "4 дня верхом по высокогорным пастбищам Сон-Куля с ночёвкой в юртах.",
    image: imgSongkul,
  },
  {
    id: "ev-shyrdak",
    title: "Мастер-класс шырдак",
    type: "craft",
    region: "Иссык-Куль",
    date: "2026-08-05",
    durationDays: 1,
    distanceKm: 6,
    description: "Создание войлочного ковра шырдак с местными мастерицами в Кочкоре.",
    image: imgKarakol,
  },
  {
    id: "ev-manas-evening",
    title: "Вечер эпоса Манас",
    type: "music",
    region: "Талас",
    date: "2026-06-15",
    durationDays: 1,
    distanceKm: 5,
    description: "Живое исполнение фрагментов эпоса манасчы у комплекса Манас Ордо.",
    image: imgArslan,
  },
  {
    id: "ev-ala-archa-trek",
    title: "Восхождение на пик Учитель",
    type: "trek",
    region: "Чуй",
    date: "2026-07-30",
    durationDays: 2,
    distanceKm: 1,
    description: "Однодневное восхождение на популярную вершину 4527 м рядом с Бишкеком.",
    image: imgAla,
  },
  {
    id: "ev-walnut",
    title: "Сбор грецких орехов",
    type: "festival",
    region: "Джалал-Абад",
    date: "2026-09-25",
    durationDays: 5,
    distanceKm: 3,
    description: "Сезон ореха в Арсланбобе — походы по реликтовому лесу и местная кухня.",
    image: imgArslan,
  },
  {
    id: "ev-osh-bazaar",
    title: "Ночь Ошского базара",
    type: "food",
    region: "Ош",
    date: "2026-06-28",
    durationDays: 1,
    distanceKm: 2,
    description: "Уличная еда, плов, лагман и сладости одного из старейших базаров Азии.",
    image: imgJeti,
  },
  {
    id: "ev-felt-yurt",
    title: "Сборка юрты вместе с мастерами",
    type: "craft",
    region: "Нарын",
    date: "2026-08-12",
    durationDays: 1,
    distanceKm: 0.5,
    description: "Поучаствуйте в традиционной сборке юрты — 3 часа с обедом и чаем.",
    image: imgSongkul,
  },
];

export const getEventsForPoint = (point: MockRestPoint): MockEvent[] =>
  MOCK_EVENTS.filter((e) => e.region === point.region).slice(0, 4);

// ───────────────────────────────────────────────────────────
// Audio guides (one short story per point, fallback by region)
// ───────────────────────────────────────────────────────────
export interface AudioGuide {
  title: string;
  durationSec: number;
  narrator: string;
  story: string; // shown beneath the player
}

const AUDIO_GUIDES: Record<string, AudioGuide> = {
  tamga: {
    title: "Легенда о Тамге и затопленном городе",
    durationSec: 48,
    narrator: "Айгуль · TOUROSAT Voices",
    story:
      "Местные верят, что под водой Иссык-Куля до сих пор скрыт древний город. Тамга — единственное место, откуда в ясную погоду можно увидеть его очертания на закате.",
  },
  "son-kul": {
    title: "Сон-Куль: озеро снов кочевников",
    durationSec: 55,
    narrator: "Бакыт · TOUROSAT Voices",
    story:
      "Каждое лето семьи кочевников поднимаются сюда на джайлоо. Имя «Сон-Куль» означает «последнее озеро» — за ним только небо.",
  },
  "tash-rabat": {
    title: "Караван-сарай Великого Шёлкового пути",
    durationSec: 51,
    narrator: "Айгуль · TOUROSAT Voices",
    story:
      "Стены Таш-Рабата помнят 800 лет караванов из Китая в Венецию. Здесь до сих пор ночуют путешественники — теперь уже в юртах рядом.",
  },
  "jeti-oguz": {
    title: "Семь Быков: красная легенда",
    durationSec: 44,
    narrator: "Бакыт · TOUROSAT Voices",
    story:
      "Семь алых скал — это семь быков из легенды о ревнивом хане. Лучи закатного солнца заставляют камень светиться изнутри.",
  },
  arslanbob: {
    title: "Лес, который старше истории",
    durationSec: 50,
    narrator: "Айгуль · TOUROSAT Voices",
    story:
      "Реликтовый ореховый лес Арсланбоба насчитывает миллионы лет. По преданию, именно отсюда Александр Македонский привёз грецкий орех в Европу.",
  },
};

const REGION_AUDIO_FALLBACK: Record<string, AudioGuide> = {
  "Иссык-Куль": {
    title: "Иссык-Куль — жемчужина Тянь-Шаня",
    durationSec: 42,
    narrator: "TOUROSAT Voices",
    story:
      "Второе по солёности горное озеро мира никогда не замерзает. Древние верили, что озеро живое и забирает только тех, кого любит.",
  },
  Нарын: {
    title: "Высокогорные джайлоо Нарына",
    durationSec: 40,
    narrator: "TOUROSAT Voices",
    story:
      "Нарын — край больших расстояний и больших историй. Здесь до сих пор живёт настоящая кочевая культура.",
  },
  Талас: {
    title: "Долина эпоса Манас",
    durationSec: 38,
    narrator: "TOUROSAT Voices",
    story:
      "По преданию, именно в этой долине родился великий батыр Манас, объединитель кыргызских племён.",
  },
  Чуй: {
    title: "Ала-Арча: горы у Бишкека",
    durationSec: 36,
    narrator: "TOUROSAT Voices",
    story:
      "Меньше часа от столицы — и вы среди гранитных стен Тянь-Шаня. Парк создан в 1976 году и стал любимым уголком альпинистов.",
  },
  Ош: {
    title: "Сулайман-Тоо: священная гора",
    durationSec: 41,
    narrator: "TOUROSAT Voices",
    story:
      "Единственный объект ЮНЕСКО в Кыргызстане. Паломники поднимаются сюда уже более тысячи лет.",
  },
  "Джалал-Абад": {
    title: "Древний ореховый лес",
    durationSec: 39,
    narrator: "TOUROSAT Voices",
    story:
      "Джалал-Абад — это орехи, дикие яблоки и тёплые горы юга. Сезон сбора — настоящий местный праздник.",
  },
  Баткен: {
    title: "Айгуль — цветок одной долины",
    durationSec: 35,
    narrator: "TOUROSAT Voices",
    story:
      "Баткен — родина айгуль, цветка, который растёт только здесь и больше нигде в мире.",
  },
};

export const getAudioGuide = (p: MockRestPoint): AudioGuide =>
  AUDIO_GUIDES[p.id] ?? REGION_AUDIO_FALLBACK[p.region] ?? {
    title: `${p.name} — короткая история места`,
    durationSec: 40,
    narrator: "TOUROSAT Voices",
    story: p.description,
  };

// ───────────────────────────────────────────────────────────
// Cultural guide (general + per-region accents)
// ───────────────────────────────────────────────────────────
export interface CulturalTip {
  icon: string;
  title: string;
  desc: string;
}

export const getCulturalTips = (p: MockRestPoint): CulturalTip[] => {
  const base: CulturalTip[] = [
    {
      icon: "🍲",
      title: "Попробуйте бешбармак",
      desc: "Главное блюдо кыргызской кухни — отварное мясо с лапшой и луком.",
    },
    {
      icon: "🥛",
      title: "Кумыс и айран",
      desc: "Кисломолочные напитки кочевников — пейте небольшими глотками.",
    },
    {
      icon: "🛖",
      title: "Юрта — это дом",
      desc: "Не наступайте на порог и принимайте чай правой рукой — это знак уважения.",
    },
    {
      icon: "👋",
      title: "Старшим — первое слово",
      desc: "Уважение к аксакалам — основа этикета. Здоровайтесь первыми.",
    },
  ];

  if (p.region === "Ош" || p.region === "Джалал-Абад" || p.region === "Баткен")
    base.push({
      icon: "🍚",
      title: "Южный плов",
      desc: "В южных регионах попробуйте настоящий ошский плов с морковью и нутом.",
    });

  if (p.metrics.distanceToLake !== "—")
    base.push({
      icon: "🐟",
      title: "Иссык-кульская форель",
      desc: "Прибрежная кухня славится свежей рыбой — спрашивайте улов дня.",
    });

  return base.slice(0, 5);
};

// ───────────────────────────────────────────────────────────
// How to get there (transport options)
// ───────────────────────────────────────────────────────────
export interface TransportOption {
  mode: "car" | "taxi" | "bus" | "marshrutka";
  icon: string;
  label: string;
  duration: string;
  price: string;
  note: string;
}

export const getTransportOptions = (p: MockRestPoint): TransportOption[] => {
  const access = p.metrics.roadAccess;
  const fromBishkek = p.region === "Чуй" || p.region === "Талас";
  const baseDriveH = fromBishkek ? 1.5 : p.region === "Иссык-Куль" ? 4 : 6;

  return [
    {
      mode: "car",
      icon: "🚗",
      label: "Аренда авто",
      duration: `${baseDriveH} ч из Бишкека`,
      price: "≈ 4 500 сом / день",
      note: access === "Hard" ? "Нужен 4×4" : "Подходит обычная машина",
    },
    {
      mode: "taxi",
      icon: "🚖",
      label: "Такси / трансфер",
      duration: `${baseDriveH + 0.5} ч`,
      price: `≈ ${(baseDriveH * 1500).toLocaleString("ru-RU")} сом`,
      note: "Удобно для пары или семьи",
    },
    {
      mode: "marshrutka",
      icon: "🚐",
      label: "Маршрутка",
      duration: `${baseDriveH + 1} ч`,
      price: "≈ 350 сом",
      note: "Самый бюджетный вариант, отправление с Западного автовокзала",
    },
  ];
};

// ───────────────────────────────────────────────────────────
// Reviews
// ───────────────────────────────────────────────────────────
export interface MockReview {
  author: string;
  country: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEW_POOL: MockReview[] = [
  {
    author: "Aigerim",
    country: "🇰🇬 Бишкек",
    rating: 5,
    text: "Невероятный закат. Хозяева встретили как родных, кумыс — отдельная любовь.",
    date: "2 нед. назад",
  },
  {
    author: "Lukas",
    country: "🇩🇪 Германия",
    rating: 5,
    text: "Tolle Lage am See, sehr ruhig. The TOUROSAT score is honest — we got exactly what was promised.",
    date: "1 мес. назад",
  },
  {
    author: "Dilnoza",
    country: "🇺🇿 Ташкент",
    rating: 4,
    text: "Очень уютно с детьми. Дорога нормальная, вид на горы — каждое утро как открытка.",
    date: "3 нед. назад",
  },
  {
    author: "Tom",
    country: "🇬🇧 Лондон",
    rating: 5,
    text: "Best stay of our Silk Road trip. Local food, clear sky, zero crowd.",
    date: "1 нед. назад",
  },
  {
    author: "Бакыт",
    country: "🇰🇬 Ош",
    rating: 4,
    text: "Чисто, тихо, хорошие цены. Конная прогулка прошла на отлично.",
    date: "5 дн. назад",
  },
];

export const getReviews = (p: MockRestPoint): MockReview[] => {
  const seed = p.id.length;
  return [0, 1, 2].map((i) => REVIEW_POOL[(seed + i) % REVIEW_POOL.length]);
};

// ───────────────────────────────────────────────────────────
// AI Concierge — keyword-driven recommendations + reasons
// ───────────────────────────────────────────────────────────
export interface AIRecommendation {
  point: MockRestPoint;
  reason: string;
  tags: string[];
}

export interface AIReply {
  intro: string;
  recommendations: AIRecommendation[];
}

interface Intent {
  styles: TravelStyle[];
  maxBudget?: number;
  region?: string;
  keywords: string[];
}

const STYLE_KEYWORDS: { re: RegExp; style: TravelStyle }[] = [
  { re: /(озер|lake|кёл|көл|жээк)/i, style: "lake" },
  { re: /(гор|mountain|тоо|пик|peak)/i, style: "mountains" },
  { re: /(юрт|yurt|боз\s?үй)/i, style: "yurt" },
  { re: /(кон|horse|ат\s?мин)/i, style: "horse" },
  { re: /(культур|culture|history|музе|эпос|маданият)/i, style: "culture" },
  { re: /(семь|family|дет|бала|kid|child)/i, style: "family" },
  { re: /(премиум|premium|роскош|luxury)/i, style: "premium" },
  { re: /(природ|nature|жараты|forest|лес)/i, style: "nature" },
  { re: /(тих|quiet|peaceful|спокой|тынч)/i, style: "quiet" },
];

const REGION_KEYWORDS: { re: RegExp; region: string }[] = [
  { re: /(иссык|issyk|ысык)/i, region: "Иссык-Куль" },
  { re: /(нарын)/i, region: "Нарын" },
  { re: /(талас)/i, region: "Талас" },
  { re: /(чуй|бишкек)/i, region: "Чуй" },
  { re: /(ош)/i, region: "Ош" },
  { re: /(джалал|jalal)/i, region: "Джалал-Абад" },
  { re: /(баткен)/i, region: "Баткен" },
];

const parseIntent = (text: string): Intent => {
  const styles = STYLE_KEYWORDS.filter((k) => k.re.test(text)).map((k) => k.style);
  const region = REGION_KEYWORDS.find((k) => k.re.test(text))?.region;
  const budgetMatch = text.match(/(\d{3,6})\s*(сом|som|kgs)?/i);
  const maxBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : undefined;
  return { styles, maxBudget, region, keywords: text.toLowerCase().split(/\s+/) };
};

const scorePoint = (p: MockRestPoint, intent: Intent): number => {
  const styles = getPointStyles(p.id);
  let score = p.tourosatScore / 2; // baseline
  intent.styles.forEach((s) => {
    if (styles.includes(s)) score += 25;
  });
  if (intent.region && p.region === intent.region) score += 30;
  if (intent.maxBudget && p.recommendedPrice <= intent.maxBudget) score += 20;
  if (intent.maxBudget && p.recommendedPrice > intent.maxBudget) score -= 25;
  return score;
};

const buildReason = (p: MockRestPoint, intent: Intent): string => {
  const bits: string[] = [];
  const styles = getPointStyles(p.id);

  if (intent.styles.includes("quiet") && (styles.includes("quiet") || p.metrics.competitors <= 2))
    bits.push("тихое место с низкой плотностью точек");
  if (intent.styles.includes("lake") && p.metrics.distanceToLake !== "—")
    bits.push(`всего ${p.metrics.distanceToLake} до воды`);
  if (intent.styles.includes("family") && p.metrics.roadAccess === "Good")
    bits.push("хорошая дорога — подходит с детьми");
  if (intent.styles.includes("horse") && getPointStyles(p.id).includes("horse"))
    bits.push("есть конные прогулки рядом");
  if (intent.styles.includes("culture") && getPointStyles(p.id).includes("culture"))
    bits.push("сильная культурная программа поблизости");
  if (intent.styles.includes("mountains") && p.metrics.viewpoint === "Excellent")
    bits.push("отличные горные виды");
  if (intent.maxBudget && p.recommendedPrice <= intent.maxBudget)
    bits.push(`цена ${p.recommendedPrice.toLocaleString("ru-RU")} сом — в вашем бюджете`);
  if (p.tourosatScore >= 85)
    bits.push(`TOUROSAT Score ${p.tourosatScore}/100 — один из лучших в Кыргызстане`);

  if (!bits.length)
    bits.push(
      `высокий TOUROSAT Score ${p.tourosatScore}/100, ${p.metrics.viewpoint === "Excellent" ? "сильные виды" : "стабильные показатели"}`
    );

  return `Подходит, потому что ${bits.slice(0, 3).join(", ")}.`;
};

export const generateAIReply = (text: string): AIReply => {
  const intent = parseIntent(text);

  const ranked = [...MOCK_REST_POINTS]
    .map((p) => ({ p, score: scorePoint(p, intent) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const recommendations: AIRecommendation[] = ranked.map(({ p }) => ({
    point: p,
    reason: buildReason(p, intent),
    tags: getPointStyles(p.id)
      .slice(0, 3)
      .map((s) => TRAVEL_STYLES.find((ts) => ts.id === s)?.label ?? s),
  }));

  const summary: string[] = [];
  if (intent.styles.length)
    summary.push(
      `стиль: ${intent.styles
        .map((s) => TRAVEL_STYLES.find((ts) => ts.id === s)?.label ?? s)
        .join(", ")}`
    );
  if (intent.region) summary.push(`регион: ${intent.region}`);
  if (intent.maxBudget) summary.push(`бюджет до ${intent.maxBudget.toLocaleString("ru-RU")} сом`);

  const intro = summary.length
    ? `Понял запрос — ${summary.join("; ")}. Вот ${recommendations.length} лучших варианта по данным TOUROSAT:`
    : `Подобрал ${recommendations.length} Rest Points с лучшими оценками TOUROSAT:`;

  return { intro, recommendations };
};

// Suggestion chips for AI Concierge
export const AI_SUGGESTIONS = [
  "Тихое место у Иссык-Куля до 7000 сом",
  "Семьёй с детьми, хорошая дорога",
  "Конный тур и юрты на джайлоо",
  "Premium escape с видом на горы",
  "Культура и местная кухня",
  "Where can I go for 2 nights near a lake?",
];

export const REFINEMENT_OPTIONS = [
  { label: "Дешевле", append: "до 3500 сом" },
  { label: "Ближе к озеру", append: "у самой воды" },
  { label: "Лучшая дорога", append: "с хорошей дорогой" },
  { label: "С событиями рядом", append: "с фестивалями и событиями" },
  { label: "Лучшие виды", append: "с панорамными видами" },
];
