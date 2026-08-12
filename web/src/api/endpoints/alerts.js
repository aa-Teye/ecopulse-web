import { apiClient, USE_MOCK } from '../client.js'
import mockAlerts from '../mockData/alerts.json'

export async function fetchAlerts() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockAlerts
  }
  const { data } = await apiClient.get('/alerts')
  return data
}

export async function acknowledgeAlert(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return { id, acknowledged: true }
  }
  const { data } = await apiClient.post(`/alerts/${id}/acknowledge`)
  return data
}

export async function markSafe() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return { status: 'safe', at: new Date().toISOString() }
  }
  const { data } = await apiClient.post('/alerts/status', { status: 'safe' })
  return data
}
