import { apiClient, USE_MOCK } from '../client.js'
import mockLessons from '../mockData/lessons.json'
import mockLeaderboard from '../mockData/leaderboard.json'

export async function fetchLessons() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockLessons
  }
  const { data } = await apiClient.get('/lessons')
  return data
}

export async function completeLesson(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    return { id, completed: true }
  }
  const { data } = await apiClient.post(`/lessons/${id}/complete`)
  return data
}

export async function fetchLeaderboard() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockLeaderboard
  }
  const { data } = await apiClient.get('/leaderboard')
  return data
}
