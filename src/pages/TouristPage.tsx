import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Search, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getRestPoints } from "@/mocks/api";
import type { MockRestPoint } from "@/mocks/restPoints";
import {
  HERO_IMAGE,
  TRAVEL_STYLES,
  type TravelStyle,
  getPointStyles,
  getEventsForPoint,
  MOCK_EVENTS,
} from "@/mocks/touristData";
import { RecommendationCard } from "@/components/tourist/RecommendationCard";
import { EventCard } from "@/components/tourist/EventCard";
import { useWishlist } from "@/hooks/useWishlist";

const REASON_HINTS: Record<TravelStyle, string> = {
  lake: "Идеально для отдыха у воды и закатов на берегу.",
  mountains: "Сильные горные виды и трекинг рядом.",
  yurt: "Аутентичный юрточный опыт и кочевая культура.",
  horse: "Подходит для конных туров по джайлоо.",
  culture: "Культурная программа, история и эпос.",
  family: "Хорошая дорога — комфортно с детьми.",
  premium: "Топ TOUROSAT Score — premium escape.",
  nature: "Высокий NDVI — настоящая дикая природа.",
  quiet: "Мало точек рядом — больше тишины и приватности.",
};

const sectionTitle = (label: string, accent: string) => (
  <div className="flex items-end justify-between gap-3">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark">{accent}</p>
      <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight mt-1">
        {label}
      </h2>
    </div>
  </div>
);

const TouristPage = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState<MockRestPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeStyle, setActiveStyle] = useState<TravelStyle | null>(null);
  const { ids: wishlistIds } = useWishlist();

  useEffect(() => {
    getRestPoints().then((p) => {
      setPoints(p);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = points;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (activeStyle) {
      list = list.filter((p) => getPointStyles(p.id).includes(activeStyle));
    }
    return list;
  }, [points, search, activeStyle]);

  const forYou = useMemo(() => {
    // mix of premium, lake, and quiet
    return [...points]
      .sort((a, b) => b.tourosatScore - a.tourosatScore)
      .filter((p) => p.tourosatScore >= 70)
      .slice(0, 8);
  }, [points]);

  const bestByScore = useMemo(
    () => [...points].sort((a, b) => b.tourosatScore - a.tourosatScore).slice(0, 6),
    [points]
  );

  const trending = useMemo(
    () => [...points].sort((a, b) => b.transactionsToday - a.transactionsToday).slice(0, 6),
    [points]
  );

  const wishlistPoints = useMemo(
    () => points.filter((p) => wishlistIds.includes(p.id)).slice(0, 6),
    [points, wishlistIds]
  );

  const upcomingEvents = MOCK_EVENTS.slice(0, 4);

  const reasonFor = (p: MockRestPoint) => {
    if (activeStyle && REASON_HINTS[activeStyle]) return REASON_HINTS[activeStyle];
    const styles = getPointStyles(p.id);
    return REASON_HINTS[styles[0] ?? "nature"];
  };

  return (
    <div className="space-y-20 -mt-4">
      {/* HERO */}
      <section className="relative">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-border shadow-[var(--shadow-premium)]">
          <img
            src={HERO_IMAGE}
            alt="Иссык-Куль"
            width={1920}
            height={1080}
            className="w-full h-[560px] md:h-[640px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/85 via-foreground/40 to-foreground/15" />

          {/* Subtle topo overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl text-white space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/30">
                <Sparkles className="h-3 w-3 text-gold-light" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Powered by TOUROSAT AI
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold font-display leading-[1.05] tracking-[-0.025em] text-balance">
                Откройте Кыргызстан{" "}
                <span className="text-gradient-gold">умнее</span>
                <span className="opacity-90"> — со спутника и сердцем.</span>
              </h1>

              <p className="text-base md:text-xl text-white/85 max-w-2xl leading-relaxed">
                AI-помощник, который подберёт Rest Point под вашу историю —
                горы, озёра, юрты, культуру, тишину или семейный отдых.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate("/concierge")}
                  className="h-14 px-7 text-base font-bold rounded-2xl bg-white text-primary hover:bg-white/95 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-premium"
                >
                  <Bot className="mr-1 h-5 w-5" />
                  Спросить AI Concierge
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/map")}
                  className="h-14 px-7 text-base font-bold rounded-2xl bg-white/10 backdrop-blur border-2 border-white/40 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-premium"
                >
                  <MapPin className="mr-1 h-5 w-5" />
                  Открыть карту
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search bar floating below hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative -mt-8 mx-auto max-w-3xl px-4"
        >
          <div className="glass-strong rounded-2xl p-2 shadow-[var(--shadow-elevated)] flex items-center gap-2 border border-white">
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Куда хотите поехать? (Иссык-Куль, юрта, горы...)"
                className="border-0 bg-transparent focus-visible:ring-0 h-11 text-base px-0"
              />
            </div>
            <Button
              onClick={() => navigate("/concierge")}
              className="h-11 px-4 rounded-xl bg-gradient-to-br from-primary to-primary-dark hover:opacity-95 font-bold shrink-0"
            >
              <Bot className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">AI Concierge</span>
              <span className="sm:hidden">AI</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* TRAVEL STYLE FILTERS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Стиль путешествия
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 [&::-webkit-scrollbar]:hidden">
          {TRAVEL_STYLES.map((s) => {
            const active = activeStyle === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStyle(active ? null : s.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-bold border transition-premium ${
                  active
                    ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground border-primary shadow-[var(--shadow-glow-teal)]"
                    : "bg-card text-foreground/80 border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* FOR YOU */}
      <section className="space-y-6">
        {sectionTitle(
          activeStyle
            ? `Для вас · ${TRAVEL_STYLES.find((s) => s.id === activeStyle)?.label}`
            : "Подобрано для вас",
          "For You"
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[360px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(filtered.length ? filtered : forYou).slice(0, 8).map((p, i) => (
              <RecommendationCard key={p.id} point={p} reason={reasonFor(p)} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* BEST BY SCORE — horizontal */}
      <section className="space-y-6">
        {sectionTitle("Лучшие по TOUROSAT Score", "Best by TOUROSAT")}
        <div className="flex gap-5 overflow-x-auto pb-3 -mx-2 px-2 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {(loading ? [] : bestByScore).map((p, i) => (
            <div key={p.id} className="snap-start">
              <RecommendationCard
                point={p}
                index={i}
                variant="compact"
                reason={`Score ${p.tourosatScore}/100 · Confidence ${p.confidence}%`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* WISHLIST */}
      {wishlistPoints.length > 0 && (
        <section className="space-y-6">
          {sectionTitle("Сохранённое", "Wishlist")}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistPoints.map((p, i) => (
              <RecommendationCard key={p.id} point={p} index={i} reason={reasonFor(p)} />
            ))}
          </div>
        </section>
      )}

      {wishlistPoints.length === 0 && (
        <section className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-accent border border-primary/20 mx-auto">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-extrabold font-display">Ваш wishlist пока пуст</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Нажмите на сердечко на любой карточке, чтобы сохранить место и спланировать поездку.
          </p>
        </section>
      )}

      {/* NEARBY EVENTS */}
      <section className="space-y-6">
        {sectionTitle("События и фестивали", "Nearby this season")}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingEvents.map((e, i) => (
            <EventCard key={e.id} event={e} index={i} />
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="space-y-6">
        {sectionTitle("Сейчас популярно", "Trending today")}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trending.slice(0, 3).map((p, i) => (
            <RecommendationCard
              key={p.id}
              point={p}
              index={i}
              reason={`${p.transactionsToday} бронирований сегодня`}
            />
          ))}
        </div>
      </section>

      {/* AI CTA */}
      <section className="rounded-[2rem] overflow-hidden relative shadow-[var(--shadow-premium)]">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 2px), radial-gradient(circle at 80% 70%, white 1px, transparent 2px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center text-primary-foreground">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur border border-white/30">
              <Bot className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                AI Concierge
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold font-display leading-tight tracking-tight">
              Расскажите, какой отдых ищете —{" "}
              <span className="text-gradient-gold">AI подберёт за секунды</span>
            </h2>
            <p className="text-base md:text-lg opacity-90 max-w-lg">
              Спросите на русском, кыргызском или английском. AI знает все 19 Rest
              Points и подскажет, почему именно это место подходит вам.
            </p>
            <Link
              to="/concierge"
              className="inline-flex items-center gap-2 h-14 px-7 rounded-2xl bg-white text-primary font-bold text-base hover:bg-white/95 hover:-translate-y-0.5 transition-premium shadow-lg"
            >
              Открыть AI Concierge
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              "Тихое место у Иссык-Куля до 7000 сом",
              "Семьёй с детьми, хорошая дорога",
              "Конный тур и юрты на джайлоо",
            ].map((q, i) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl bg-white/15 backdrop-blur border border-white/25 p-4 text-sm font-medium"
              >
                <span className="text-gold-light font-bold">“</span>
                {q}
                <span className="text-gold-light font-bold">”</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TouristPage;
