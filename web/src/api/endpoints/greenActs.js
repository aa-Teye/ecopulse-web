import { apiClient, USE_MOCK } from '../client.js'

export const ACTION_TYPES = [
  { value: 'tree_planting', label: 'Planted a tree', points: 25 },
  { value: 'cleanup', label: 'Cleaned up litter or waste', points: 15 },
  { value: 'recycling', label: 'Recycled waste properly', points: 10 },
  { value: 'water_conservation', label: 'Conserved water', points: 10 },
  { value: 'other', label: 'Other green action', points: 10 },
]

const MOCK_ACTS = [
  { id: 1, actionType: 'tree_planting', actionLabel: 'Planted a tree', description: 'Planted 4 mango saplings along Odaw riverbank', pointsAwarded: 25, photoUrl: null, userName: 'Adwoa B.', createdAt: '2026-08-11T09:20:00Z' },
  { id: 2, actionType: 'cleanup', actionLabel: 'Cleaned up litter or waste', description: 'Cleared plastic waste from Kaneshie market drain approach', pointsAwarded: 15, photoUrl: null, userName: 'Kwame T.', createdAt: '2026-08-10T16:05:00Z' },
]

export async function fetchGreenActs() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return MOCK_ACTS
  }
  const { data } = await apiClient.get('/green-acts')
  return data
}

export async function submitGreenAct({ actionType, description, photo, photoAfter, video }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    const meta = ACTION_TYPES.find((a) => a.value === actionType)
    return {
      id: Math.floor(Math.random() * 9000 + 1000),
      actionType,
      actionLabel: meta?.label ?? actionType,
      description,
      pointsAwarded: meta?.points ?? 10,
      photoUrl: null,
      photoAfterUrl: null,
      videoUrl: null,
      userName: 'You',
      createdAt: new Date().toISOString(),
    }
  }
  const form = new FormData()
  form.append('action_type', actionType)
  form.append('description', description || '')
  if (photo) form.append('photo', photo)
  if (photoAfter) form.append('photo_after', photoAfter)
  if (video) form.append('video', video)
  const { data } = await apiClient.post('/green-acts', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // A 100MB video can take minutes over a slow connection — the default
    // 60s timeout is sized for cold starts, not large uploads.
    timeout: video ? 300000 : undefined,
  })
  return data
}
