import { AnimatePresence, motion } from "framer-motion";
import { Activity, Filter, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  fmtCurrency,
  fmtRelative,
  fmtTime,
  generateTransaction,
  seedTransactions,
  type FundTransaction,
} from "@/mocks/fundData";

const REGIONS = ["Все", "Иссык-Куль", "Нарын", "Чуй", "Талас", "Ош", "Джалал-Абад", "Баткен"];

const statusBadge = (s: FundTransaction["status"]) => {
  switch (s) {
    case "completed":
      return "bg-success/10 text-success-deep border-success/25";
    case "settled":
      return "bg-primary/10 text-primary-dark border-primary/25";
    case "processing":
      return "bg-gold/15 text-gold-deep border-gold/30";
  }
};

const statusLabel: Record<FundTransaction["status"], string> = {
  completed: "Completed",
  settled: "Settled",
  processing: "Processing",
};

export const LivePaymentStream = () => {
  const [txs, setTxs] = useState<FundTransaction[]>(() => seedTransactions(20));
  const [paused, setPaused] = useState(false);
  const [region, setRegion] = useState("Все");
  const [tick, setTick] = useState(0);
  const newIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const tx = generateTransaction(0);
      newIds.current.add(tx.id);
      setTxs((prev) => [tx, ...prev].slice(0, 40));
      setTimeout(() => newIds.current.delete(tx.id), 2400);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(id);
  }, [paused]);

  // Refresh relative-time labels every 10s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => (region === "Все" ? txs : txs.filter((t) => t.region === region)),
    [txs, region, tick], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const liveFundTotal = filtered.reduce((s, t) => s + t.fundShare, 0);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-foreground to-[hsl(222,47%,16%)] text-white shadow-[var(--shadow-premium)] overflow-hidden border border-foreground/40">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl bg-success/20 border border-success/40 flex items-center justify-center">
            <Activity className="h-5 w-5 text-success" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-foreground">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
            </span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-display tracking-tight flex items-center gap-2">
              Live Payment Stream
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-success px-2 py-0.5 rounded-full bg-success/10 border border-success/30">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </h2>
            <p className="text-[12px] text-white/55 mt-0.5">
              Real-time транзакции · Доля Фонда обновляется автоматически
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-white/60 mr-2">
            <Filter className="h-3.5 w-3.5" />
            Регион
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-xs bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 [color-scheme:dark]"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r} className="bg-foreground text-white">
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-3 py-2 transition-colors"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      {/* Live mini-summary bar */}
      <div className="px-6 py-3 border-b border-white/10 bg-white/[0.03] grid grid-cols-3 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 font-bold">Tx in view</p>
          <p className="text-base font-extrabold font-display tabular-nums mt-0.5">{filtered.length}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 font-bold">Fund share (12%)</p>
          <p className="text-base font-extrabold font-display tabular-nums mt-0.5 text-gold-light">
            {fmtCurrency(liveFundTotal)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45 font-bold">Status</p>
          <p
            className={cn(
              "text-base font-extrabold font-display mt-0.5",
              paused ? "text-gold-light" : "text-success",
            )}
          >
            {paused ? "Paused" : "Streaming"}
          </p>
        </div>
      </div>

      {/* Stream */}
      <div className="max-h-[560px] overflow-y-auto divide-y divide-white/5">
        <AnimatePresence initial={false}>
          {filtered.map((tx) => {
            const isNew = newIds.current.has(tx.id);
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -16, backgroundColor: "rgba(16,185,129,0.18)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: isNew ? 1.6 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="px-4 sm:px-6 py-3.5 hover:bg-white/[0.04] transition-colors text-sm
                  flex flex-col gap-2
                  md:grid md:grid-cols-12 md:gap-3 md:items-center"
              >
                {/* Mobile row 1: time + status */}
                <div className="flex items-center justify-between md:hidden">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white/45 font-mono tabular-nums">
                      {fmtTime(tx.timestamp)}
                    </span>
                    <span className="text-[10px] text-white/35">{fmtRelative(tx.timestamp)} ago</span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusBadge(tx.status),
                    )}
                  >
                    {statusLabel[tx.status]}
                  </span>
                </div>

                {/* Desktop time col */}
                <div className="hidden md:flex md:col-span-2 flex-col">
                  <span className="text-[11px] text-white/45 font-mono tabular-nums">
                    {fmtTime(tx.timestamp)}
                  </span>
                  <span className="text-[10px] text-white/35 mt-0.5">{fmtRelative(tx.timestamp)} ago</span>
                </div>

                <div className="md:col-span-3 min-w-0">
                  <p className="font-bold text-white truncate">{tx.pointName}</p>
                  <p className="text-[11px] text-white/50 truncate">{tx.region}</p>
                </div>
                <div className="md:col-span-2 min-w-0 flex items-center gap-2">
                  <span className="text-base">{tx.payerFlag}</span>
                  <div className="min-w-0">
                    <p className="text-[12px] text-white/85 truncate">{tx.payer}</p>
                    <p className="text-[10px] text-white/40 truncate">{tx.method}</p>
                  </div>
                </div>

                {/* Mobile + desktop amount row */}
                <div className="flex items-center justify-between gap-3 md:contents">
                  <div className="md:col-span-2 md:text-right">
                    <p className="font-bold text-white tabular-nums font-display">
                      {fmtCurrency(tx.grossAmount)}
                    </p>
                    <p className="text-[10px] text-white/40">gross</p>
                  </div>
                  <div className="md:col-span-2 md:text-right text-right">
                    <p className="font-extrabold text-gold-light tabular-nums font-display">
                      +{fmtCurrency(tx.fundShare)}
                    </p>
                    <p className="text-[10px] text-white/40">to Fund · 12%</p>
                  </div>
                </div>

                {/* Desktop status */}
                <div className="hidden md:block md:col-span-1 text-right">
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusBadge(tx.status),
                    )}
                  >
                    {statusLabel[tx.status]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-white/50 text-sm">
            Нет транзакций в выбранном регионе.
          </div>
        )}
      </div>
    </div>
  );
};
