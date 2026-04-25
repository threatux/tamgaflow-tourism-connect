import {
  MOCK_REST_POINTS,
  type MockRestPoint,
} from "./restPoints";
import { MOCK_LATENCY_MAX, MOCK_LATENCY_MIN } from "@/config";

const delay = () =>
  new Promise<void>((resolve) =>
    setTimeout(
      resolve,
      MOCK_LATENCY_MIN + Math.random() * (MOCK_LATENCY_MAX - MOCK_LATENCY_MIN)
    )
  );

export const getRestPoints = async (): Promise<MockRestPoint[]> => {
  await delay();
  return MOCK_REST_POINTS;
};

export const getRestPointById = async (
  id: string
): Promise<MockRestPoint | undefined> => {
  await delay();
  return MOCK_REST_POINTS.find((p) => p.id === id || p.name === id);
};

export interface OwnerListingInput {
  description: string;
  lat: number;
  lon: number;
}

export interface OwnerListingResult {
  card: { name: string; tourism_score: number; ai_confidence: string };
  services: { id: string; name: string; icon: string; price_som: number; unit: string }[];
  pricing_note: string;
  qr_code: { id: string };
  revenue_forecast: { season_revenue_som: string };
}

export const createOwnerListing = async (
  input: OwnerListingInput
): Promise<OwnerListingResult> => {
  await delay();
  const score = Math.round(60 + Math.random() * 35);
  const confidence = (0.7 + Math.random() * 0.25).toFixed(2);
  const basePrice = Math.round(2000 + (score / 100) * 4000);
  const seasonal = Math.round(basePrice * 280 * (0.85 + Math.random() * 0.3));
  return {
    card: {
      name: input.description.split(/[.,\n]/)[0].slice(0, 32) || "Новый Rest Point",
      tourism_score: score,
      ai_confidence: confidence,
    },
    services: [
      { id: "1", name: "Юрта (2 чел)", icon: "🛏", price_som: basePrice, unit: "за ночь" },
      { id: "2", name: "Обед (национальная кухня)", icon: "🍽", price_som: 350, unit: "за порцию" },
      { id: "3", name: "Конная прогулка (2 часа)", icon: "🐎", price_som: 1050, unit: "за человека" },
      { id: "4", name: "Wi-Fi + зарядка", icon: "📶", price_som: 100, unit: "за день" },
      { id: "5", name: "Вид на горы", icon: "🏔", price_som: 0, unit: "бесплатно" },
    ],
    qr_code: { id: `TF-${Math.random().toString(16).slice(2, 14).toUpperCase()}` },
    revenue_forecast: {
      season_revenue_som: `${seasonal.toLocaleString("ru-RU")} сом`,
    },
    pricing_note: `Цены рассчитаны TOUROSAT AI на основе спутниковых данных, Score ${score}/100 и сезонного спроса`,
  };
};

export interface PaymentInput {
  point_name: string;
  services: { name: string; icon: string; price_som: number }[];
  tourist_name: string;
  tourist_country: string;
}

export interface PaymentResult {
  total_som: number;
  services: { icon: string; name: string; price_som: number }[];
  split: {
    owner: { amount_som: number };
    platform: { amount_som: number };
  };
  message: string;
  point_name: string;
}

export const createPayment = async (
  input: PaymentInput
): Promise<PaymentResult> => {
  await delay();
  const total = input.services.reduce((sum, s) => sum + s.price_som, 0);
  return {
    total_som: total,
    services: input.services.map(({ icon, name, price_som }) => ({
      icon,
      name,
      price_som,
    })),
    split: {
      owner: { amount_som: Math.round(total * 0.88) },
      platform: { amount_som: Math.round(total * 0.12) },
    },
    message: `✅ Спасибо, ${input.tourist_name}! Вы поддержали село и туризм Кыргызстана.`,
    point_name: input.point_name,
  };
};
