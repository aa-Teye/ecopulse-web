import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../shared-components/Button/Button.jsx'
import { useTourStore } from '../store/useTourStore.js'
import { TOUR_STEPS } from '../lib/tourSteps.js'
import { isAuthenticated } from '../api/endpoints/auth.js'

const PAD = 8

function useTargetRect(target) {
  const [rect, setRect] = useState(null)

  useEffect(() => {
    if (!target) {
      setRect(null)
      return undefined
    }

    const el = document.querySelector(`[data-tour="${target}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    let frameId
    function update() {
      const node = document.querySelector(`[data-tour="${target}"]`)
      if (node) {
        const r = node.getBoundingClientRect()
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
      } else {
        setRect(null)
      }
      frameId = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(frameId)
  }, [target])

  return rect
}

export default function Tour() {
  const { open, close } = useTourStore()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const step = TOUR_STEPS[index]
  const rect = useTargetRect(open ? step.target : null)

  if (!open) return null

  const isLast = index === TOUR_STEPS.length - 1

  function handleClose() {
    setIndex(0)
    close()
    if (!isAuthenticated()) {
      navigate('/sign-in')
    }
  }

  function handleNext() {
    if (isLast) {
      handleClose()
      return
    }
    setIndex((i) => i + 1)
  }

  function handleBack() {
    setIndex((i) => Math.max(i - 1, 0))
  }

  const box = rect
    ? {
        top: Math.max(rect.top - PAD, 0),
        left: Math.max(rect.left - PAD, 0),
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null

  return (
    <div className="fixed inset-0 z-[9998]" role="dialog" aria-modal="true" aria-label="App tour">
      {box ? (
        <>
          <div className="fixed bg-forest/60 backdrop-blur-[1px]" style={{ top: 0, left: 0, width: '100%', height: box.top }} />
          <div
            className="fixed bg-forest/60 backdrop-blur-[1px]"
            style={{ top: box.top + box.height, left: 0, width: '100%', height: `calc(100vh - ${box.top + box.height}px)` }}
          />
          <div className="fixed bg-forest/60 backdrop-blur-[1px]" style={{ top: box.top, left: 0, width: box.left, height: box.height }} />
          <div
            className="fixed bg-forest/60 backdrop-blur-[1px]"
            style={{ top: box.top, left: box.left + box.width, width: `calc(100vw - ${box.left + box.width}px)`, height: box.height }}
          />
          <div
            className="fixed rounded-2xl border-[3px] border-gold shadow-[0_0_0_4px_rgba(242,201,76,0.25)] pointer-events-none transition-all duration-300"
            style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-forest/70 backdrop-blur-[1px]" />
      )}

      <TourCard
        step={step}
        index={index}
        total={TOUR_STEPS.length}
        box={box}
        isLast={isLast}
        onBack={handleBack}
        onNext={handleNext}
        onClose={handleClose}
      />
    </div>
  )
}

function TourCard({ step, index, total, box, isLast, onBack, onNext, onClose }) {
  const CARD_WIDTH = 320
  const MARGIN = 14
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768

  let style
  if (box) {
    const spaceBelow = vh - (box.top + box.height)
    const placeBelow = spaceBelow > 200
    let left = box.left + box.width / 2 - CARD_WIDTH / 2
    left = Math.min(Math.max(left, MARGIN), vw - CARD_WIDTH - MARGIN)

    style = placeBelow
      ? { top: box.top + box.height + 12, left }
      : { bottom: vh - box.top + 12, left }
  } else {
    style = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  }

  return (
    <div
      className="fixed bg-white rounded-3xl shadow-card-lg p-5 sm:p-6 z-[9999] max-h-[80vh] overflow-y-auto"
      style={{ width: CARD_WIDTH, maxWidth: `calc(100vw - ${MARGIN * 2}px)`, ...style }}
    >
      <div className="eyebrow mb-1">
        Quick tour · {index + 1} of {total}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 text-forest">{step.title}</h3>
      <p className="text-xs sm:text-sm text-body mb-4 leading-relaxed">{step.body}</p>

      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-forest' : 'w-1.5 bg-mint-dark'}`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {index > 0 && (
          <Button variant="ghost" className="!px-4 !py-2 text-xs" onClick={onBack}>
            Back
          </Button>
        )}
        <Button className="!px-5 !py-2 text-xs font-bold ml-auto" onClick={onNext}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>

      {!isLast && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-body/60 hover:text-body font-medium mt-3 block mx-auto"
        >
          Skip tour
        </button>
      )}
    </div>
  )
}
