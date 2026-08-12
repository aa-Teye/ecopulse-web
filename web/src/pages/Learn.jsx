import { useEffect, useState } from 'react'
import { Clock, CheckCircle2, Trophy, Crown, BookOpen } from 'lucide-react'
import Card from '../../../shared-components/Card/Card.jsx'
import Button from '../../../shared-components/Button/Button.jsx'
import LoadingSpinner from '../../../shared-components/LoadingSpinner/LoadingSpinner.jsx'
import SegmentedControl from '../../../shared-components/SegmentedControl/SegmentedControl.jsx'
import Modal from '../../../shared-components/Modal/Modal.jsx'
import RadarField from '../../../shared-components/RadarField/RadarField.jsx'
import { fetchLessons, completeLesson, fetchLeaderboard } from '../api/endpoints/learn.js'

const LESSON_COVERS = {
  'l-1': '/assets/Frame 16 (2).png',
  'l-2': '/assets/Frame 17 (1).png',
  'l-3': '/assets/Frame 18 (1).png',
  'l-4': '/assets/Frame 19 (1).png',
}

function ProgressRing({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const r = 28
  const c = 2 * Math.PI * r
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
      <circle
        cx="34" cy="34" r={r} fill="none"
        stroke="#f2c94c" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
        transform="rotate(-90 34 34)"
        style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.34,1.2,0.64,1)' }}
      />
      <text x="34" y="39" textAnchor="middle" fontSize="14" fontFamily="'Poppins', sans-serif" fontWeight="800" fill="#ffffff">
        {pct}%
      </text>
    </svg>
  )
}

function LessonModal({ lesson, onClose, onComplete }) {
  if (!lesson) return null
  return (
    <Modal open onClose={onClose} labelledBy="lesson-modal-title">
      {LESSON_COVERS[lesson.id] && (
        <div className="relative w-full h-44 -mx-0 mb-5 overflow-hidden rounded-2xl">
          <img
            src={LESSON_COVERS[lesson.id]}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="eyebrow mb-1 font-semibold">{lesson.minutes} MIN LESSON</div>
      <h3 id="lesson-modal-title" className="text-xl sm:text-2xl font-bold mb-2 text-forest">{lesson.title}</h3>
      <p className="text-xs sm:text-sm text-body mb-5 leading-relaxed">{lesson.summary}</p>
      <div className="flex flex-wrap gap-2.5">
        {lesson.completed ? (
          <>
            <Button variant="ghost" className="!bg-live-bg !text-live-text !border-0 !px-4 !py-2 text-xs" disabled>
              Completed
            </Button>
            <Button variant="ghost" className="!px-4 !py-2 text-xs" onClick={onClose}>Close</Button>
          </>
        ) : (
          <>
            <Button className="!px-5 !py-2.5 text-xs font-bold" onClick={() => onComplete(lesson.id)}>Mark as done</Button>
            <Button variant="ghost" className="!px-4 !py-2.5 text-xs" onClick={onClose}>Dismiss</Button>
          </>
        )}
      </div>
    </Modal>
  )
}

function PointsInfoModal({ open, onClose, howToEarn }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="points-modal-title">
      <h3 id="points-modal-title" className="text-lg font-bold mb-3 text-forest">How to earn Eco-Tokens</h3>
      <div className="space-y-3">
        {howToEarn?.map((row) => (
          <div key={row.action} className="flex items-center justify-between text-xs sm:text-sm border-b border-hairline pb-2.5 last:border-0">
            <span className="text-forest font-semibold">{row.action}</span>
            <span className="font-mono text-sim-text font-bold text-sm">+{row.points} pts</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function LearnTab({ lessons, onOpen }) {
  const done = lessons.filter((l) => l.completed).length

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="relative rounded-2xl bg-forest text-white p-4 sm:p-5 lg:p-6 shadow-card-lg overflow-hidden">
        <RadarField />
        <div className="relative z-10 flex items-center gap-4 sm:gap-5">
          <ProgressRing done={done} total={lessons.length} />
          <div className="space-y-1">
            <p className="eyebrow !text-white/70 before:!bg-gold">WƆNƆ</p>
            <p className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-white leading-tight">
              Climate Literacy Hub
            </p>
            <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed max-w-lg">
              {done} of {lessons.length} modules done · Bite-sized lessons, under 5 minutes each
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onOpen(lesson)}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-xl"
          >
            <div
              className={`relative overflow-hidden rounded-xl shadow-card transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-card-lg ${lesson.completed ? 'ring-2 ring-emerald/60' : ''}`}
              style={{ aspectRatio: '16 / 7' }}
            >
              {LESSON_COVERS[lesson.id] ? (
                <img
                  src={LESSON_COVERS[lesson.id]}
                  alt={lesson.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-forest/20 flex items-center justify-center">
                  <BookOpen size={24} className="text-forest/40" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full">
                <Clock size={10} strokeWidth={2.5} />
                {lesson.minutes} min
              </div>

              {lesson.completed && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-emerald/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={10} strokeWidth={2.5} />
                  Done
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <p className="font-display font-bold text-white text-sm sm:text-base leading-snug drop-shadow-sm">
                  {lesson.title}
                </p>
                <p className="text-white/75 text-[11px] mt-0.5 leading-relaxed line-clamp-2 drop-shadow-sm hidden sm:block">
                  {lesson.summary}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function LeaderboardTab({ board, onInfo }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Card className="!bg-gold-soft !border-0 flex items-center justify-between !p-4 sm:!p-5">
        <div>
          <p className="text-[10px] font-mono text-body uppercase tracking-wider">Your rank</p>
          <p className="font-display font-extrabold text-xl sm:text-2xl text-forest mt-0.5">
            #{board.youRank} · <span className="font-mono text-sim-text">{board.youPoints} pts</span>
          </p>
        </div>
        <button
          onClick={onInfo}
          className="text-xs font-bold text-forest underline underline-offset-2 hover:text-forest-light"
        >
          How to earn points
        </button>
      </Card>

      <Card className="divide-y divide-hairline !p-3 sm:!p-4">
        {board.rankings.map((row) => (
          <div key={row.rank} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
            <span className="font-mono font-bold text-xs text-body/70 w-5 text-center shrink-0">
              {String(row.rank).padStart(2, '0')}
            </span>
            <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center shrink-0 text-forest border border-hairline font-display font-bold text-xs">
              {row.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-forest text-xs sm:text-sm">{row.name}</p>
              <p className="text-[10px] text-body truncate mt-0.5">
                {row.district}{row.badge ? ` · ${row.badge}` : ''}
              </p>
            </div>
            <span className="font-mono text-xs shrink-0 text-sim-text font-bold">
              +{row.points} pts
            </span>
            {row.rank === 1 && <Crown size={14} className="text-gold shrink-0" />}
          </div>
        ))}
      </Card>
    </div>
  )
}

export default function Learn({ initialTab = 'learn' }) {
  const [tab, setTab] = useState(initialTab)
  const [lessons, setLessons] = useState(null)
  const [board, setBoard] = useState(null)
  const [openLesson, setOpenLesson] = useState(null)
  const [showPointsInfo, setShowPointsInfo] = useState(false)

  useEffect(() => {
    fetchLessons().then(setLessons)
    fetchLeaderboard().then(setBoard)
  }, [])

  async function handleComplete(id) {
    await completeLesson(id)
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, completed: true } : l)))
    setOpenLesson((prev) => (prev ? { ...prev, completed: true } : prev))
  }

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: 'learn', label: 'Learn' },
          { value: 'leaderboard', label: 'Leaderboard' },
        ]}
      />

      {tab === 'learn' && (
        lessons
          ? <LearnTab lessons={lessons} onOpen={setOpenLesson} />
          : <LoadingSpinner label="Loading lessons…" />
      )}

      {tab === 'leaderboard' && (
        board
          ? <LeaderboardTab board={board} onInfo={() => setShowPointsInfo(true)} />
          : <LoadingSpinner label="Loading leaderboard…" />
      )}

      <LessonModal lesson={openLesson} onClose={() => setOpenLesson(null)} onComplete={handleComplete} />
      <PointsInfoModal open={showPointsInfo} onClose={() => setShowPointsInfo(false)} howToEarn={board?.howToEarn} />
    </div>
  )
}
