export type RoadAccess = "Good" | "Average" | "Hard";
export type Viewpoint = "Excellent" | "Good" | "Average";

export interface RestPointMetrics {
  ndvi: number;
  distanceToLake: string;
  roadAccess: RoadAccess;
  competitors: number;
  viewpoint: Viewpoint;
}

export interface RestPointWeather {
  temp: number;
  condition: string;
  icon: string;
}

export interface MockRestPoint {
  id: string;
  name: string;
  region: string;
  category: "yurt" | "guesthouse" | "camping" | "eco";
  lat: number;
  lng: number;
  description: string;
  tourosatScore: number; // 35..96
  confidence: number; // 70..95
  transactionsToday: number;
  revenueSom: number;
  metrics: RestPointMetrics;
  weather: RestPointWeather;
  recommendedPrice: number; // KGS
  images: string[];
}

const PLACEHOLDER = "/placeholder.svg";

export const MOCK_REST_POINTS: MockRestPoint[] = [
  {
    id: "tamga",
    name: "Тамга",
    region: "Иссык-Куль",
    category: "yurt",
    lat: 42.15,
    lng: 77.55,
    description:
      "Юрточный лагерь у южного берега Иссык-Куля с панорамным видом на Тянь-Шань.",
    tourosatScore: 92,
    confidence: 93,
    transactionsToday: 12,
    revenueSom: 54200,
    metrics: {
      ndvi: 0.62,
      distanceToLake: "1.2 km",
      roadAccess: "Good",
      competitors: 3,
      viewpoint: "Excellent",
    },
    weather: { temp: 18, condition: "Ясно", icon: "☀" },
    recommendedPrice: 6550,
    images: [PLACEHOLDER],
  },
  {
    id: "barskoon",
    name: "Барскоон",
    region: "Иссык-Куль",
    category: "guesthouse",
    lat: 42.12,
    lng: 77.62,
    description:
      "Гестхаус у входа в Барскоонское ущелье — близость водопадов и горных троп.",
    tourosatScore: 78,
    confidence: 88,
    transactionsToday: 8,
    revenueSom: 32100,
    metrics: {
      ndvi: 0.58,
      distanceToLake: "3.4 km",
      roadAccess: "Good",
      competitors: 2,
      viewpoint: "Excellent",
    },
    weather: { temp: 16, condition: "Облачно", icon: "⛅" },
    recommendedPrice: 4900,
    images: [PLACEHOLDER],
  },
  {
    id: "karakol",
    name: "Каракол",
    region: "Иссык-Куль",
    category: "guesthouse",
    lat: 42.49,
    lng: 78.39,
    description:
      "Гостевой дом в центре Каракола — старт треков к Алтын-Арашану и Ала-Колу.",
    tourosatScore: 86,
    confidence: 91,
    transactionsToday: 15,
    revenueSom: 48500,
    metrics: {
      ndvi: 0.49,
      distanceToLake: "12 km",
      roadAccess: "Good",
      competitors: 8,
      viewpoint: "Good",
    },
    weather: { temp: 14, condition: "Переменная", icon: "🌤" },
    recommendedPrice: 5300,
    images: [PLACEHOLDER],
  },
  {
    id: "cholpon-ata",
    name: "Чолпон-Ата",
    region: "Иссык-Куль",
    category: "guesthouse",
    lat: 42.64,
    lng: 77.08,
    description:
      "Курортная зона северного побережья — пляжи, променад, культурный центр Рух Ордо.",
    tourosatScore: 74,
    confidence: 86,
    transactionsToday: 18,
    revenueSom: 62000,
    metrics: {
      ndvi: 0.41,
      distanceToLake: "0.4 km",
      roadAccess: "Good",
      competitors: 12,
      viewpoint: "Good",
    },
    weather: { temp: 21, condition: "Солнечно", icon: "☀" },
    recommendedPrice: 5800,
    images: [PLACEHOLDER],
  },
  {
    id: "jeti-oguz",
    name: "Джети-Өгүз",
    region: "Иссык-Куль",
    category: "eco",
    lat: 42.33,
    lng: 78.23,
    description:
      "Эко-лагерь у скал «Семь Быков» — красные каньоны, альпийские луга, горячие источники.",
    tourosatScore: 81,
    confidence: 89,
    transactionsToday: 5,
    revenueSom: 18200,
    metrics: {
      ndvi: 0.66,
      distanceToLake: "8 km",
      roadAccess: "Average",
      competitors: 1,
      viewpoint: "Excellent",
    },
    weather: { temp: 12, condition: "Прохладно", icon: "🌥" },
    recommendedPrice: 4200,
    images: [PLACEHOLDER],
  },
  {
    id: "altyn-arashan",
    name: "Алтын-Арашан",
    region: "Иссык-Куль",
    category: "camping",
    lat: 42.41,
    lng: 78.65,
    description:
      "Высокогорный кемпинг у термальных источников на высоте 2600 м.",
    tourosatScore: 69,
    confidence: 78,
    transactionsToday: 3,
    revenueSom: 9800,
    metrics: {
      ndvi: 0.71,
      distanceToLake: "26 km",
      roadAccess: "Hard",
      competitors: 1,
      viewpoint: "Excellent",
    },
    weather: { temp: 8, condition: "Туман", icon: "🌫" },
    recommendedPrice: 3500,
    images: [PLACEHOLDER],
  },
  {
    id: "son-kul",
    name: "Сон-Куль",
    region: "Нарын",
    category: "yurt",
    lat: 41.85,
    lng: 75.13,
    description:
      "Юрточный лагерь на берегу высокогорного озера Сон-Куль — кочевая культура и звёздное небо.",
    tourosatScore: 88,
    confidence: 90,
    transactionsToday: 9,
    revenueSom: 28500,
    metrics: {
      ndvi: 0.55,
      distanceToLake: "0.3 km",
      roadAccess: "Average",
      competitors: 4,
      viewpoint: "Excellent",
    },
    weather: { temp: 6, condition: "Ясно", icon: "☀" },
    recommendedPrice: 4500,
    images: [PLACEHOLDER],
  },
  {
    id: "tash-rabat",
    name: "Таш-Рабат",
    region: "Нарын",
    category: "yurt",
    lat: 40.82,
    lng: 75.30,
    description:
      "Юрточный лагерь у древнего караван-сарая на Великом Шёлковом пути.",
    tourosatScore: 83,
    confidence: 87,
    transactionsToday: 4,
    revenueSom: 13400,
    metrics: {
      ndvi: 0.48,
      distanceToLake: "—",
      roadAccess: "Average",
      competitors: 2,
      viewpoint: "Excellent",
    },
    weather: { temp: 9, condition: "Ветрено", icon: "🌬" },
    recommendedPrice: 3900,
    images: [PLACEHOLDER],
  },
  {
    id: "naryn-city",
    name: "Нарын",
    region: "Нарын",
    category: "guesthouse",
    lat: 41.43,
    lng: 75.99,
    description:
      "Городской гестхаус — удобная база для поездок к Сон-Куль и Таш-Рабат.",
    tourosatScore: 58,
    confidence: 82,
    transactionsToday: 6,
    revenueSom: 14200,
    metrics: {
      ndvi: 0.32,
      distanceToLake: "—",
      roadAccess: "Good",
      competitors: 7,
      viewpoint: "Good",
    },
    weather: { temp: 13, condition: "Облачно", icon: "☁" },
    recommendedPrice: 2800,
    images: [PLACEHOLDER],
  },
  {
    id: "talas-besh-tash",
    name: "Беш-Таш",
    region: "Талас",
    category: "eco",
    lat: 42.45,
    lng: 72.10,
    description:
      "Эко-точка в Беш-Ташском национальном парке — реликтовые еловые леса.",
    tourosatScore: 71,
    confidence: 84,
    transactionsToday: 2,
    revenueSom: 7600,
    metrics: {
      ndvi: 0.74,
      distanceToLake: "—",
      roadAccess: "Average",
      competitors: 1,
      viewpoint: "Excellent",
    },
    weather: { temp: 15, condition: "Ясно", icon: "☀" },
    recommendedPrice: 3200,
    images: [PLACEHOLDER],
  },
  {
    id: "talas-manas",
    name: "Манас Ордо",
    region: "Талас",
    category: "guesthouse",
    lat: 42.52,
    lng: 72.24,
    description:
      "Гестхаус рядом с историко-культурным комплексом Манас Ордо.",
    tourosatScore: 54,
    confidence: 80,
    transactionsToday: 3,
    revenueSom: 8900,
    metrics: {
      ndvi: 0.39,
      distanceToLake: "—",
      roadAccess: "Good",
      competitors: 4,
      viewpoint: "Good",
    },
    weather: { temp: 17, condition: "Переменная", icon: "🌤" },
    recommendedPrice: 2400,
    images: [PLACEHOLDER],
  },
  {
    id: "ala-archa",
    name: "Ала-Арча",
    region: "Чуй",
    category: "camping",
    lat: 42.58,
    lng: 74.49,
    description:
      "Кемпинг в национальном парке Ала-Арча — стартовая точка альпинистских маршрутов.",
    tourosatScore: 90,
    confidence: 92,
    transactionsToday: 14,
    revenueSom: 41200,
    metrics: {
      ndvi: 0.68,
      distanceToLake: "—",
      roadAccess: "Good",
      competitors: 3,
      viewpoint: "Excellent",
    },
    weather: { temp: 11, condition: "Ясно", icon: "☀" },
    recommendedPrice: 4100,
    images: [PLACEHOLDER],
  },
  {
    id: "burana",
    name: "Башня Бурана",
    region: "Чуй",
    category: "guesthouse",
    lat: 42.74,
    lng: 75.25,
    description:
      "Гестхаус возле археологического комплекса Бурана и каменных балбалов.",
    tourosatScore: 62,
    confidence: 83,
    transactionsToday: 5,
    revenueSom: 11400,
    metrics: {
      ndvi: 0.36,
      distanceToLake: "—",
      roadAccess: "Good",
      competitors: 2,
      viewpoint: "Good",
    },
    weather: { temp: 19, condition: "Солнечно", icon: "☀" },
    recommendedPrice: 2600,
    images: [PLACEHOLDER],
  },
  {
    id: "osh-suleiman",
    name: "Сулайман-Тоо",
    region: "Ош",
    category: "guesthouse",
    lat: 40.52,
    lng: 72.79,
    description:
      "Гестхаус в Оше у священной горы Сулайман-Тоо — объект ЮНЕСКО.",
    tourosatScore: 76,
    confidence: 86,
    transactionsToday: 11,
    revenueSom: 33500,
    metrics: {
      ndvi: 0.34,
      distanceToLake: "—",
      roadAccess: "Good",
      competitors: 9,
      viewpoint: "Good",
    },
    weather: { temp: 24, condition: "Жарко", icon: "🔆" },
    recommendedPrice: 3400,
    images: [PLACEHOLDER],
  },
  {
    id: "alay-valley",
    name: "Алайская долина",
    region: "Ош",
    category: "yurt",
    lat: 39.55,
    lng: 72.95,
    description:
      "Юрточный лагерь у подножия пика Ленина — высокогорные пастбища Памиро-Алая.",
    tourosatScore: 87,
    confidence: 89,
    transactionsToday: 4,
    revenueSom: 16800,
    metrics: {
      ndvi: 0.51,
      distanceToLake: "—",
      roadAccess: "Hard",
      competitors: 2,
      viewpoint: "Excellent",
    },
    weather: { temp: 4, condition: "Холодно", icon: "❄" },
    recommendedPrice: 5200,
    images: [PLACEHOLDER],
  },
  {
    id: "arslanbob",
    name: "Арсланбоб",
    region: "Джалал-Абад",
    category: "eco",
    lat: 41.34,
    lng: 72.95,
    description:
      "Эко-точка в крупнейшем в мире реликтовом ореховом лесу.",
    tourosatScore: 79,
    confidence: 87,
    transactionsToday: 7,
    revenueSom: 21300,
    metrics: {
      ndvi: 0.78,
      distanceToLake: "—",
      roadAccess: "Average",
      competitors: 5,
      viewpoint: "Excellent",
    },
    weather: { temp: 18, condition: "Ясно", icon: "☀" },
    recommendedPrice: 3700,
    images: [PLACEHOLDER],
  },
  {
    id: "sary-chelek",
    name: "Сары-Челек",
    region: "Джалал-Абад",
    category: "camping",
    lat: 41.85,
    lng: 71.96,
    description:
      "Кемпинг у бирюзового горного озера Сары-Челек, биосферный заповедник.",
    tourosatScore: 85,
    confidence: 88,
    transactionsToday: 5,
    revenueSom: 17400,
    metrics: {
      ndvi: 0.72,
      distanceToLake: "0.5 km",
      roadAccess: "Average",
      competitors: 1,
      viewpoint: "Excellent",
    },
    weather: { temp: 13, condition: "Переменная", icon: "🌤" },
    recommendedPrice: 4400,
    images: [PLACEHOLDER],
  },
  {
    id: "batken-aigul",
    name: "Айгуль-Таш",
    region: "Баткен",
    category: "eco",
    lat: 39.72,
    lng: 70.48,
    description:
      "Эко-точка у горы Айгуль-Таш — единственного места произрастания цветка айгуль.",
    tourosatScore: 47,
    confidence: 75,
    transactionsToday: 1,
    revenueSom: 3200,
    metrics: {
      ndvi: 0.42,
      distanceToLake: "—",
      roadAccess: "Hard",
      competitors: 0,
      viewpoint: "Excellent",
    },
    weather: { temp: 22, condition: "Ясно", icon: "☀" },
    recommendedPrice: 2200,
    images: [PLACEHOLDER],
  },
  {
    id: "balykchy",
    name: "Балыкчы",
    region: "Иссык-Куль",
    category: "guesthouse",
    lat: 42.46,
    lng: 76.19,
    description:
      "Транзитный гестхаус на западном берегу Иссык-Куля — ворота курортной зоны.",
    tourosatScore: 38,
    confidence: 72,
    transactionsToday: 2,
    revenueSom: 4800,
    metrics: {
      ndvi: 0.22,
      distanceToLake: "1.0 km",
      roadAccess: "Good",
      competitors: 6,
      viewpoint: "Average",
    },
    weather: { temp: 20, condition: "Ветрено", icon: "🌬" },
    recommendedPrice: 1800,
    images: [PLACEHOLDER],
  },
];

export const REGIONS = [
  "Иссык-Куль",
  "Нарын",
  "Талас",
  "Чуй",
  "Ош",
  "Джалал-Абад",
  "Баткен",
] as const;

export const CATEGORIES = [
  { id: "yurt", label: "Юрты" },
  { id: "guesthouse", label: "Гестхаусы" },
  { id: "camping", label: "Кемпинги" },
  { id: "eco", label: "Эко-точки" },
] as const;
