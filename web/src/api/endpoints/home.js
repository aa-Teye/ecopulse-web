import { apiClient, USE_MOCK } from '../client.js'
import mockNews from '../mockData/news.json'

export async function fetchNews() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockNews
  }
  const { data } = await apiClient.get('/news')
  return data
}

export async function fetchWeather() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return { tempC: 27, condition: 'Scattered showers', humidity: 84 }
  }
  const { data } = await apiClient.get('/weather')
  return data
}

export async function fetchFloodRisk() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return { score: 62, level: 'elevated', zone: 'Accra Central' }
  }
  const { data } = await apiClient.get('/flood-risk')
  return data
}
