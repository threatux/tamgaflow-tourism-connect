import { useEffect, useState } from "react";
import { getWeather, WeatherData } from "@/lib/weather";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherBadgeProps {
  lat: number;
  lon: number;
  variant?: "inline" | "card";
  prefix?: string;
}

export const WeatherBadge = ({ lat, lon, variant = "inline", prefix }: WeatherBadgeProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    getWeather(lat, lon).then((w) => {
      if (!active) return;
      if (w) setWeather(w);
      else setFailed(true);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [lat, lon]);

  if (failed) return null;

  if (loading) {
    return variant === "card" ? (
      <Skeleton className="h-12 w-full" />
    ) : (
      <Skeleton className="h-4 w-32 inline-block" />
    );
  }

  if (!weather) return null;

  if (variant === "card") {
    return (
      <div className="bg-accent rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{weather.emoji}</span>
          <span className="text-sm text-foreground font-medium">{weather.description}</span>
        </div>
        <span className="text-xl font-bold text-foreground">{weather.temperature}°C</span>
      </div>
    );
  }

  return (
    <span className="text-sm text-foreground">
      {prefix}
      {weather.emoji} {weather.temperature}°C, {weather.description}
    </span>
  );
};
