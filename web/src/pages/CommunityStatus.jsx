import { useEffect, useState } from "react";
import { ShieldCheck, AlertOctagon, Footprints, MapPin } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import { useStatusStore } from "../store/useStatusStore.js";

const OPTIONS = [
  { value: "safe", label: "I'm safe", Icon: ShieldCheck, tone: "bg-live-bg text-live-text border-emerald/30" },
  { value: "evacuating", label: "Evacuating", Icon: Footprints, tone: "bg-gold-soft text-sim-text border-gold/30" },
  { value: "need_help", label: "Need help", Icon: AlertOctagon, tone: "bg-coral/10 text-coral border-coral/20" },
];

const statusMeta = Object.fromEntries(OPTIONS.map((o) => [o.value, o]));

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export default function CommunityStatus() {
  const { board, myStatus, loading, loadBoard, setStatus } = useStatusStore();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(null);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  async function handleSetStatus(value) {
    setPending(value);
    try {
      await setStatus({ status: value, note: note.trim() || null });
      setNote("");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="section-pad py-5 sm:py-7 lg:py-10 space-y-5 sm:space-y-6 w-full">
      <div className="border-b border-hairline pb-4">
        <div className="eyebrow mb-1">COMMUNITY STATUS</div>
        <h1 className="text-xl sm:text-3xl lg:text-4xl">Check In With Your Neighbours</h1>
        <p className="text-body text-xs sm:text-sm mt-1">
          Share your status during an active flood event, visible to your neighbourhood and responders.
        </p>
      </div>

      {/* Set my status */}
      <Card className="!p-5 sm:!p-6 space-y-4">
        <div className="eyebrow">SET YOUR STATUS</div>
        <div className="grid sm:grid-cols-3 gap-3">
          {OPTIONS.map(({ value, label, Icon, tone }) => (
            <button
              key={value}
              onClick={() => handleSetStatus(value)}
              disabled={pending !== null}
              className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all disabled:opacity-50 ${
                myStatus === value ? "!border-forest !border-2" : tone
              }`}
            >
              {pending === value ? (
                <LoadingSpinner size={18} label="" />
              ) : (
                <Icon size={22} strokeWidth={2} />
              )}
              <span className="text-xs sm:text-sm font-bold">{label}</span>
            </button>
          ))}
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (e.g. 'water at the doorstep')"
          maxLength={140}
          className="w-full rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm text-forest placeholder:text-body/50 focus:outline-none focus:ring-2 focus:ring-forest/20"
        />
      </Card>

      {/* Summary counts */}
      {board && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {OPTIONS.map(({ value, label, Icon, tone }) => (
            <Card key={value} className={`!p-4 text-center border ${tone}`}>
              <Icon size={18} className="mx-auto mb-1.5" />
              <p className="font-display font-extrabold text-xl sm:text-2xl">
                {board.summary[value === "need_help" ? "needHelp" : value]}
              </p>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">{label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Live feed */}
      <div>
        <div className="eyebrow mb-2">RECENT CHECK-INS</div>
        {loading || !board ? (
          <LoadingSpinner label="Loading updates…" />
        ) : (
          <Card className="divide-y divide-hairline !p-4 sm:!p-6">
            {board.updates.map((u) => {
              const meta = statusMeta[u.status];
              return (
                <div key={u.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5">
                  <span className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${meta.tone}`}>
                    <meta.Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-bold text-forest text-xs sm:text-sm">{u.name}</p>
                      <span className="text-[10px] text-body/60 font-mono shrink-0">{timeAgo(u.timestamp)}</span>
                    </div>
                    {u.district && (
                      <p className="text-[11px] text-body flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {u.district}
                      </p>
                    )}
                    {u.note && <p className="text-xs text-forest mt-1 leading-relaxed">{u.note}</p>}
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
