import { apiClient, USE_MOCK } from '../client.js'

export async function completeGame(game, score) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    const rules = { quiz: { per: 5, max: 30 }, tap_drains: { per: 1, max: 30 } }[game] ?? { per: 1, max: 30 }
    const pointsAwarded = Math.min(score * rules.per, rules.max)
    return { game, pointsAwarded, totalEcoTokens: pointsAwarded }
  }
  const { data } = await apiClient.post(`/games/${game}/complete`, { score })
  return data
}
