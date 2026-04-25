import { motion } from "framer-motion";
import type { MonthlyForecast } from "@/mocks/ownerData";

export const ForecastChart = ({ data }: { data: MonthlyForecast[] }) => {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 h-56 px-1">
        {data.map((d, i) => {
          const h = (d.revenue / max) * 100;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2 min-w-0 group">
              <span className="text-[10px] font-bold tabular-nums text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {Math.round(d.revenue / 1000)}K
              </span>
              <div className="relative w-full flex-1 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-xl relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(190 91% 36% / 0.95), hsl(160 84% 39% / 0.85))",
                    boxShadow: "0 4px 14px hsl(190 91% 36% / 0.25)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        "linear-gradient(180deg, white 0%, transparent 50%)",
                    }}
                  />
                </motion.div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-foreground">{d.month}</p>
                <p className="text-[10px] text-muted-foreground tabular-nums">{d.bookings} брон.</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-primary" /> Доход
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-success" /> Заполняемость
        </span>
      </div>
    </div>
  );
};
