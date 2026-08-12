import { apiClient, USE_MOCK } from '../client.js'
import mockDrains from '../mockData/drains.json'

export async function fetchDrains() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return mockDrains
  }
  const { data } = await apiClient.get('/drains')
  return data
}

export async function submitDrainReport(report) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    return { id: `d-${Math.floor(Math.random() * 9000 + 1000)}`, status: 'pending', ...report }
  }
  const { data } = await apiClient.post('/drains/report', report)
  return data
}
