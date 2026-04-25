import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { type MockEvent, getEventTypeMeta } from "@/mocks/touristData";

interface EventCardProps {
  event: MockEvent;
  index?: number;
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

export const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const meta = getEventTypeMeta(event.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="group bg-card rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-gold/40 transition-premium"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/15 to-transparent" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold text-foreground border border-white/70">
          <span>{meta.emoji}</span>
          {meta.label}
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-95">
            <Calendar className="h-3 w-3" />
            {fmtDate(event.date)}
            {event.durationDays > 1 && <span>· {event.durationDays} дн.</span>}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h4 className="text-base font-extrabold font-display text-foreground leading-tight tracking-tight">
          {event.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold pt-1">
          <MapPin className="h-3 w-3" />
          {event.region} · {event.distanceKm} км
        </div>
      </div>
    </motion.div>
  );
};
