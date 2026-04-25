import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  pointId: string;
  className?: string;
  size?: "sm" | "md";
}

export const WishlistButton = ({ pointId, className, size = "md" }: WishlistButtonProps) => {
  const { has, toggle } = useWishlist();
  const active = has(pointId);
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <button
      type="button"
      aria-label={active ? "Убрать из избранного" : "В избранное"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(pointId);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-white/85 backdrop-blur border border-white/70 shadow-sm transition-premium hover:scale-110 active:scale-95",
        dim,
        className
      )}
    >
      <motion.span
        key={String(active)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 16 }}
      >
        <Heart
          className={cn(
            icon,
            "transition-colors",
            active ? "text-destructive" : "text-foreground/70"
          )}
          fill={active ? "currentColor" : "none"}
          strokeWidth={2.2}
        />
      </motion.span>
    </button>
  );
};
