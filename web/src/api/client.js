import axios from 'axios'

// Set VITE_API_URL once Alex's ecopulse-api is live — everything else keeps working unchanged.
export const USE_MOCK = !import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecopulse_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
