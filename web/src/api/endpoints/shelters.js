import { apiClient, USE_MOCK } from '../client.js'
import mockShelters from '../mockData/shelters.json'

// Matches ecopulse-api "shelters" resource. Not yet in EcoPulse API Endpoints
// Specification v1.0 — flagged to Alex/Mandy so it gets added to the spec.
// Falls back to mock data until a real endpoint exists.
export async function fetchShelters() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockShelters
  }
  const { data } = await apiClient.get('/shelters')
  return data
}
