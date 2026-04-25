import type { TransportOption } from "@/mocks/touristData";

interface GettingThereProps {
  options: TransportOption[];
}

export const GettingThere = ({ options }: GettingThereProps) => (
  <div className="grid sm:grid-cols-3 gap-3">
    {options.map((o) => (
      <div
        key={o.mode}
        className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-[var(--shadow-soft)] transition-premium"
      >
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-accent border border-primary/20 flex items-center justify-center text-xl">
            {o.icon}
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground">{o.label}</p>
            <p className="text-[11px] text-muted-foreground font-semibold">{o.duration}</p>
          </div>
        </div>
        <p className="text-base font-extrabold font-display text-foreground tabular-nums mt-3">
          {o.price}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{o.note}</p>
      </div>
    ))}
  </div>
);
