import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, Users, Accessibility, LocateFixed } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import { fetchShelters } from "../api/endpoints/shelters.js";
import { useGeolocation } from "../hooks/useGeolocation.js";

// Haversine distance in km
function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export default function Shelters() {
  const [shelters, setShelters] = useState(null);
  const { coords, status, locate } = useGeolocation();

  useEffect(() => {
    fetchShelters().then(setShelters);
  }, []);

  const sorted = useMemo(() => {
    if (!shelters) return null;
    if (!coords) return shelters;
    return [...shelters]
      .map((s) => ({
        ...s,
        _distanceKm: distanceKm(coords, { lat: s.latitude, lng: s.longitude }),
      }))
      .sort((a, b) => a._distanceKm - b._distanceKm);
  }, [shelters, coords]);

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">SHELTER LOCATOR</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl">Nearby Evacuation Shelters</h1>
          <p className="text-body text-xs mt-1">
            Verified shelter sites across Ghana, sorted by distance when location is shared.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={locate}
          className="!text-xs !py-2 !px-4 gap-1.5 shrink-0 w-full sm:w-auto justify-center"
        >
          <LocateFixed size={14} />
          {status === "locating" ? "Locating…" : coords ? "Update my location" : "Use my location"}
        </Button>
      </div>

      {!sorted ? (
        <LoadingSpinner label="Loading shelters…" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {sorted.map((s) => {
            const pct = s.capacity ? Math.round((s.occupancy / s.capacity) * 100) : 0;
            return (
              <Card key={s.id} className="!p-4 sm:!p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-forest text-sm sm:text-base">{s.name}</p>
                    <p className="text-xs text-body mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" /> {s.address}
                    </p>
                  </div>
                  {typeof s._distanceKm === "number" && (
                    <span className="shrink-0 font-mono text-xs font-bold text-forest bg-mint rounded-full px-2.5 py-1">
                      {s._distanceKm.toFixed(1)} km
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-body">
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} /> {s.occupancy}/{s.capacity} ({pct}% full)
                  </span>
                  {s.accessibility && (
                    <span className="inline-flex items-center gap-1.5 text-forest font-semibold">
                      <Accessibility size={13} /> Accessible
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {s.amenities?.map((a) => (
                    <span key={a} className="text-[10px] font-semibold text-forest bg-mint rounded-full px-2 py-0.5">
                      {a}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <Button className="!text-xs !py-2 !px-4 gap-1.5">
                    <Navigation size={13} /> Directions
                  </Button>
                </a>
              </Card>
            );
          })}
        </div>
      )}

      {status === "error" && (
        <p className="text-xs text-coral">
          Couldn't get your location. Showing all shelters unsorted. You can still get directions to each.
        </p>
      )}
    </div>
  );
}
