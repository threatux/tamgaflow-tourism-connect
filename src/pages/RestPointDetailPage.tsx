import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TourosatScore } from "@/components/TourosatScore";
import { SplitVisualization } from "@/components/SplitVisualization";
import { WeatherBadge } from "@/components/WeatherBadge";
import { AudioPlayer } from "@/components/tourist/AudioPlayer";
import { CulturalGuideCard } from "@/components/tourist/CulturalGuideCard";
import { EventCard } from "@/components/tourist/EventCard";
import { GettingThere } from "@/components/tourist/GettingThere";
import { RecommendationCard } from "@/components/tourist/RecommendationCard";
import { ReviewCard } from "@/components/tourist/ReviewCard";
import { WishlistButton } from "@/components/tourist/WishlistButton";
import { getRestPointById, getRestPoints } from "@/mocks/api";
import type { MockRestPoint } from "@/mocks/restPoints";
import {
  buildReasons,
  getAudioGuide,
  getCulturalTips,
  getEventsForPoint,
  getPointImage,
  getPointStyles,
  getReviews,
  getTransportOptions,
  TRAVEL_STYLES,
} from "@/mocks/touristData";

const RestPointDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [point, setPoint] = useState<MockRestPoint | null>(null);
  const [allPoints, setAllPoints] = useState<MockRestPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getRestPointById(id), getRestPoints()]).then(([p, all]) => {
      setPoint(p ?? null);
      setAllPoints(all);
      setLoading(false);
    });
  }, [id]);

  const similar = useMemo(() => {
    if (!point) return [];
    const styles = getPointStyles(point.id);
    return allPoints
      .filter((p) => p.id !== point.id)
      .map((p) => ({
        p,
        overlap: getPointStyles(p.id).filter((s) => styles.includes(s)).length,
      }))
      .sort((a, b) => b.overlap - a.overlap || b.p.tourosatScore - a.p.tourosatScore)
      .slice(0, 3)
      .map((x) => x.p);
  }, [point, allPoints]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[420px] w-full rounded-[2rem]" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-3xl font-extrabold font-display">Rest Point не найден</h1>
        <Button onClick={() => navigate("/tourist")}>← Назад к Discover</Button>
      </div>
    );
  }

  const reasons = buildReasons(point);
  const events = getEventsForPoint(point);
  const tips = getCulturalTips(point);
  const reviews = getReviews(point);
  const transport = getTransportOptions(point);
  const audio = getAudioGuide(point);
  const styleTags = getPointStyles(point.id)
    .map((s) => TRAVEL_STYLES.find((t) => t.id === s))
    .filter(Boolean) as { label: string; emoji: string }[];

  const avgRating =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);

  return (
    <div className="space-y-12 -mt-2">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Назад
      </button>

      {/* HERO */}
      <section className="relative rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-premium)]">
        <img
          src={getPointImage(point.id)}
          alt={point.name}
          width={1600}
          height={900}
          className="w-full h-[440px] md:h-[520px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="absolute top-4 right-4">
          <WishlistButton pointId={point.id} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur border border-white/30 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3 text-gold-light" />
            Verified by TOUROSAT
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-[-0.025em] leading-tight">
            {point.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm font-semibold opacity-95">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {point.region}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-gold-light fill-gold-light" />{" "}
              {avgRating.toFixed(1)} · {reviews.length} отзывов
            </span>
            <span>
              {point.weather.icon} {point.weather.temp}° · {point.weather.condition}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {styleTags.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25 text-[11px] font-bold"
              >
                <span>{t.emoji}</span>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="grid lg:grid-cols-[1fr,360px] gap-8">
        <div className="space-y-12 min-w-0">
          {/* Description */}
          <section>
            <p className="text-lg text-foreground/80 leading-relaxed">{point.description}</p>
          </section>

          {/* Why TOUROSAT recommends */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Why TOUROSAT recommends
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                  Почему TOUROSAT советует это место
                </h2>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-accent/40 p-6 md:p-8 grid md:grid-cols-[180px,1fr] gap-8 items-center">
              <div className="flex justify-center">
                <TourosatScore
                  score={point.tourosatScore}
                  confidence={point.confidence}
                  size="md"
                  showSources={false}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {reasons.map((r) => (
                  <div
                    key={r.title}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border"
                  >
                    <div className="size-9 shrink-0 rounded-xl bg-accent border border-primary/20 flex items-center justify-center text-base">
                      {r.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-foreground leading-tight">
                        {r.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Audio guide */}
          <section className="space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                Listen to the place
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                Послушайте историю места
              </h2>
            </div>
            <AudioPlayer guide={audio} artwork={getPointImage(point.id)} pointName={point.name} />
          </section>

          {/* Events */}
          {events.length > 0 && (
            <section className="space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Nearby events
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                  События поблизости
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {events.map((e, i) => (
                  <EventCard key={e.id} event={e} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Getting there */}
          <section className="space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                How to get there
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                Как добраться
              </h2>
            </div>
            <GettingThere options={transport} />
          </section>

          {/* Cultural guide */}
          <section className="space-y-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-deep">
                Cultural guide
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                Культурный гид
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {tips.map((t) => (
                <CulturalGuideCard key={t.title} tip={t} />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Reviews
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                  Отзывы путешественников
                </h2>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold font-display tabular-nums">
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex justify-end gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(avgRating) ? "text-gold fill-gold" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <ReviewCard key={i} review={r} />
              ))}
            </div>
          </section>

          {/* Similar */}
          {similar.length > 0 && (
            <section className="space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Similar places
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
                  Похожие Rest Points
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                {similar.map((p, i) => (
                  <RecommendationCard key={p.id} point={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* STICKY BOOK PANEL */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)] space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                Рекомендованная цена · TOUROSAT AI
              </p>
              <p className="text-4xl font-extrabold font-display tabular-nums text-foreground tracking-tight mt-1">
                {point.recommendedPrice.toLocaleString("ru-RU")}
                <span className="text-base font-medium text-muted-foreground"> сом / ночь</span>
              </p>
            </div>

            <WeatherBadge lat={point.lat} lon={point.lng} variant="card" />

            <div className="space-y-2">
              <Button
                onClick={() => navigate(`/pay?point=${encodeURIComponent(point.name)}`)}
                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-br from-primary to-primary-dark hover:opacity-95 shadow-[var(--shadow-glow-teal)] hover:-translate-y-0.5 transition-premium"
              >
                Забронировать
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/concierge")}
                className="w-full h-12 rounded-2xl font-semibold border-border"
              >
                Спросить AI Concierge
              </Button>
            </div>

            {/* Split preview */}
            <div className="pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                Прозрачный split в момент оплаты
              </p>
              <SplitVisualization total={point.recommendedPrice} compact />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RestPointDetailPage;
