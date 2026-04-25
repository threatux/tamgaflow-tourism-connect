import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPopupCard } from "@/components/MapPopupCard";
import { getRestPoints } from "@/mocks/api";
import {
  CATEGORIES,
  REGIONS,
  type MockRestPoint,
} from "@/mocks/restPoints";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Score → ring color
const scoreColor = (score: number) => {
  if (score >= 80) return { hex: "#10B981", name: "emerald" };
  if (score >= 60) return { hex: "#0891B2", name: "teal" };
  if (score >= 40) return { hex: "#F59E0B", name: "gold" };
  return { hex: "#EF4444", name: "coral" };
};

const buildScoreIcon = (score: number, premium: boolean) => {
  const { hex } = scoreColor(score);
  const pulseHtml = premium
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${hex};opacity:0.35;animation:tamga-pulse 2s ease-out infinite;"></div>`
    : "";
  return L.divIcon({
    className: "tamga-score-pin",
    html: `
      <div style="position:relative;width:42px;height:42px;">
        ${pulseHtml}
        <div style="
          position:relative;
          width:42px;height:42px;
          border-radius:50%;
          background:linear-gradient(135deg, ${hex}, ${hex}dd);
          border:2.5px solid white;
          box-shadow:0 6px 18px ${hex}66, 0 2px 6px rgba(15,23,42,0.18);
          display:flex;align-items:center;justify-content:center;
          color:white;font-weight:800;font-size:13px;
          font-family:Manrope,Inter,system-ui,sans-serif;
          letter-spacing:-0.02em;
        ">${Math.round(score)}</div>
      </div>
      <style>
        @keyframes tamga-pulse {
          0%   { transform: scale(1);   opacity: 0.45; }
          100% { transform: scale(2.2); opacity: 0;    }
        }
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 24px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: hsl(0 0% 100% / 0.95) !important;
          box-shadow: 0 6px 14px -6px rgba(15,23,42,0.18) !important;
        }
        .leaflet-popup-close-button {
          top: 10px !important;
          right: 12px !important;
          color: hsl(215 20% 35%) !important;
          font-size: 22px !important;
          font-weight: 300 !important;
        }
      </style>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
  });
};

const FlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, Math.max(map.getZoom(), 9), { duration: 0.8 });
  }, [position, map]);
  return null;
};

const LEGEND = [
  { label: "Premium", range: "80+", color: "#10B981" },
  { label: "Good", range: "60–79", color: "#0891B2" },
  { label: "Average", range: "40–59", color: "#F59E0B" },
  { label: "Low", range: "<40", color: "#EF4444" },
];

const MapPage = () => {
  const navigate = useNavigate();

  const [points, setPoints] = useState<MockRestPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [scoreRange, setScoreRange] = useState<[number, number]>([35, 100]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1500, 7000]);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [focus, setFocus] = useState<[number, number] | null>(null);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  useEffect(() => {
    let alive = true;
    getRestPoints().then((data) => {
      if (alive) {
        setPoints(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return points.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.region.toLowerCase().includes(q))
        return false;
      if (p.tourosatScore < scoreRange[0] || p.tourosatScore > scoreRange[1]) return false;
      if (p.recommendedPrice < priceRange[0] || p.recommendedPrice > priceRange[1])
        return false;
      if (activeRegions.length && !activeRegions.includes(p.region)) return false;
      if (activeCategories.length && !activeCategories.includes(p.category)) return false;
      return true;
    });
  }, [points, query, scoreRange, priceRange, activeRegions, activeCategories]);

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent border border-primary/20">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-dark">
            🛰 Live карта · Кыргызстан
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight">
          Rest Points <span className="text-gradient-teal">по всей стране</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          {filtered.length} точек · цвет маркера = TOUROSAT Score · кликните для деталей
        </p>
      </div>

      {/* Map shell */}
      <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-[var(--shadow-elevated)] h-[78vh] bg-card">
        {/* Top search bar */}
        <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-3 items-center">
          <div className="flex-1 max-w-xl glass-strong rounded-2xl px-4 h-12 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Куда вы хотите поехать?"
              className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="glass-strong rounded-2xl h-12 px-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground shadow-[var(--shadow-card)] transition-premium hover:bg-card"
          >
            <SlidersHorizontal className="size-4" />
            Фильтры
          </button>
        </div>

        {/* Left filter panel */}
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-20 left-4 z-[1000] w-72 max-h-[calc(78vh-6rem)] overflow-y-auto glass-strong rounded-2xl p-5 space-y-5 shadow-[var(--shadow-elevated)]"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Категория
              </p>
              <div className="space-y-2">
                {CATEGORIES.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-foreground"
                  >
                    <Checkbox
                      checked={activeCategories.includes(c.id)}
                      onCheckedChange={() => toggle(activeCategories, c.id, setActiveCategories)}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Регион
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {REGIONS.map((r) => {
                  const active = activeRegions.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => toggle(activeRegions, r, setActiveRegions)}
                      className={`text-[11px] font-semibold py-1.5 px-2 rounded-lg border transition-premium ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  TOUROSAT Score
                </p>
                <span className="text-[11px] font-bold tabular-nums text-foreground">
                  {scoreRange[0]}–{scoreRange[1]}
                </span>
              </div>
              <Slider
                min={35}
                max={100}
                step={1}
                value={scoreRange}
                onValueChange={(v) => setScoreRange([v[0], v[1]] as [number, number])}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Цена / ночь, сом
                </p>
                <span className="text-[11px] font-bold tabular-nums text-foreground">
                  {priceRange[0].toLocaleString("ru-RU")}–{priceRange[1].toLocaleString("ru-RU")}
                </span>
              </div>
              <Slider
                min={1500}
                max={7000}
                step={100}
                value={priceRange}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
              />
            </div>

            <button
              onClick={() => {
                setQuery("");
                setScoreRange([35, 100]);
                setPriceRange([1500, 7000]);
                setActiveRegions([]);
                setActiveCategories([]);
              }}
              className="w-full text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors py-1"
            >
              Сбросить фильтры
            </button>
          </motion.div>
        )}

        {/* Bottom-right legend */}
        <div className="absolute bottom-4 right-4 z-[1000] glass-strong rounded-2xl p-3.5 shadow-[var(--shadow-card)] space-y-1.5 min-w-[180px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
            TOUROSAT Score
          </p>
          {LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: l.color, boxShadow: `0 0 0 2px ${l.color}33` }}
              />
              <span className="flex-1">{l.label}</span>
              <span className="text-muted-foreground tabular-nums">{l.range}</span>
            </div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 z-[900] grid place-items-center bg-card/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-strong shadow-[var(--shadow-card)]">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span className="text-sm font-semibold text-foreground">Загрузка карты...</span>
            </div>
          </div>
        )}

        <MapContainer
          center={[42.0, 75.0]}
          zoom={7}
          scrollWheelZoom
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          {/* CartoDB Positron — premium light style */}
          <TileLayer
            attribution='&copy; OpenStreetMap, &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          <FlyTo position={focus} />
          {filtered.map((p, i) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={buildScoreIcon(p.tourosatScore, p.tourosatScore >= 85)}
              eventHandlers={{
                click: () => setFocus([p.lat, p.lng]),
              }}
              opacity={0}
              ref={(ref) => {
                if (ref) {
                  // Stagger fade-in
                  setTimeout(() => ref.setOpacity(1), 30 * i);
                }
              }}
            >
              <Popup maxWidth={400} minWidth={360} closeButton autoPan>
                <MapPopupCard
                  point={p}
                  onPay={() => navigate(`/tourist?point=${encodeURIComponent(p.name)}`)}
                  onDetails={() => navigate(`/tourist?point=${encodeURIComponent(p.name)}`)}
                />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
