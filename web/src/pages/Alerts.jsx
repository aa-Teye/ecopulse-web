import { useEffect, useState } from "react";
import { Siren, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import SegmentedControl from "../../../shared-components/SegmentedControl/SegmentedControl.jsx";
import {
  fetchAlerts,
  acknowledgeAlert,
  markSafe,
} from "../api/endpoints/alerts.js";

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}


// Three short beeps, synthesized with the Web Audio API so the alert makes
// noise without bundling an audio file. Browsers block autoplay audio that
// isn't tied to a user gesture, so failures here are expected on some
// browsers/tabs (e.g. before the user has clicked anything on the page)
// and are swallowed rather than surfaced as an error.
function playAlertTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const beepAt = (startTime) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    };
    const now = ctx.currentTime;
    beepAt(now);
    beepAt(now + 0.35);
    beepAt(now + 0.7);
  } catch {
    // Web Audio unavailable or blocked — the visual banner still works.
  }
}

function LiveAlertBanner({ alert, onSafe, dismissing }) {
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (alert.severity === "critical") playAlertTone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert.id]);

  if (minimized) {
    return (
      <div className="bg-coral text-white rounded-2xl p-4 flex items-center justify-between shadow-card animate-fade-up">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <p className="font-display font-bold text-xs sm:text-sm truncate">{alert.title}</p>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors shrink-0"
        >
          Expand alert <ChevronDown size={13} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-coral text-white p-4 sm:p-5 lg:p-6 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between shadow-card-lg animate-fade-up">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[180, 320, 480, 640].map((size, i) => (
          <span
            key={i}
            className="coral-ring"
            style={{
              width: size,
              height: size,
              top: "35%",
              left: "80%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-3 mb-3">
        <div className="eyebrow !text-white/90 before:!bg-white/70">
          LIVE EMERGENCY ALERT
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-[11px] font-medium text-white/80 hover:text-white flex items-center gap-1 bg-black/10 px-2.5 py-1 rounded-full"
          aria-label="Minimize alert"
        >
          Minimize <ChevronUp size={13} />
        </button>
      </div>

      <div className="relative z-10 space-y-2.5">
        <h2 className="font-display font-extrabold text-lg sm:text-2xl lg:text-3xl leading-tight">
          {alert.title}
        </h2>
        <p className="text-white/90 max-w-2xl text-xs sm:text-sm leading-relaxed">
          {alert.message}
        </p>

        {alert.sirenActive && (
          <div className="inline-flex items-start gap-2 bg-white/15 backdrop-blur-sm rounded-xl p-2.5 sm:px-4 sm:py-2.5 max-w-lg border border-white/20">
            <Siren size={16} className="shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="text-xs sm:text-sm font-semibold">Siren active on site</p>
              <p className="text-[11px] text-white/80 mt-0.5">{alert.sirenNote}</p>
            </div>
          </div>
        )}

        {alert.shelter && (
          <p className="text-xs sm:text-sm text-white/95 pt-0.5">
            Nearest accessible shelter:{" "}
            <span className="font-bold underline decoration-white/50">{alert.shelter.name}</span>{" "}
            (ETA <span className="font-mono">{alert.shelter.etaMin} min</span>).
          </p>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap gap-3 mt-5 pt-3 border-t border-white/20">
        <Button
          variant="ghost"
          className="!bg-white !text-coral !border-0 hover:!bg-white/90 font-bold !px-5 !py-2.5 text-xs sm:text-sm"
          onClick={onSafe}
          disabled={dismissing}
        >
          {dismissing ? "Marking safe…" : "I'm safe"}
        </Button>
        <a href="tel:112">
          <Button
            variant="ghost"
            className="!bg-transparent !text-white !border-white/50 hover:!bg-white/10 !px-5 !py-2.5 text-xs sm:text-sm"
          >
            Call responder
          </Button>
        </a>
      </div>
    </div>
  );
}


export default function Alerts() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("emergency");
  const [dismissingLive, setDismissingLive] = useState(false);
  const [liveDismissed, setLiveDismissed] = useState(false);
  const [ackIds, setAckIds] = useState(new Set());

  useEffect(() => {
    fetchAlerts().then(setData);
  }, []);

  async function handleSafe() {
    setDismissingLive(true);
    try {
      await markSafe();
      setLiveDismissed(true);
    } finally {
      setDismissingLive(false);
    }
  }

  async function handleAck(id) {
    setAckIds((s) => new Set(s).add(id));
    await acknowledgeAlert(id);
  }

  if (!data) {
    return (
      <div className="section-pad py-12 w-full">
        <LoadingSpinner label="Loading alerts…" />
      </div>
    );
  }

  const feed = data.feed.filter((a) => a.category === tab);

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-4">
        <div className="eyebrow mb-1">Alert Centre</div>
        <h1 className="text-lg sm:text-xl lg:text-2xl text-forest">Alerts &amp; Broadcast Notifications</h1>
      </div>

      {data.live && !liveDismissed && (
        <LiveAlertBanner
          alert={data.live}
          onSafe={handleSafe}
          dismissing={dismissingLive}
        />
      )}

      <div className="flex items-center justify-between">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { value: "emergency", label: "Emergency Alerts" },
            { value: "routine", label: "Routine Notices" },
          ]}
        />
      </div>

      {feed.length === 0 ? (
        <Card className="text-center text-body py-12">
          <AlertCircle size={32} className="mx-auto mb-2 text-body/40" />
          <p className="font-bold text-forest text-sm">No active notifications in this feed</p>
          <p className="text-xs text-body mt-0.5">Check back later for community status updates.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {feed.map((item) => {
            const acked = item.acknowledged || ackIds.has(item.id);
            return (
              <Card
                key={item.id}
              className={`!p-3 sm:!p-4 flex flex-col justify-between h-full transition-all ${!acked ? "border-l-4 border-l-forest" : ""}`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2.5">
                    <p className="font-display font-bold text-forest text-sm sm:text-base flex items-center gap-2">
                      {!acked && (
                        <span
                          className="w-2 h-2 rounded-full bg-forest shrink-0 animate-pulse-dot"
                          aria-hidden
                        />
                      )}
                      {item.title}
                    </p>
                    <span className="font-mono text-[11px] text-body/60 shrink-0">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-body leading-relaxed pt-0.5">{item.message}</p>
                </div>
                {!acked && (
                  <div className="pt-3 border-t border-hairline mt-3.5 flex justify-end">
                    <Button
                      variant="ghost"
                      className="!text-xs !px-3.5 !py-1.5 font-bold"
                      onClick={() => handleAck(item.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
