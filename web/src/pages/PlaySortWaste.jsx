import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Recycle, Trash2 } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { completeGame } from "../api/endpoints/games.js";

const ITEMS = [
  { name: "Plastic bottle", recyclable: true },
  { name: "Banana peel", recyclable: false },
  { name: "Glass bottle", recyclable: true },
  { name: "Used tissue", recyclable: false },
  { name: "Aluminium can", recyclable: true },
  { name: "Plastic bag", recyclable: false },
  { name: "Cardboard box", recyclable: true },
  { name: "Food waste", recyclable: false },
  { name: "Styrofoam cup", recyclable: false },
  { name: "Newspaper", recyclable: true },
  { name: "Broken ceramic plate", recyclable: false },
  { name: "Tin can", recyclable: true },
];

function shuffled() {
  return [...ITEMS].sort(() => Math.random() - 0.5);
}

export default function PlaySortWaste() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(shuffled);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const item = queue[index];
  const isLast = index === queue.length - 1;

  const progress = useMemo(() => Math.round((index / queue.length) * 100), [index, queue.length]);

  function handleAnswer(choseRecyclable) {
    if (feedback) return;
    const correct = choseRecyclable === item.recyclable;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? "correct" : "wrong");

    setTimeout(async () => {
      setFeedback(null);
      if (isLast) {
        setSubmitting(true);
        try {
          const finalScore = score + (correct ? 1 : 0);
          const res = await completeGame("sort_waste", finalScore);
          setResult(res);
        } finally {
          setSubmitting(false);
          setFinished(true);
        }
        return;
      }
      setIndex((i) => i + 1);
    }, 500);
  }

  function handleRestart() {
    setQueue(shuffled());
    setIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
    setResult(null);
  }

  if (finished) {
    return (
      <div className="section-pad max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-live-bg text-live-text flex items-center justify-center mx-auto shadow-sm">
          <Award size={32} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">{score} / {queue.length} sorted correctly</h1>
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
          <Button className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={handleRestart}>
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
          <div className="eyebrow mb-1">SORT THE WASTE</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
            <Recycle size={20} className="text-forest" /> Item {index + 1} of {queue.length}
          </h1>
        </div>
        <Link to="/play">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">All games</Button>
        </Link>
      </div>

      <div className="h-1.5 rounded-full bg-mint overflow-hidden">
        <div className="h-full bg-forest transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <Card className="!p-6 sm:!p-8 text-center space-y-6">
        <p className="text-xs sm:text-sm text-body">Is this item recyclable?</p>
        <p
          className={`font-display font-extrabold text-xl sm:text-2xl transition-colors ${
            feedback === "correct" ? "text-live-text" : feedback === "wrong" ? "text-coral" : "text-forest"
          }`}
        >
          {item.name}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAnswer(true)}
            disabled={!!feedback}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-live-text bg-live-bg/40 text-live-text font-bold hover:bg-live-bg transition-colors disabled:opacity-60"
          >
            <Recycle size={22} /> Recyclable
          </button>
          <button
            type="button"
            onClick={() => handleAnswer(false)}
            disabled={!!feedback}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-coral bg-coral/10 text-coral font-bold hover:bg-coral/20 transition-colors disabled:opacity-60"
          >
            <Trash2 size={22} /> Not Recyclable
          </button>
        </div>
      </Card>
    </div>
  );
}
