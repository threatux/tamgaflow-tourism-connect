import { Star } from "lucide-react";
import type { MockReview } from "@/mocks/touristData";

interface ReviewCardProps {
  review: MockReview;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="size-11 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-dark text-primary-foreground flex items-center justify-center font-extrabold text-sm font-display">
          {initials(review.author)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-extrabold text-foreground leading-tight">{review.author}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{review.country}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < review.rating ? "text-gold fill-gold" : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed mt-3">{review.text}</p>
          <p className="text-[10px] text-muted-foreground font-semibold mt-2 uppercase tracking-wider">
            {review.date}
          </p>
        </div>
      </div>
    </div>
  );
};
