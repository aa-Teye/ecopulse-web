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
  const form = new FormData()
  form.append('location', report.location)
  form.append('description', report.description)
  form.append('report_type', report.reportType || 'drain')
  if (report.subjectDescription) {
    form.append('subject_description', report.subjectDescription)
  }
  if (report.coords) {
    form.append('lat', report.coords.lat)
    form.append('lng', report.coords.lng)
  }
  if (report.photo) {
    form.append('photo', report.photo)
  }
  if (report.video) {
    form.append('video', report.video)
  }
  const { data } = await apiClient.post('/drains/report', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    // A 100MB video can take minutes over a slow connection — the default
    // 60s timeout is sized for cold starts, not large uploads.
    timeout: report.video ? 300000 : undefined,
  })
  return data
}
