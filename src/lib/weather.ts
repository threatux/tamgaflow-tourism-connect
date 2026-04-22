// Open-Meteo weather utility (free, no API key required)
// Docs: https://open-meteo.com/en/docs

export interface WeatherData {
  temperature: number;
  description: string;
  emoji: string;
  label: string; // emoji + description, e.g. "☀️ Ясно"
  code: number;
}

const mapWeatherCode = (code: number): { emoji: string; description: string } => {
  if (code === 0) return { emoji: "☀️", description: "Ясно" };
  if (code >= 1 && code <= 3) return { emoji: "🌤", description: "Переменная облачность" };
  if (code === 45 || code === 48) return { emoji: "🌫", description: "Туман" };
  if (code >= 51 && code <= 67) return { emoji: "🌧", description: "Дождь" };
  if (code >= 71 && code <= 77) return { emoji: "❄️", description: "Снег" };
  if (code >= 80 && code <= 82) return { emoji: "🌧", description: "Ливни" };
  if (code >= 85 && code <= 86) return { emoji: "❄️", description: "Снегопад" };
  if (code >= 95) return { emoji: "⚡️", description: "Гроза" };
  return { emoji: "🌡", description: "Погода" };
};

export const getWeather = async (
  lat: number,
  lon: number
): Promise<WeatherData | null> => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const cw = data?.current_weather;
    if (!cw) return null;
    const { emoji, description } = mapWeatherCode(cw.weathercode);
    return {
      temperature: Math.round(cw.temperature),
      description,
      emoji,
      label: `${emoji} ${description}`,
      code: cw.weathercode,
    };
  } catch {
    return null;
  }
};
