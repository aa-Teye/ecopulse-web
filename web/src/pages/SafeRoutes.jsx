import { useEffect, useState } from "react";
import { Route, Navigation, Clock, AlertTriangle } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import { fetchSafeRoutes } from "../api/endpoints/safeRoutes.js";
import { fetchShelters } from "../api/endpoints/shelters.js";

const riskTone = {
  high: "bg-coral/10 text-coral border-coral/20",
  moderate: "bg-gold-soft text-sim-text border-gold/30",
  low: "bg-live-bg text-live-text border-emerald/30",
};

export default function SafeRoutes() {
  const [routes, setRoutes] = useState(null);
  const [shelters, setShelters] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchSafeRoutes().then((r) => {
      setRoutes(r);
      setActive(r[0]?.id ?? null);
    });
    fetchShelters().then(setShelters);
  }, []);

  const current = routes?.find((r) => r.id === active);
  const shelter = shelters?.find((s) => s.id === current?.shelterId);

  return (
    <div className="section-pad py-5 sm:py-7 lg:py-10 space-y-5 sm:space-y-6 w-full">
      <div className="border-b border-hairline pb-4">
        <div className="eyebrow mb-1">SAFE ROUTES</div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl">Evacuation Paths</h1>
        <p className="text-body text-xs sm:text-sm mt-1">
          Recommended routes to the nearest shelter, avoiding known flood points.
        </p>
      </div>

      {!routes ? (
        <LoadingSpinner label="Loading routes…" />
      ) : (
        <div className="grid md:grid-cols-12 gap-5 sm:gap-6">
          {/* Zone selector */}
          <div className="md:col-span-4 space-y-3">
            <div className="eyebrow mb-1">SELECT YOUR ZONE</div>
            {routes.map((r) => (
              <button key={r.id} onClick={() => setActive(r.id)} className="w-full text-left">
                <Card
                  hover
                  className={`!p-4 flex items-center justify-between gap-3 ${
                    active === r.id ? "!border-forest !border-2" : ""
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-forest text-sm">{r.zone}</p>
                    <p className="text-[11px] text-body mt-0.5">→ {r.shelterName}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 border ${riskTone[r.riskLevel]}`}>
                    {r.riskLevel}
                  </span>
                </Card>
              </button>
            ))}
          </div>

          {/* Route detail */}
          <div className="md:col-span-8">
            {current && (
              <Card className="!p-5 sm:!p-6 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="eyebrow mb-1">{current.zone} → {current.shelterName}</div>
                    <div className="flex items-center gap-4 text-xs text-body font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Route size={13} /> {current.distanceKm} km</span>
                      <span className="inline-flex items-center gap-1.5"><Clock size={13} /> ~{current.etaMinutes} min on foot</span>
                    </div>
                  </div>
                  {current.riskLevel === "high" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-coral bg-coral/10 border border-coral/20 rounded-full px-3 py-1.5">
                      <AlertTriangle size={13} /> High risk zone
                    </span>
                  )}
                </div>

                <ol className="space-y-3">
                  {current.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-mint text-forest font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-forest leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>

                {shelter && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block"
                  >
                    <Button className="!text-xs !py-2.5 !px-5 gap-1.5">
                      <Navigation size={14} /> Open turn-by-turn directions
                    </Button>
                  </a>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
