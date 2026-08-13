import axios from 'axios'

// Set VITE_API_URL once Alex's ecopulse-api is live — everything else keeps working unchanged.
export const USE_MOCK = !import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  // Render's free tier spins down after ~15 min idle and can take 30-60s to
  // wake back up on the next request. 10s wasn't enough — that's what made
  // sign-in look broken when it was really just waiting on a cold start.
  timeout: 60000,
})

// Fire-and-forget on load so the backend is (hopefully) already warm by the
// time someone finishes filling in a form, instead of only waking up when
// they hit submit.
if (!USE_MOCK) {
  apiClient.get('/health').catch(() => {})
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecopulse_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
