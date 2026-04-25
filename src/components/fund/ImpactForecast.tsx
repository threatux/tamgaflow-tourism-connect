import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { fmtCurrency, FORECAST_SCENARIOS, GROWTH_TIMELINE } from "@/mocks/fundData";

export const ImpactForecast = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-deep">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-display tracking-tight">Impact & Growth Forecast</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Прогноз дохода Фонда (5%) и общего GMV по месяцам сезона
            </p>
          </div>
        </div>
        <div className="p-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={GROWTH_TIMELINE} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190 91% 36%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(190 91% 36%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fund" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(215 20% 35%)", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 35%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}K`)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(214 32% 91%)",
                  boxShadow: "0 10px 30px -10px hsl(190 91% 36% / 0.25)",
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [fmtCurrency(v), name === "gmv" ? "GMV" : "Fund (5%)"]}
                labelStyle={{ fontWeight: 700, color: "hsl(222 47% 11%)" }}
              />
              <Area type="monotone" dataKey="gmv" stroke="hsl(190 91% 36%)" strokeWidth={2.5} fill="url(#gmv)" />
              <Area type="monotone" dataKey="fund" stroke="hsl(38 92% 50%)" strokeWidth={2.5} fill="url(#fund)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenarios */}
      <div className="grid md:grid-cols-3 gap-4">
        {FORECAST_SCENARIOS.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className={`relative rounded-3xl p-6 border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-premium overflow-hidden ${
              i === 1 ? "bg-gradient-to-br from-primary/8 via-card to-gold/8 border-primary/30" : "bg-card border-border"
            }`}
          >
            {i === 1 && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-[0.14em] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-muted-foreground">
              Scenario {i + 1}
            </p>
            <h3 className="text-2xl font-extrabold font-display text-foreground mt-1">{s.label}</h3>
            <p className="text-[12px] text-muted-foreground mt-1">{s.region}</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Бронирований</span>
                <span className="font-bold text-foreground tabular-nums">+{s.addedBookings.toLocaleString("ru-RU")}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Дополнительный GMV</span>
                <span className="font-bold text-foreground tabular-nums">+{fmtCurrency(s.addedGmv)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Score impact</span>
                <span className="font-bold text-success-deep tabular-nums">+{s.scoreImpact}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-muted-foreground">
                    Fund gain (5%)
                  </p>
                  <p className="text-2xl font-extrabold font-display text-gold-deep tabular-nums mt-0.5">
                    +{fmtCurrency(s.addedFundShare)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
