import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, X, Award, Brain } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import { completeGame } from "../api/endpoints/games.js";

const QUESTIONS = [
  {
    q: "What usually causes urban flooding in cities like Accra?",
    options: ["Heavy rainfall alone", "Blocked or clogged drains", "Ocean tides", "Earthquakes"],
    answer: 1,
  },
  {
    q: "You see rising floodwater near your home. What should you do first?",
    options: ["Take photos for social media", "Move to higher ground and avoid moving water", "Try to drive through it", "Wait and see what happens"],
    answer: 1,
  },
  {
    q: "True or false: even shallow, fast-moving floodwater can knock an adult off their feet.",
    options: ["True", "False"],
    answer: 0,
  },
  {
    q: "Why do tree planting and drain cleanups help prevent flooding?",
    options: ["They look nice", "They help water absorb and flow instead of pooling", "They stop rain", "They increase temperature"],
    answer: 1,
  },
  {
    q: "What's the best way to prepare your household for flood season?",
    options: ["Do nothing, floods are unpredictable", "Build an emergency plan with a shelter and route", "Move all valuables outside", "Ignore alerts"],
    answer: 1,
  },
  {
    q: "You spot a blocked drain near your home. What should you do?",
    options: ["Ignore it", "Report it through Wɔnɔ so responders can act", "Try to clear it yourself in heavy rain", "Only post about it on social media"],
    answer: 1,
  },
];

export default function PlayQuiz() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const question = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;

  function handleSelect(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.answer) setScore((s) => s + 1);
  }

  async function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelected(null);
      return;
    }
    setSubmitting(true);
    try {
      const res = await completeGame("quiz", score);
      setResult(res);
    } finally {
      setSubmitting(false);
      setFinished(true);
    }
  }

  function handleRestart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
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
          <h1 className="text-xl sm:text-3xl font-extrabold mb-1.5">
            {score} / {QUESTIONS.length} correct
          </h1>
          <p className="text-body text-xs sm:text-sm">
            {result ? (
              <>
                +<span className="font-mono text-forest font-bold">{result.pointsAwarded}</span> Eco-Tokens earned
              </>
            ) : (
              "Saving your score…"
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-3">
          <Button variant="secondary" className="!px-5 !py-2.5 text-xs sm:text-sm" onClick={() => navigate("/")}>
            Back home
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
          <div className="eyebrow mb-1">CLIMATE QUIZ</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
            <Brain size={20} className="text-forest" /> Question {index + 1} of {QUESTIONS.length}
          </h1>
        </div>
        <Link to="/play/tap-drains">
          <Button variant="ghost" className="shrink-0 !text-xs !px-4 !py-2">Try the drain game</Button>
        </Link>
      </div>

      <Card className="!p-5 sm:!p-6 space-y-4">
        <p className="font-display font-bold text-forest text-sm sm:text-base leading-relaxed">{question.q}</p>

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.answer;
            const isPicked = i === selected;
            let tone = "bg-white border-hairline text-body hover:border-forest/30";
            if (selected !== null) {
              if (isCorrect) tone = "bg-live-bg/40 border-live-text text-forest font-semibold";
              else if (isPicked) tone = "bg-coral/10 border-coral text-coral font-semibold";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`w-full flex items-center justify-between gap-2 p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${tone}`}
              >
                {opt}
                {selected !== null && isCorrect && <Check size={16} className="shrink-0" />}
                {selected !== null && isPicked && !isCorrect && <X size={16} className="shrink-0" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <Button
            className="w-full justify-center py-3 text-xs sm:text-sm font-bold"
            onClick={handleNext}
            disabled={submitting}
          >
            {submitting ? "Saving…" : isLast ? "See my score" : "Next question"}
          </Button>
        )}
      </Card>
    </div>
  );
}
