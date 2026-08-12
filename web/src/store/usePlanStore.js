import { create } from 'zustand'
import { fetchPlan, savePlan } from '../api/endpoints/plan.js'

export const usePlanStore = create((set) => ({
  plan: undefined, // undefined = not loaded yet, null = loaded but no plan saved
  loading: false,
  error: null,

  loadPlan: async () => {
    set({ loading: true, error: null })
    try {
      const plan = await fetchPlan()
      set({ plan, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  saveHouseholdPlan: async (draft) => {
    const saved = await savePlan(draft)
    set({ plan: saved })
    return saved
  },
}))
