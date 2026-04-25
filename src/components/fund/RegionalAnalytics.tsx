import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { fmtCurrency, fmtNumber, REGION_STATS } from "@/mocks/fundData";

const scoreColor = (s: number) => {
  if (s >= 80) return "hsl(160 84% 39%)";
  if (s >= 65) return "hsl(190 91% 36%)";
  if (s >= 50) return "hsl(38 92% 50%)";
  return "hsl(0 84% 60%)";
};

export const RegionalAnalytics = () => {
  const maxRevenue = Math.max(...REGION_STATS.map((r) => r.revenue));

  return (
    <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-dark">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-display tracking-tight">Региональная аналитика</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Распределение оборота, доли Фонда и качества по регионам КР
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="py-3 px-6 font-bold">Регион</th>
              <th className="py-3 px-4 font-bold">Точек</th>
              <th className="py-3 px-4 font-bold">Бронирований</th>
              <th className="py-3 px-4 font-bold">Avg Score</th>
              <th className="py-3 px-4 font-bold w-[280px]">Оборот сезона</th>
              <th className="py-3 px-6 font-bold text-right">Доля Фонда (5%)</th>
            </tr>
          </thead>
          <tbody>
            {REGION_STATS.map((r, i) => (
              <motion.tr
                key={r.region}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border/60 last:border-0 hover:bg-accent/40 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-muted-foreground tabular-nums w-5">
                      {i + 1}
                    </span>
                    <span className="font-bold text-foreground">{r.region}</span>
                  </div>
                </td>
                <td className="py-4 px-4 tabular-nums font-semibold text-foreground">
                  {r.activePoints}
                </td>
                <td className="py-4 px-4 tabular-nums text-muted-foreground">
                  {fmtNumber(r.bookings)}
                </td>
                <td className="py-4 px-4">
                  <span
                    className="font-extrabold tabular-nums font-display"
                    style={{ color: scoreColor(r.avgScore) }}
                  >
                    {r.avgScore}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark"
                        style={{ boxShadow: "0 0 8px hsl(190 91% 36% / 0.45)" }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {fmtCurrency(r.revenue)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-extrabold text-gold-deep tabular-nums font-display">
                    {fmtCurrency(r.fundShare)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
