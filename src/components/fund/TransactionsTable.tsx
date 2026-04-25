import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtCurrency, fmtTime, seedTransactions, type FundTransaction } from "@/mocks/fundData";

const STATUSES: ("all" | FundTransaction["status"])[] = ["all", "completed", "settled", "processing"];

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

const scoreColor = (s: number) => {
  if (s >= 80) return "text-success-deep";
  if (s >= 60) return "text-primary-dark";
  if (s >= 40) return "text-gold-deep";
  return "text-destructive";
};

type SortKey = "time" | "gross" | "fund" | "score";

export const TransactionsTable = () => {
  const [data] = useState(() => seedTransactions(60));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE = 12;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = data.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (!q) return true;
      return (
        t.pointName.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.payer.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      const map = { time: a.timestamp - b.timestamp, gross: a.grossAmount - b.grossAmount, fund: a.fundShare - b.fundShare, score: a.tourosatScore - b.tourosatScore };
      return sortDesc ? -map[sortKey] : map[sortKey];
    });
    return list;
  }, [data, search, status, sortKey, sortDesc]);

  const pageItems = filtered.slice(page * PAGE, (page + 1) * PAGE);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setSortDesc((d) => !d);
    else {
      setSortKey(k);
      setSortDesc(true);
    }
  };

  const exportCsv = () => {
    const header = ["time", "point", "region", "payer", "method", "gross", "fund_5pct", "status", "score"];
    const rows = filtered.map((t) => [
      new Date(t.timestamp).toISOString(),
      t.pointName,
      t.region,
      t.payer,
      t.method,
      t.grossAmount,
      t.fundShare,
      t.status,
      t.tourosatScore,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tamgaflow-transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalGross = filtered.reduce((s, t) => s + t.grossAmount, 0);
  const totalFund = filtered.reduce((s, t) => s + t.fundShare, 0);

  return (
    <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold font-display tracking-tight">Транзакции</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Финансовая операционная таблица · Доля Фонда выделена золотом
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск точки, региона, плательщика…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-9 pr-3 py-2 text-xs bg-muted/40 border border-border rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as (typeof STATUSES)[number]);
              setPage(0);
            }}
            className="text-xs bg-muted/40 border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "Все статусы" : s}
              </option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-dark bg-primary/10 hover:bg-primary/15 border border-primary/25 rounded-xl px-3 py-2 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Sticky totals */}
      <div className="px-6 py-3 bg-muted/30 border-b border-border grid grid-cols-3 gap-4 text-[12px]">
        <div>
          <span className="text-muted-foreground">Записей: </span>
          <span className="font-bold text-foreground tabular-nums">{filtered.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Общий оборот: </span>
          <span className="font-bold text-foreground tabular-nums">{fmtCurrency(totalGross)}</span>
        </div>
        <div className="text-right md:text-left">
          <span className="text-muted-foreground">Доля Фонда (12%): </span>
          <span className="font-extrabold text-gold-deep tabular-nums">{fmtCurrency(totalFund)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border bg-muted/40 text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="py-3 px-6 font-bold">
                <button onClick={() => toggleSort("time")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Время <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-4 font-bold">Rest Point</th>
              <th className="py-3 px-4 font-bold">Регион</th>
              <th className="py-3 px-4 font-bold">Плательщик</th>
              <th className="py-3 px-4 font-bold">Метод</th>
              <th className="py-3 px-4 font-bold">
                <button onClick={() => toggleSort("score")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Score <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-4 font-bold text-right">
                <button onClick={() => toggleSort("gross")} className="inline-flex items-center gap-1 hover:text-foreground ml-auto">
                  Gross <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-4 font-bold text-right">
                <button onClick={() => toggleSort("fund")} className="inline-flex items-center gap-1 hover:text-foreground ml-auto">
                  Fund 12% <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-6 font-bold text-right">Статус</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-border/60 last:border-0 hover:bg-accent/40 transition-colors"
              >
                <td className="py-3.5 px-6 font-mono text-[12px] tabular-nums text-muted-foreground">
                  {fmtTime(t.timestamp)}
                </td>
                <td className="py-3.5 px-4 font-bold text-foreground">{t.pointName}</td>
                <td className="py-3.5 px-4 text-muted-foreground">{t.region}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span>{t.payerFlag}</span>
                    <span className="text-foreground">{t.payer}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{t.method}</td>
                <td className={cn("py-3.5 px-4 font-extrabold font-display tabular-nums", scoreColor(t.tourosatScore))}>
                  {t.tourosatScore}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-foreground tabular-nums">
                  {fmtCurrency(t.grossAmount)}
                </td>
                <td className="py-3.5 px-4 text-right font-extrabold text-gold-deep tabular-nums">
                  {fmtCurrency(t.fundShare)}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      statusBadge(t.status),
                    )}
                  >
                    {t.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between text-[12px]">
        <span className="text-muted-foreground">
          Стр. <span className="font-bold text-foreground">{page + 1}</span> из{" "}
          <span className="font-bold text-foreground">{pages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Назад
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            disabled={page >= pages - 1}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Вперёд
          </button>
        </div>
      </div>
    </div>
  );
};
