import { create } from 'zustand'

export const useTourStore = create((set) => ({
  open: false,
  start: () => set({ open: true }),
  close: () => set({ open: false }),
}))
