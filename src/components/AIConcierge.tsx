import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
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
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
          aria-label="Открыть AI Concierge"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] bg-background border border-border rounded-xl shadow-2xl flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-3 border-b border-border bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="font-semibold text-sm leading-tight">AI Concierge</p>
                <p className="text-[10px] opacity-80 leading-tight">TamgaFlow Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-primary-foreground/20 rounded"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  ⏳ Думаю...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Спросите AI..."
              disabled={loading}
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConcierge;
