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
    status === "🟢" ? "#16a34a" : status === "🟡" ? "#eab308" : "#dc2626";
  return L.divIcon({
    className: "tamga-pin",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:11px;">📍</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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
    <div className="space-y-4 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Rest Points региона Иссык-Куль
        </h1>
        <p className="text-muted-foreground text-sm">
          Кликните на маркер, чтобы увидеть данные точки
        </p>
      </div>

      <div className="rounded-lg overflow-hidden border border-border shadow-sm h-[70vh]">
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
