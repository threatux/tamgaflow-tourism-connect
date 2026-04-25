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
      <Skeleton className="h-14 w-full rounded-2xl" />
    ) : (
      <Skeleton className="h-4 w-32 inline-block" />
    );
  }

  if (!weather) return null;

  if (variant === "card") {
    return (
      <div className="rounded-2xl p-4 bg-accent border border-primary/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{weather.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">Сейчас</p>
            <p className="text-sm text-foreground font-semibold">{weather.description}</p>
          </div>
        </div>
        <span className="text-3xl font-extrabold font-display text-foreground tabular-nums">
          {weather.temperature}°
        </span>
      </div>
    );
  }

  return (
    <span className="text-sm text-foreground font-medium">
      {prefix}
      {weather.emoji} {weather.temperature}°C, {weather.description}
    </span>
  );
};
