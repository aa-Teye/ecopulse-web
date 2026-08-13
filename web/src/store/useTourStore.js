import { create } from 'zustand'

const SEEN_KEY = 'ecopulse_tour_seen'

export const useTourStore = create((set) => ({
  open: false,
  start: () => set({ open: true }),
  close: () => {
    localStorage.setItem(SEEN_KEY, 'true')
    set({ open: false })
  },
  maybeAutoStart: () => {
    if (!localStorage.getItem(SEEN_KEY)) {
      set({ open: true })
    }
  },
}))
