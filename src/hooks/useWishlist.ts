import { useEffect, useState, useCallback } from "react";

const KEY = "tamgaflow-wishlist";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("tamgaflow-wishlist-change"));
  } catch {
    /* ignore */
  }
};

export const useWishlist = () => {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener("tamgaflow-wishlist-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tamgaflow-wishlist-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      const current = read();
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      write(next);
    },
    []
  );

  return { ids, has, toggle };
};
