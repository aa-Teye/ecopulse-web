import { apiClient, USE_MOCK } from '../client.js'

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair access',
  'Visual impairment',
  'Elderly household member',
  'Young children',
]

export { ACCESSIBILITY_OPTIONS }

export async function fetchPlan() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    const saved = localStorage.getItem('ecopulse_plan')
    return saved ? JSON.parse(saved) : null
  }
  const { data } = await apiClient.get('/plan')
  return data
}

export async function savePlan(plan) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    const record = {
      ...plan,
      shelter: { name: 'Odawna Community Hall', note: 'Step-free entrance, 6 min from your saved address.' },
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem('ecopulse_plan', JSON.stringify(record))
    return record
  }
  const { data } = await apiClient.post('/plan', plan)
  return data
}
