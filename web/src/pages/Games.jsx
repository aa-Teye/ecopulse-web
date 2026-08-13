import { Link } from "react-router-dom";
import {
  Brain, Droplets, Recycle, ShieldCheck, Sun, Zap,
  Trash2, Gamepad2,
} from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";

const GAMES = [
  { to: "/play/quiz/flood", label: "Flood Safety Quiz", hint: "6 questions", icon: Droplets, color: "bg-coral/10 text-coral border-coral/20" },
  { to: "/play/quiz/waste", label: "Waste & Drainage Quiz", hint: "6 questions", icon: Trash2, color: "bg-emerald/10 text-emerald border-emerald/20" },
  { to: "/play/quiz/climate", label: "Climate Basics Quiz", hint: "6 questions", icon: Sun, color: "bg-gold-soft text-sim-text border-gold/30" },
  { to: "/play/quiz/emergency", label: "Emergency Preparedness Quiz", hint: "6 questions", icon: ShieldCheck, color: "bg-forest/10 text-forest border-forest/20" },
  { to: "/play/quiz/recycling", label: "Recycling Quiz", hint: "6 questions", icon: Recycle, color: "bg-live-bg text-live-text border-emerald/30" },
  { to: "/play/quiz/water", label: "Water Conservation Quiz", hint: "6 questions", icon: Droplets, color: "bg-coral/10 text-coral border-coral/20" },
  { to: "/play/quiz/energy", label: "Renewable Energy Quiz", hint: "6 questions", icon: Zap, color: "bg-gold-soft text-sim-text border-gold/30" },
  { to: "/play/tap-drains", label: "Drain Rescue", hint: "30-second arcade game", icon: Gamepad2, color: "bg-forest/10 text-forest border-forest/20" },
  { to: "/play/sort-waste", label: "Sort the Waste", hint: "Recyclable or not?", icon: Recycle, color: "bg-live-bg text-live-text border-emerald/30" },
  { to: "/play/true-false", label: "True or False Rapid Fire", hint: "30-second speed round", icon: Brain, color: "bg-coral/10 text-coral border-coral/20" },
];

export default function Games() {
  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-3">
        <div className="eyebrow mb-1">PLAY & EARN</div>
        <h1 className="text-lg sm:text-xl lg:text-2xl">Climate games</h1>
        <p className="text-body text-xs sm:text-sm mt-1">
          Quick games and quizzes on flooding, climate, and sustainability — every one earns Eco-Tokens.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {GAMES.map((game) => (
          <Link key={game.to} to={game.to} className="h-full">
            <Card hover className="h-full group !p-4 flex flex-col items-center justify-center text-center min-h-[125px]">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 border ${game.color}`}>
                <game.icon size={20} strokeWidth={1.8} />
              </div>
              <p className="font-display font-bold text-forest text-xs sm:text-sm leading-snug">{game.label}</p>
              <p className="text-[11px] text-body mt-1 leading-tight">{game.hint}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
