import { Radio } from "lucide-react";

// Alex sets this on Vercel once vMix + the YouTube channel are streaming —
// copy the "Embed" URL YouTube gives you for the live video (Share > Embed
// > copy the src="..." value), not the regular watch link.
const EMBED_URL = import.meta.env.VITE_YOUTUBE_LIVE_EMBED_URL;

export default function HackathonTV() {
  return (
    <div className="section-pad py-6 sm:py-8 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0">
          <Radio size={18} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl leading-tight">Hackathon TV</h1>
          <p className="text-body text-xs">Live coverage from the ground</p>
        </div>
      </div>

      {EMBED_URL ? (
        <div className="rounded-2xl overflow-hidden shadow-card-lg border border-hairline aspect-video bg-black">
          <iframe
            src={EMBED_URL}
            title="Hackathon TV live stream"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-hairline bg-mint/30 aspect-video flex items-center justify-center text-center px-6">
          <p className="text-body text-sm">Not live right now — check back soon.</p>
        </div>
      )}
    </div>
  );
}
