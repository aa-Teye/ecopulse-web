import { create } from 'zustand'
import { fetchDrains, submitDrainReport } from '../api/endpoints/drains.js'

export const useReportStore = create((set, get) => ({
  reports: [],
  loading: false,
  error: null,

  loadReports: async () => {
    set({ loading: true, error: null })
    try {
      const reports = await fetchDrains()
      set({ reports, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addReport: async (report) => {
    const created = await submitDrainReport(report)
    set({ reports: [created, ...get().reports] })
    return created
  },
}))
