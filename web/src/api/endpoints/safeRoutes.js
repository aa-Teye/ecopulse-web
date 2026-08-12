import { apiClient, USE_MOCK } from '../client.js'
import mockRoutes from '../mockData/routes.json'

// Not yet in EcoPulse API Endpoints Specification v1.0 — flagged to Alex/Mandy.
// Falls back to mock data until a real endpoint exists.
export async function fetchSafeRoutes() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockRoutes
  }
  const { data } = await apiClient.get('/safe-routes')
  return data
}
