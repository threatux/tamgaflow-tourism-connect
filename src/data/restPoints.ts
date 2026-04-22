export interface RestPoint {
  name: string;
  tourism_score: number;
  transactions_today: number;
  revenue_som: number;
  status: string;
  lat: number;
  lon: number;
}

export const REST_POINTS_GEO: RestPoint[] = [
  { name: "Тамга", tourism_score: 77, transactions_today: 12, revenue_som: 54200, status: "🟢", lat: 42.15, lon: 77.55 },
  { name: "Барскоон", tourism_score: 72, transactions_today: 8, revenue_som: 32100, status: "🟢", lat: 42.12, lon: 77.62 },
  { name: "Каракол", tourism_score: 65, transactions_today: 15, revenue_som: 48500, status: "🟡", lat: 42.49, lon: 78.39 },
  { name: "Чолпон-Ата", tourism_score: 62, transactions_today: 18, revenue_som: 62000, status: "🟡", lat: 42.64, lon: 77.08 },
  { name: "Джети-Өгүз", tourism_score: 58, transactions_today: 5, revenue_som: 18200, status: "🟡", lat: 42.33, lon: 78.23 },
  { name: "Бостери", tourism_score: 55, transactions_today: 10, revenue_som: 35400, status: "🟡", lat: 42.66, lon: 77.16 },
  { name: "Балыкчы", tourism_score: 38, transactions_today: 2, revenue_som: 4800, status: "🔴", lat: 42.46, lon: 76.19 },
  { name: "Григорьевка", tourism_score: 63, transactions_today: 6, revenue_som: 21000, status: "🟡", lat: 42.69, lon: 77.45 },
  { name: "Семёновка", tourism_score: 57, transactions_today: 4, revenue_som: 14500, status: "🟡", lat: 42.74, lon: 77.36 },
  { name: "Алтын-Арашан", tourism_score: 47, transactions_today: 3, revenue_som: 9800, status: "🔴", lat: 42.41, lon: 78.65 },
  { name: "Ак-Суу", tourism_score: 63, transactions_today: 5, revenue_som: 16200, status: "🟡", lat: 42.45, lon: 78.55 },
  { name: "Кара-Ой", tourism_score: 59, transactions_today: 7, revenue_som: 22300, status: "🟡", lat: 42.66, lon: 77.20 },
];
