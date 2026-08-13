import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../../shared-components/Modal/Modal.jsx'
import Button from '../../../shared-components/Button/Button.jsx'
import { useTourStore } from '../store/useTourStore.js'
import { TOUR_STEPS } from '../lib/tourSteps.js'

export default function Tour() {
  const { open, close } = useTourStore()
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  if (!open) return null

  const step = TOUR_STEPS[index]
  const isLast = index === TOUR_STEPS.length - 1

  function handleClose() {
    setIndex(0)
    close()
  }

  function handleNext() {
    if (isLast) {
      handleClose()
      return
    }
    setIndex((i) => i + 1)
  }

  function handleGoThere() {
    if (step.to) navigate(step.to)
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} labelledBy="tour-title">
      <div className="eyebrow mb-1">
        Quick tour · {index + 1} of {TOUR_STEPS.length}
      </div>
      <h3 id="tour-title" className="text-xl sm:text-2xl font-bold mb-2 text-forest">
        {step.title}
      </h3>
      <p className="text-xs sm:text-sm text-body mb-5 leading-relaxed">{step.body}</p>

      <div className="flex items-center gap-1.5 mb-5">
        {TOUR_STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-forest' : 'w-1.5 bg-mint-dark'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {index > 0 && (
          <Button variant="ghost" className="!px-4 !py-2 text-xs" onClick={() => setIndex((i) => i - 1)}>
            Back
          </Button>
        )}
        {step.to && (
          <Button variant="secondary" className="!px-4 !py-2 text-xs" onClick={handleGoThere}>
            {step.cta}
          </Button>
        )}
        <Button className="!px-5 !py-2 text-xs font-bold ml-auto" onClick={handleNext}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>

      {!isLast && (
        <button
          type="button"
          onClick={handleClose}
          className="text-xs text-body/60 hover:text-body font-medium mt-4 block mx-auto"
        >
          Skip tour
        </button>
      )}
    </Modal>
  )
}
