import { apiClient, USE_MOCK } from '../client.js'
import mockStatus from '../mockData/status.json'

// Not yet in EcoPulse API Endpoints Specification v1.0 — flagged to Alex/Mandy.
// Falls back to mock data until a real endpoint exists.
export async function fetchStatusBoard() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockStatus
  }
  const { data } = await apiClient.get('/community-status')
  return data
}

export async function postStatus({ status, note }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    const entry = {
      id: `st-${Date.now()}`,
      name: 'You',
      district: null,
      status,
      note: note || null,
      timestamp: new Date().toISOString(),
    }
    return entry
  }
  const { data } = await apiClient.post('/community-status', { status, note })
  return data
}
