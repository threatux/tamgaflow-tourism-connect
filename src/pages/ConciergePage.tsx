import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TourosatScore } from "@/components/TourosatScore";
import { WishlistButton } from "@/components/tourist/WishlistButton";
import {
  AI_SUGGESTIONS,
  REFINEMENT_OPTIONS,
  generateAIReply,
  getPointImage,
  type AIRecommendation,
} from "@/mocks/touristData";

interface UserMsg {
  role: "user";
  content: string;
}
interface AssistantMsg {
  role: "assistant";
  intro: string;
  recommendations: AIRecommendation[];
}
type Msg = UserMsg | AssistantMsg;

const ResultCard = ({ rec, index }: { rec: AIRecommendation; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-[var(--shadow-elevated)] hover:border-primary/30 transition-premium"
  >
    <div className="grid grid-cols-[112px,1fr] gap-0">
      <Link to={`/point/${rec.point.id}`} className="relative block">
        <img
          src={getPointImage(rec.point.id)}
          alt={rec.point.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1.5 left-1.5">
          <WishlistButton pointId={rec.point.id} size="sm" />
        </div>
      </Link>

      <div className="p-3.5 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/point/${rec.point.id}`}
              className="text-sm font-extrabold text-foreground hover:text-primary transition-colors leading-tight block truncate"
            >
              {rec.point.name}
            </Link>
            <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {rec.point.region} · {rec.point.weather.icon} {rec.point.weather.temp}°
            </p>
          </div>
          <div className="shrink-0 scale-[0.55] origin-top-right -mt-2 -mr-1">
            <TourosatScore
              score={rec.point.tourosatScore}
              size="md"
              showSources={false}
            />
          </div>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed">
          <span className="text-primary font-bold">AI: </span>
          {rec.reason}
        </p>

        <div className="flex flex-wrap gap-1">
          {rec.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-foreground/70 border border-border"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm font-extrabold font-display text-foreground tabular-nums">
            {rec.point.recommendedPrice.toLocaleString("ru-RU")}{" "}
            <span className="text-[10px] font-medium text-muted-foreground">сом</span>
          </p>
          <Link
            to={`/point/${rec.point.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors"
          >
            Подробнее <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const ConciergePage = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply = generateAIReply(trimmed);
      setMessages((m) => [
        ...m,
        { role: "assistant", intro: reply.intro, recommendations: reply.recommendations },
      ]);
      setThinking(false);
    }, 700 + Math.random() * 500);
  };

  const refine = (append: string) => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user") as
      | UserMsg
      | undefined;
    const base = lastUser?.content ?? "Подбери место";
    send(`${base}, ${append}`);
  };

  const empty = messages.length === 0;

  return (
    <div className="-mt-4 grid lg:grid-cols-[1fr,320px] gap-6 lg:gap-8 min-h-[calc(100vh-9rem)]">
      {/* CHAT COLUMN */}
      <div className="flex flex-col rounded-3xl border border-border bg-card/70 backdrop-blur shadow-[var(--shadow-card)] overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 text-primary-foreground border-b border-border/30 relative overflow-hidden"
          style={{ background: "var(--gradient-teal)" }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 30%, white 1px, transparent 2px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-display tracking-tight">
                  AI Concierge
                </h1>
                <p className="text-[11px] uppercase tracking-[0.18em] opacity-90 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Powered by TOUROSAT · RU · KG · EN
                </p>
              </div>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/30 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-gold-light" />
              19 Rest Points
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6 min-h-[400px] max-h-[calc(100vh-22rem)]">
          {empty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-10 space-y-4"
            >
              <div className="inline-flex items-center justify-center size-16 rounded-3xl bg-gradient-to-br from-primary to-primary-dark shadow-[var(--shadow-glow-teal)]">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight">
                Куда хотите поехать?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Опишите идеальный отдых на русском, кыргызском или английском. AI
                подберёт 3–5 Rest Points и объяснит, почему именно они подходят.
              </p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[85%] rounded-3xl rounded-br-md px-5 py-3 bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-md">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3 max-w-[85%]">
                      <p className="text-sm leading-relaxed text-foreground">{m.intro}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 pl-12">
                    {m.recommendations.map((r, j) => (
                      <ResultCard key={r.point.id + j} rec={r} index={j} />
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="size-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-card border border-border px-4 py-3.5 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full bg-primary"
                    style={{
                      animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1.5 font-semibold">
                  TOUROSAT думает...
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Refinements */}
        {messages.some((m) => m.role === "assistant") && !thinking && (
          <div className="px-5 md:px-7 pb-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground self-center mr-1">
                Уточнить:
              </span>
              {REFINEMENT_OPTIONS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => refine(r.append)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-[12px] font-semibold text-foreground/80 border border-border hover:border-primary/40 hover:text-primary hover:bg-accent transition-premium"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 md:p-5 border-t border-border bg-card/80 backdrop-blur">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Спросите — например: тихое место у озера на 2 ночи..."
              disabled={thinking}
              className="h-12 rounded-xl border-border bg-background text-base"
            />
            <Button
              onClick={() => send(input)}
              disabled={thinking || !input.trim()}
              className="h-12 px-5 rounded-xl bg-gradient-to-br from-primary to-primary-dark hover:opacity-95 font-bold shadow-[var(--shadow-glow-teal)]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* SUGGESTIONS COLUMN */}
      <aside className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark mb-3">
            Попробуйте спросить
          </p>
          <div className="space-y-2">
            {AI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={thinking}
                className="w-full text-left p-3 rounded-2xl bg-secondary border border-border hover:border-primary/40 hover:bg-accent transition-premium group"
              >
                <p className="text-sm text-foreground/85 leading-relaxed group-hover:text-primary-dark transition-colors">
                  <Sparkles className="inline h-3 w-3 text-gold mr-1.5" />
                  {s}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-accent/40 to-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-deep mb-2">
            Как работает AI
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/80 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
              Парсит ваш запрос: стиль, бюджет, регион, язык
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
              Сопоставляет с TOUROSAT Score каждой точки
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
              Объясняет, почему именно это место подходит вам
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default ConciergePage;
