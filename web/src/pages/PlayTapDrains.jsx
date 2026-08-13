import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Droplets, Timer } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { completeGame } from "../api/endpoints/games.js";

const GRID_SIZE = 9;
const GAME_SECONDS = 30;
const TICK_MS = 200;
const FILL_PER_TICK = 4;
const ACTIVATE_CHANCE = 0.12;

function emptyTiles() {
  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    fill: 0,
    state: "idle", // idle | filling | cleared | overflowed
  }));
}

export default function PlayTapDrains() {
  const navigate = useNavigate();
  const [tiles, setTiles] = useState(emptyTiles);
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [phase, setPhase] = useState("ready"); // ready | playing | finished
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return undefined;

    const interval = setInterval(() => {
      setTiles((prev) =>
        prev.map((tile) => {
          if (tile.state === "filling") {
            const nextFill = tile.fill + FILL_PER_TICK;
            if (nextFill >= 100) return { ...tile, fill: 100, state: "overflowed" };
            return { ...tile, fill: nextFill };
          }
          if (tile.state === "idle" && Math.random() < ACTIVATE_CHANCE) {
            return { ...tile, state: "filling", fill: 8 };
          }
          return tile;
        }),
      );
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    if (secondsLeft <= 0) {
      setPhase("finished");
      return undefined;
    }
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase !== "finished" || result) return;
    setSubmitting(true);
    completeGame("tap_drains", scoreRef.current)
      .then(setResult)
      .finally(() => setSubmitting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function handleTileClick(tile) {
    if (phase !== "playing" || tile.state !== "filling") return;
    setTiles((prev) => prev.map((t) => (t.id === tile.id ? { ...t, state: "cleared" } : t)));
    setScore((s) => {
      const next = s + 1;
      scoreRef.current = next;
      return next;
    });
  }

  function handleStart() {
    setTiles(emptyTiles());
    setSecondsLeft(GAME_SECONDS);
    setScore(0);
    scoreRef.current = 0;
    setResult(null);
    setPhase("playing");
  }

  if (phase === "finished") {
    return (
      <div className="section-pad max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-live-bg text-live-text flex items-center justify-center mx-auto shadow-sm">
          <Award size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">{score} drains cleared</h1>
          <p className="text-body text-xs sm:text-sm">
            {submitting || !result ? (
              "Saving your score…"
            ) : (
              <>
                +<span className="font-mono text-forest font-bold">{result.pointsAwarded}</span> Eco-Tokens earned
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={() => navigate("/")}>
            Back home
          </Button>
          <Button className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={handleStart}>
            Play again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div>
          <div className="eyebrow mb-1">DRAIN RESCUE</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
            <Droplets size={20} className="text-forest" /> Clear the drains before they overflow
          </h1>
        </div>
        <Link to="/play/quiz">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">Try the quiz instead</Button>
        </Link>
      </div>

      <Card className="!p-5 sm:!p-6 space-y-4">
        {phase === "ready" ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-body text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Drains around the grid will start filling with water. Tap one before it overflows to clear it.
              {" "}{GAME_SECONDS} seconds on the clock — clear as many as you can.
            </p>
            <Button className="!px-6 !py-3 text-sm font-bold" onClick={handleStart}>
              Start
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="flex items-center gap-1.5 text-body">
                <Timer size={14} /> {secondsLeft}s
              </span>
              <span className="font-bold text-forest">Cleared: {score}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {tiles.map((tile) => {
                let tone = "bg-mint border-hairline";
                if (tile.state === "filling") tone = "bg-white border-gold";
                if (tile.state === "cleared") tone = "bg-live-bg border-live-text";
                if (tile.state === "overflowed") tone = "bg-coral/10 border-coral";

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(tile)}
                    disabled={tile.state !== "filling"}
                    className={`relative aspect-square rounded-xl border-2 overflow-hidden flex items-center justify-center transition-colors ${tone}`}
                  >
                    {tile.state === "filling" && (
                      <span
                        className="absolute bottom-0 left-0 right-0 bg-sim-text/40 transition-all"
                        style={{ height: `${tile.fill}%` }}
                        aria-hidden
                      />
                    )}
                    <Droplets
                      size={20}
                      className={`relative z-10 ${
                        tile.state === "cleared"
                          ? "text-live-text"
                          : tile.state === "overflowed"
                            ? "text-coral"
                            : "text-forest/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
