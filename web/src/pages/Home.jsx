import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Droplets, TrendingUp, Trophy, Newspaper, Crown, Zap, Activity, Sprout, Gamepad2, Award } from 'lucide-react'
import Card from '../../../shared-components/Card/Card.jsx'
import AlertBanner from '../../../shared-components/AlertBanner/AlertBanner.jsx'
import LoadingSpinner from '../../../shared-components/LoadingSpinner/LoadingSpinner.jsx'
import RadarField from '../../../shared-components/RadarField/RadarField.jsx'
import { fetchNews, fetchWeather, fetchFloodRisk } from '../api/endpoints/home.js'
import { fetchGreenActs } from '../api/endpoints/greenActs.js'
import { isAuthenticated } from '../api/endpoints/auth.js'

function getUser() {
  try { return JSON.parse(localStorage.getItem('ecopulse_user') || '{}') } catch { return {} }
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3_600_000)
  if (hrs < 1) return 'Just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const quickActions = [
  { to: '/report-drain', label: 'Report a drain', hint: 'Photo + location', icon: Droplets, color: 'bg-emerald/10 text-emerald border-emerald/20' },
  { to: '/report-green-act', label: 'Log a green act', hint: 'Instant Eco-Tokens', icon: Sprout, color: 'bg-live-bg text-live-text border-emerald/30' },
  { to: '/play/quiz', label: 'Play & earn', hint: 'Quiz + drain game', icon: Gamepad2, color: 'bg-gold-soft text-sim-text border-gold/30' },
  { to: '/learn', label: 'Climate Literacy', hint: 'Lessons + leaderboard', icon: Trophy, color: 'bg-forest/10 text-forest border-forest/20' },
  { to: '/emergency-plan', label: 'Emergency plan', hint: 'Household + shelter', icon: Zap, color: 'bg-gold-soft text-sim-text border-gold/30' },
  { to: '/alerts', label: 'View alerts', hint: 'Live notifications', icon: TrendingUp, color: 'bg-coral/10 text-coral border-coral/20' },
]

const communityPhotos = [
  { src: '/assets/Group 1000009343.png', alt: 'Community member monitoring nature' },
  { src: '/assets/Group 1000009344.png', alt: 'Emergency rescue workers during flood' },
  { src: '/assets/Group 1000009345.png', alt: 'Resident checking flood alerts on phone' },
]

function riskTone(score) {
  if (score >= 75) return { label: 'Critical', color: '#E4572E', ring: true }
  if (score >= 45) return { label: 'Elevated', color: '#f2c94c', ring: false }
  return { label: 'Low risk', color: '#4C7A5D', ring: false }
}

function FloodRiskGauge({ score, zone }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const tone = riskTone(score)

  return (
    <div className="flex flex-row items-center justify-around sm:justify-start gap-4">
      <div className="relative shrink-0">
        <svg width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="#e4ebe6" strokeWidth="8" />
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={tone.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 56 56)"
            style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.34,1.2,0.64,1)' }}
          />
          <text x="56" y="53" textAnchor="middle" fontSize="24" fontFamily="'Poppins', sans-serif" fontWeight="800" fill="#0f3d2e">
            {score}%
          </text>
          <text x="56" y="69" textAnchor="middle" fontSize="9" fontFamily="'JetBrains Mono', monospace" fill="#4b5b54">
            {tone.label}
          </text>
        </svg>
        {tone.ring && (
          <span className="absolute inset-0 rounded-full border-2 border-coral animate-ring-expand pointer-events-none" />
        )}
      </div>
      <div>
        <div className="eyebrow mb-1">Today's flood risk</div>
        <p className="font-display font-bold text-base sm:text-xl text-forest">{zone}</p>
        <p className="text-xs text-body mt-1 leading-relaxed max-w-xs">
          Based on drainage conditions + GMet forecast.
        </p>
      </div>
    </div>
  )
}

function StreakCard() {
  const top3 = [
    { rank: 1, name: 'Ama K.', pts: 320 },
    { rank: 2, name: 'Kwesi T.', pts: 275 },
    { rank: 3, name: 'Comfort A.', pts: 140 },
  ]

  return (
    <Card className="!p-4 sm:!p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="font-display font-bold text-forest text-sm sm:text-base flex items-center gap-1.5">
              <Activity size={15} className="text-forest" /> 4-day cleanup streak
            </p>
            <p className="text-[11px] text-body mt-0.5">Keep it going!</p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-body bg-mint px-2 py-0.5 rounded-full border border-hairline">
            0 reports
          </span>
        </div>
        <div className="space-y-2">
          {top3.map((u) => (
            <div key={u.rank} className="flex items-center gap-2.5">
              <span className="font-mono text-xs text-body w-4 text-center">{u.rank}</span>
              <span className="flex-1 text-xs font-semibold text-forest">{u.name}</span>
              <span className="font-mono text-xs text-sim-text font-bold">{u.pts} pts</span>
              {u.rank === 1 && <Crown size={14} className="text-gold shrink-0" />}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-hairline text-[10px] sm:text-[11px] text-body text-right font-medium">
        Updated 10m ago
      </div>
    </Card>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [weather, setWeather] = useState(null)
  const [risk, setRisk] = useState(null)
  const [activity, setActivity] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/sign-in', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    fetchNews().then(setNews)
    fetchWeather().then(setWeather)
    fetchFloodRisk().then(setRisk)
    fetchGreenActs().then(setActivity)
  }, [])

  if (!isAuthenticated()) return null

  const user = getUser()
  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Neighbour'
  const district = user.district || 'Your District'

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">

      <div className="grid lg:grid-cols-12 gap-3 sm:gap-4 items-start">

        <div className="lg:col-span-7 relative rounded-2xl bg-forest text-white p-4 sm:p-5 lg:p-6 overflow-hidden shadow-card-lg flex flex-col justify-between self-start">
          <RadarField />
          <div className="relative z-10 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="eyebrow !text-white/80 before:!bg-gold">WƆNƆ – {district.toUpperCase()}</div>
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl leading-tight text-white">
              Obaak3,{' '}
              <span className="gold-highlight">{firstName}</span>
            </h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Join your community in monitoring drain health and staying prepared for heavy rains.
            </p>
          </div>
          <div className="relative z-10 pt-3 mt-3 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-xs text-white/80 font-mono">
            <span>District: {district}</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
          <Card className="flex flex-col justify-center !p-4 sm:!p-5 h-full">
            {risk ? (
              <FloodRiskGauge score={risk.score} zone={risk.zone} />
            ) : (
              <LoadingSpinner label="Loading flood risk…" />
            )}
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-2.5">Community in action</div>
          <div className="grid grid-cols-3 gap-2.5">
            {communityPhotos.map((photo, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl shadow-card w-full"
                style={{
                  aspectRatio: '1 / 1',
                  boxShadow: '0 4px 16px rgba(15,61,46,0.10)',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="eyebrow mb-2.5">Quick actions</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to} className="h-full">
                <Card hover className="h-full group !p-4 sm:!p-5 flex flex-col items-center justify-center text-center min-h-[120px] sm:min-h-[135px]">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 border ${action.color}`}>
                    <action.icon size={20} strokeWidth={1.8} />
                  </div>
                  <p className="font-display font-bold text-forest text-xs sm:text-sm leading-snug">{action.label}</p>
                  <p className="text-[11px] text-body mt-1 leading-tight">{action.hint}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {risk && risk.score >= 45 && (
        <AlertBanner
          tone={risk.score >= 75 ? 'danger' : 'warning'}
          title={`Flood risk is ${riskTone(risk.score).label.toLowerCase()} in ${risk.zone}`}
          message="Consider reviewing your emergency plan and checking nearby drains."
        />
      )}

      <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
        <StreakCard />
        <Card className="!p-4 sm:!p-5 flex flex-col justify-between">
          <div>
            <div className="eyebrow mb-2">WEATHER NOW</div>
            {weather ? (
              <>
                <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest">{weather.tempC}°C</p>
                <p className="text-xs sm:text-sm font-bold text-forest mt-1.5">{weather.condition}</p>
                <p className="text-[11px] font-mono text-body mt-0.5">Humidity {weather.humidity}% · Wind 12 km/h</p>
              </>
            ) : (
              <LoadingSpinner label="Loading weather…" />
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-hairline flex items-center justify-between text-[10px] sm:text-[11px] text-body">
            <span>Forecast source</span>
            <span className="font-semibold text-forest">GMet Ghana</span>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="eyebrow">Community activity</div>
          <Link to="/report-green-act" className="text-xs font-bold text-forest underline underline-offset-2 hover:text-forest-light">
            Log yours
          </Link>
        </div>
        {activity ? (
          activity.length === 0 ? (
            <Card className="!p-5 text-center text-body text-xs sm:text-sm">
              No green acts logged yet — be the first in your neighbourhood.
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
              {activity.slice(0, 6).map((item) => (
                <Card key={item.id} className="!p-4 flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-live-bg text-live-text flex items-center justify-center shrink-0">
                    <Award size={16} strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-forest leading-snug">
                      <span className="font-bold">{item.userName}</span> · {item.actionLabel.toLowerCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-[11px] text-body">
                      <span className="font-mono font-bold text-sim-text">+{item.pointsAwarded} pts</span>
                      <span>·</span>
                      <span>{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          <LoadingSpinner label="Loading community activity…" />
        )}
      </div>

      <div>
        <div className="eyebrow mb-2.5 sm:mb-3">Climate + flood news</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {news ? (
            news.map((item) => (
              <Card key={item.id} hover className="!p-4 flex flex-col justify-between h-full group">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-mint flex items-center justify-center text-forest">
                    <Newspaper size={14} strokeWidth={1.8} />
                  </div>
                  <p className="font-display font-bold text-forest text-xs sm:text-sm group-hover:text-forest-light transition-colors line-clamp-2 leading-snug">{item.title}</p>
                </div>
                <div className="pt-2.5 border-t border-hairline mt-3 flex items-center justify-between text-[11px] text-body">
                  <span className="font-mono">{item.source}</span>
                  <ArrowRight size={13} className="text-body/40 group-hover:text-forest group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))
          ) : (
            <LoadingSpinner label="Loading news…" />
          )}
        </div>
      </div>
    </div>
  )
}
