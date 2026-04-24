import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { REST_POINTS_GEO } from "@/data/restPoints";
import { WeatherBadge } from "@/components/WeatherBadge";

// Fix default marker icons (Leaflet + bundlers)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const buildIcon = (status: string) => {
  const color =
    status === "🟢" ? "#10b981" : status === "🟡" ? "#f59e0b" : "#ef4444";
  return L.divIcon({
    className: "tamga-pin",
    html: `<div style="position:relative;width:36px;height:36px;"><div style="position:absolute;inset:0;background:${color};border-radius:50%;opacity:0.3;animation:tamga-pulse 2s ease-out infinite;"></div><div style="position:relative;background:linear-gradient(135deg, ${color}, ${color}cc);width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 6px 16px rgba(0,0,0,0.25), 0 0 0 1px ${color}55;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;">📍</div></div><style>@keyframes tamga-pulse{0%{transform:scale(1);opacity:0.5}100%{transform:scale(2);opacity:0}}</style>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const MapPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Default icon fallback
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            🛰 Live карта · Иссык-Куль
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
          Rest Points региона <span className="text-gradient-premium">Иссык-Куль</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Кликните на маркер, чтобы увидеть данные точки и оплатить услуги
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-elevated)] h-[70vh] relative">
        <MapContainer
          center={[42.45, 77.5]}
          zoom={9}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {REST_POINTS_GEO.map((p) => (
            <Marker
              key={p.name}
              position={[p.lat, p.lon]}
              icon={buildIcon(p.status)}
            >
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <strong className="text-base">{p.name}</strong>
                    <span className="text-lg">{p.status}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Score:</span>{" "}
                      <strong>{p.tourism_score}/100</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Транзакций сегодня:</span>{" "}
                      <strong>{p.transactions_today}</strong>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Доход:</span>{" "}
                      <strong>{p.revenue_som.toLocaleString()} сом</strong>
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-muted-foreground">Текущая погода:</span>{" "}
                      <WeatherBadge lat={p.lat} lon={p.lon} />
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() =>
                      navigate(`/tourist?point=${encodeURIComponent(p.name)}`)
                    }
                  >
                    Перейти к оплате →
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
