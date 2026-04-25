import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import type { MockRestPoint } from "@/mocks/restPoints";
import { getPointImage, getPointStyles, TRAVEL_STYLES } from "@/mocks/touristData";
import { WishlistButton } from "./WishlistButton";

const scoreBadgeClasses = (score: number) => {
  if (score >= 80) return "bg-success/15 text-success-deep border-success/30";
  if (score >= 60) return "bg-primary/10 text-primary-dark border-primary/30";
  if (score >= 40) return "bg-gold/15 text-gold-deep border-gold/30";
  return "bg-destructive/10 text-destructive border-destructive/30";
};

interface RecommendationCardProps {
  point: MockRestPoint;
  reason?: string;
  index?: number;
  variant?: "default" | "compact";
}

export const RecommendationCard = ({
  point,
  reason,
  index = 0,
  variant = "default",
}: RecommendationCardProps) => {
  const navigate = useNavigate();
  const styleTags = getPointStyles(point.id)
    .slice(0, 2)
    .map((s) => TRAVEL_STYLES.find((t) => t.id === s))
    .filter(Boolean) as { label: string; emoji: string }[];

  const isCompact = variant === "compact";

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/point/${point.id}`)}
      className={`group text-left bg-card rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/30 transition-premium w-full ${
        isCompact ? "min-w-[260px] max-w-[260px]" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={getPointImage(point.id)}
          alt={point.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

        {/* Top-left score badge */}
        <div
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold tabular-nums backdrop-blur-md border ${scoreBadgeClasses(
            point.tourosatScore
          )}`}
        >
          <Sparkles className="h-3 w-3" />
          {point.tourosatScore}
          <span className="font-semibold opacity-80">TOUROSAT</span>
        </div>

        {/* Top-right wishlist */}
        <div className="absolute top-2.5 right-2.5">
          <WishlistButton pointId={point.id} size="sm" />
        </div>

        {/* Bottom-left weather chip */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur text-[11px] font-bold text-foreground border border-white/70">
          <span>{point.weather.icon}</span>
          <span className="tabular-nums">{point.weather.temp}°</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="text-base font-extrabold font-display text-foreground leading-tight tracking-tight">
            {point.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{point.region}</span>
          </div>
        </div>

        {/* Tags */}
        {styleTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {styleTags.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold text-foreground/75 border border-border"
              >
                <span>{t.emoji}</span>
                {t.label}
              </span>
            ))}
          </div>
        )}

        {reason && (
          <p className="text-xs text-foreground/75 leading-relaxed line-clamp-2">
            <span className="text-primary font-bold">AI: </span>
            {reason}
          </p>
        )}

        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              от
            </p>
            <p className="text-lg font-extrabold font-display text-foreground tabular-nums leading-none">
              {point.recommendedPrice.toLocaleString("ru-RU")}{" "}
              <span className="text-xs font-medium text-muted-foreground">сом / ночь</span>
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
};
