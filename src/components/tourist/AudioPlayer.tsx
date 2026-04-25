import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Volume2 } from "lucide-react";
import { type AudioGuide } from "@/mocks/touristData";

interface AudioPlayerProps {
  guide: AudioGuide;
  artwork: string;
  pointName: string;
}

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export const AudioPlayer = ({ guide, artwork, pointName }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - elapsedRef.current * 1000;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      elapsedRef.current = elapsed;
      const pct = Math.min(1, elapsed / guide.durationSec);
      setProgress(pct);
      if (pct >= 1) {
        setPlaying(false);
        elapsedRef.current = 0;
        setProgress(0);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, guide.durationSec]);

  const elapsedSec = progress * guide.durationSec;

  return (
    <div className="rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-card via-card to-accent shadow-[var(--shadow-card)]">
      <div className="p-5 flex items-center gap-4">
        {/* Artwork */}
        <div className="relative size-24 shrink-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border">
          <img src={artwork} alt={pointName} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-gold/30" />
          <motion.div
            animate={{ scale: playing ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Volume2 className="h-7 w-7 text-white drop-shadow" strokeWidth={2.4} />
          </motion.div>
        </div>

        {/* Meta */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark">
            🎧 Audio Guide · {pointName}
          </p>
          <h4 className="text-base font-extrabold font-display text-foreground leading-tight mt-1 tracking-tight">
            {guide.title}
          </h4>
          <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
            {guide.narrator} · {fmt(guide.durationSec)}
          </p>
        </div>

        <button
          aria-label={playing ? "Пауза" : "Воспроизвести"}
          onClick={() => setPlaying((p) => !p)}
          className="size-12 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-[var(--shadow-glow-teal)] hover:scale-105 active:scale-95 transition-premium"
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      {/* Progress */}
      <div className="px-5 pb-4">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(190 91% 36%), hsl(38 92% 50%))",
              width: `${progress * 100}%`,
            }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-bold tabular-nums mt-1.5">
          <span>{fmt(elapsedSec)}</span>
          <span>−{fmt(guide.durationSec - elapsedSec)}</span>
        </div>
      </div>

      {/* Story */}
      <div className="px-5 pb-5">
        <p className="text-sm text-foreground/80 leading-relaxed italic">
          “{guide.story}”
        </p>
      </div>
    </div>
  );
};
