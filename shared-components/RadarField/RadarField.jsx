/**
 * Shared Motif — "God's Eye" Radar Field Component
 * Used as an absolute background layer inside dark forest-green hero bands.
 * Features grid lines, sweeping radar scanline, and pulsing sensor hotspot pins.
 */
export default function RadarField({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top-right concentric pulse ring image */}
      <img
        src="/assets/home-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-right-top opacity-85"
      />

      {/* Background Grid Lines */}
      <svg className="w-full h-full relative z-10 opacity-30" width="100%" height="100%">
        <defs>
          <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#radar-grid)" />
      </svg>

      {/* Radial Scanline Sweep */}
      <div className="absolute inset-0 flex items-center justify-center relative z-10 opacity-40">
        <div className="w-[450px] h-[450px] rounded-full border border-white/10 relative flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-white/10" />
          <div className="w-[150px] h-[150px] rounded-full border border-white/10" />
          
          {/* Sweeping Radar Needle */}
          <div className="absolute inset-0 rounded-full animate-[radarSweep_7s_linear_infinite] motion-reduce:animate-none">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-gold/30 via-gold/5 to-transparent origin-bottom-right rounded-tl-full" />
          </div>
        </div>
      </div>

    </div>
  )
}
