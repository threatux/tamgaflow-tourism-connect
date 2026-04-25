import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Check, RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rewriteDescription } from "@/mocks/ownerData";
import { toast } from "sonner";

const MODES = [
  { key: "premium", label: "Премиальнее", icon: "✨" },
  { key: "warm", label: "Теплее", icon: "🤗" },
  { key: "short", label: "Короче", icon: "⚡" },
  { key: "family", label: "Для семей", icon: "👨‍👩‍👧" },
  { key: "english", label: "English", icon: "🌍" },
] as const;

interface Props {
  text: string;
  onAccept?: (text: string) => void;
}

export const AiCopyHelper = ({ text, onAccept }: Props) => {
  const [improved, setImproved] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async (mode: typeof MODES[number]["key"]) => {
    setActiveMode(mode);
    setLoading(true);
    const result = await rewriteDescription(text, mode);
    setImproved(result);
    setLoading(false);
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-[var(--shadow-card)] overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-br from-accent/40 to-card flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
          <Wand2 className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold font-display text-foreground">AI редактор описания</h3>
          <p className="text-xs text-muted-foreground">Улучшите текст одним кликом</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => handleRewrite(m.key)}
              disabled={loading}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-premium ${
                activeMode === m.key
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-muted/40 text-foreground border-border hover:border-primary/40 hover:bg-accent"
              } disabled:opacity-50`}
            >
              <span className="mr-1.5">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-muted/30 p-5 space-y-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                  className="h-3 rounded-full bg-muted"
                  style={{ width: `${100 - i * 12}%` }}
                />
              ))}
            </motion.div>
          )}

          {improved && !loading && (
            <motion.div
              key={improved.slice(0, 24)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card p-5 relative">
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                  AI Версия
                </span>
                <p className="text-sm text-foreground leading-relaxed">{improved}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-xl bg-success hover:bg-success-deep text-white"
                  onClick={() => {
                    onAccept?.(improved);
                    toast.success("Описание обновлено");
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                  Принять
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => activeMode && handleRewrite(activeMode as typeof MODES[number]["key"])}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Регенерировать
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(improved);
                    toast.success("Скопировано");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Копировать
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
