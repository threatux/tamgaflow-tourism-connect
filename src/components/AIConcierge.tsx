import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// You will need to configure CORS on your local LLM server (192.168.0.102) to allow requests from this origin.
const LLM_ENDPOINT = "http://192.168.0.102/api/v1/chat/completions";
const LLM_MODEL = "qwen2.5-7b-chat-v3";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AIConcierge = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Привет! Я AI Concierge TamgaFlow. Спросите меня о Rest Points, ценах или маршрутах по Иссык-Кулю.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(LLM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          model: LLM_MODEL,
        }),
      });
      const data = await res.json();
      const reply =
        data?.choices?.[0]?.message?.content ??
        data?.message ??
        "Ответ получен, но формат не распознан.";
      setMessages([...next, { role: "assistant", content: String(reply) }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "⚠️ Не удалось подключиться к локальному LLM (192.168.0.102). Проверьте сервер и CORS.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-premium)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center animate-pulse-glow group"
          aria-label="Открыть AI Concierge"
        >
          <Bot className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold border-2 border-background flex items-center justify-center">
            <Sparkles className="h-2.5 w-2.5 text-gold-foreground" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] glass rounded-3xl shadow-[var(--shadow-premium)] flex flex-col animate-scale-in overflow-hidden border border-border">
          <div
            className="flex items-center justify-between p-4 text-primary-foreground"
            style={{ background: "var(--gradient-premium)" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight font-display">AI Concierge</p>
                <p className="text-[10px] opacity-90 leading-tight uppercase tracking-wider font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Online · TamgaFlow
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex animate-fade-in",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap shadow-sm",
                    m.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-card/60 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Спросите AI..."
              disabled={loading}
              className="rounded-xl border-border/80 bg-background"
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              size="icon"
              className="rounded-xl bg-gradient-to-br from-primary to-primary-glow shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConcierge;
