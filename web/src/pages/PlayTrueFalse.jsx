import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Timer, Zap } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { completeGame } from "../api/endpoints/games.js";

const STATEMENTS = [
  { s: "Blocked drains are a major cause of urban flooding.", answer: true },
  { s: "Planting trees can help reduce flood risk.", answer: true },
  { s: "Climate change has no effect on rainfall patterns.", answer: false },
  { s: "Solar power produces greenhouse gases while generating electricity.", answer: false },
  { s: "It's safe to drive through fast-moving floodwater.", answer: false },
  { s: "Recycling helps reduce the amount of waste that can block drains.", answer: true },
  { s: "Emergency plans are only useful for large organizations, not households.", answer: false },
  { s: "112 is Ghana's unified emergency number.", answer: true },
  { s: "Renewable energy sources like wind and solar naturally replenish.", answer: true },
  { s: "Floodwater is always safe to walk through.", answer: false },
  { s: "Coal is considered a renewable energy source.", answer: false },
  { s: "Community drain cleanups can help prevent flooding.", answer: true },
  { s: "Fixing a leaking tap helps conserve water.", answer: true },
  { s: "Heatwaves are unrelated to climate change.", answer: false },
  { s: "Knowing your nearest shelter location helps you evacuate faster.", answer: true },
];

const GAME_SECONDS = 30;

function shuffled() {
  return [...STATEMENTS].sort(() => Math.random() - 0.5);
}

export default function PlayTrueFalse() {
  const navigate = useNavigate();
  const [queue] = useState(shuffled);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [phase, setPhase] = useState("ready"); // ready | playing | finished
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const scoreRef = useRef(0);
  const indexRef = useRef(0);

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
    completeGame("true_false", scoreRef.current)
      .then(setResult)
      .finally(() => setSubmitting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function handleStart() {
    setIndex(0);
    indexRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setResult(null);
    setSecondsLeft(GAME_SECONDS);
    setPhase("playing");
  }

  function handleAnswer(choice) {
    if (phase !== "playing") return;
    const current = queue[indexRef.current % queue.length];
    if (choice === current.answer) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
    indexRef.current += 1;
    setIndex(indexRef.current);
  }

  if (phase === "finished") {
    return (
      <div className="section-pad max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-live-bg text-live-text flex items-center justify-center mx-auto shadow-sm">
          <Award size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">{score} correct</h1>
          <p className="text-body text-xs sm:text-sm">
            {submitting || !result ? "Saving your score…" : (
              <>+<span className="font-mono text-forest font-bold">{result.pointsAwarded}</span> Eco-Tokens earned</>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={() => navigate("/play")}>
            More games
          </Button>
          <Button className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={handleStart}>
            Play again
          </Button>
        </div>
      </div>
    );
  }

  const current = queue[index % queue.length];

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div>
          <div className="eyebrow mb-1">TRUE OR FALSE</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
            <Zap size={20} className="text-forest" /> Rapid fire
          </h1>
        </div>
        <Link to="/play">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">All games</Button>
        </Link>
      </div>

      <Card className="!p-6 sm:!p-8 text-center space-y-6">
        {phase === "ready" ? (
          <div className="space-y-4 py-6">
            <p className="text-body text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              {GAME_SECONDS} seconds. Statements about climate and flood safety flash up — tap True or False as fast as you can.
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
              <span className="font-bold text-forest">Score: {score}</span>
            </div>

            <p className="font-display font-bold text-forest text-base sm:text-lg leading-snug min-h-[4.5rem] flex items-center justify-center">
              {current.s}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className="p-4 rounded-2xl border-2 border-live-text bg-live-bg/40 text-live-text font-bold hover:bg-live-bg transition-colors"
              >
                True
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className="p-4 rounded-2xl border-2 border-coral bg-coral/10 text-coral font-bold hover:bg-coral/20 transition-colors"
              >
                False
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
