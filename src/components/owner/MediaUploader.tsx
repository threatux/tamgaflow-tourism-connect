import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, Star, Lightbulb } from "lucide-react";

interface UploadedFile {
  id: string;
  url: string;
  name: string;
}

const AI_TIPS = [
  "Добавьте хотя бы одно экстерьерное фото",
  "Дневные снимки увеличивают конверсию на 24%",
  "Фото с пейзажем повышают привлекательность",
  "Покажите интерьер юрты / комнаты",
];

export const MediaUploader = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (filelist: FileList | null) => {
    if (!filelist) return;
    const next = Array.from(filelist).map((f) => ({
      id: `${f.name}-${Math.random().toString(16).slice(2, 8)}`,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setFiles((prev) => {
      const combined = [...prev, ...next];
      if (!coverId && combined[0]) setCoverId(combined[0].id);
      return combined;
    });
  };

  const remove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (coverId === id) setCoverId(null);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-premium p-8 text-center ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/50 hover:bg-accent/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-extrabold font-display text-foreground">
              Перетащите фото или нажмите для загрузки
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG · до 10 МБ · минимум 6 фото для премиум-листинга
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 gap-3"
          >
            {files.map((f) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 group ${
                  coverId === f.id ? "border-gold shadow-[var(--shadow-glow-gold)]" : "border-border"
                }`}
              >
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setCoverId(f.id)}
                    className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center shadow-sm"
                    title="Сделать обложкой"
                  >
                    <Star className={`h-3.5 w-3.5 ${coverId === f.id ? "text-gold fill-gold" : "text-foreground"}`} />
                  </button>
                  <button
                    onClick={() => remove(f.id)}
                    className="h-7 w-7 rounded-lg bg-destructive/90 hover:bg-destructive text-white flex items-center justify-center shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {coverId === f.id && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-gold text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Обложка
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tips */}
      <div className="rounded-2xl border border-border bg-accent/30 p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Lightbulb className="h-4 w-4 text-primary-dark" />
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary-dark">
              Подсказки от TOUROSAT AI
            </p>
            <ul className="space-y-1">
              {AI_TIPS.slice(0, files.length === 0 ? 4 : 2).map((tip) => (
                <li key={tip} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <ImageIcon className="h-3.5 w-3.5" />
        <span className="tabular-nums">
          Загружено: <span className="font-bold text-foreground">{files.length}</span> · Минимум 6
        </span>
      </div>
    </div>
  );
};
