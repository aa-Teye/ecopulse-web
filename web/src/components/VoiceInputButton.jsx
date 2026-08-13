import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "../hooks/useVoiceToText.js";

// Appends each transcribed chunk to whatever's already in the field, so
// speaking in short bursts doesn't overwrite what came before.
export default function VoiceInputButton({ onTranscript, className = "" }) {
  const { supported, listening, error, start, stop } = useVoiceToText({
    onResult: (text) => onTranscript((prev) => (prev ? `${prev} ${text}` : text)),
  });

  if (!supported) return null;

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
          listening
            ? "bg-coral text-white animate-pulse"
            : "bg-mint text-forest hover:bg-mint-dark"
        } ${className}`}
      >
        {listening ? <MicOff size={13} /> : <Mic size={13} />}
        {listening ? "Listening… tap to stop" : "Speak instead"}
      </button>
      {error && (
        <p className="text-[10px] text-coral font-medium max-w-[220px] leading-snug">{error}</p>
      )}
    </div>
  );
}
