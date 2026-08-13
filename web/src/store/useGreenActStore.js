import { create } from 'zustand'
import { fetchGreenActs, submitGreenAct } from '../api/endpoints/greenActs.js'

export const useGreenActStore = create((set, get) => ({
  acts: [],
  loading: false,
  error: null,

  loadActs: async () => {
    set({ loading: true, error: null })
    try {
      const acts = await fetchGreenActs()
      set({ acts, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addAct: async (input) => {
    const created = await submitGreenAct(input)
    set({ acts: [created, ...get().acts] })
    return created
  },
}))
