# EcoPulse — Frontend

> **Community flood resilience platform for districts across Ghana.**  
> Built for the Wɔnɔ programme — helping residents in any district monitor drains, stay informed during heavy rains, and coordinate with emergency responders.

---

## Overview

EcoPulse is a full-featured React web app (PWA-ready) that gives residents across Ghana real-time flood risk awareness, community drain reporting, emergency planning tools, and climate education — all in one place. The platform is designed to work for **any district**, with district-specific data (flood zones, shelters, contacts, drain reports) served per user from the backend.

The frontend runs entirely on **mock data by default**. Connecting to a live backend requires setting a single environment variable.

---

## Pages & Routes

| Page | Route | Description |
|---|---|---|
| Home | `/` | Flood risk gauge, sensor map, streak, community photos, news feed |
| Report Drain | `/report-drain` | GPS-assisted drain blockage report with photo upload |
| My Reports | `/my-reports` | View your submitted drain reports and their status |
| Alerts | `/alerts` | Live emergency banner, emergency & routine notifications |
| Emergency Plan | `/emergency-plan` | Household plan builder (accessibility needs, contact, shelter) |
| Emergency Contacts | `/emergency-contacts` | District and national emergency numbers |
| Learn | `/learn` | Climate literacy lessons with progress tracking and eco-tokens |
| Leaderboard | `/leaderboard` | Community eco-token rankings |
| News Hub | `/news` | Categorised flood/climate news with search and video embeds |
| Shelter Locator | `/shelters` | Nearest accessible shelters with distance sort and directions |
| Safe Routes | `/safe-routes` | Zone-specific evacuation routes with turn-by-turn steps |
| Community Status | `/community-status` | Set and view neighbourhood safety status (safe / evacuating / need help) |
| Profile | `/profile` | Eco-tokens, badges, language preference, account settings |
| Sign In | `/sign-in` | Email / phone login |
| Sign Up | `/sign-up` | Registration with district and accessibility info |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS + custom design tokens |
| Routing | React Router v6 |
| State | Zustand |
| HTTP | Axios |
| Icons | Lucide React |
| Fonts | Poppins (display) · DM Sans (body) |

---

## Project Structure

```
ecopulse-frontend/
├── shared-components/          # Shared UI components (Button, Card, Modal, etc.)
│   ├── Button/
│   ├── Card/
│   ├── Modal/
│   ├── SegmentedControl/
│   ├── RadarField/
│   ├── LoadingSpinner/
│   └── ...
│
└── web/                        # Main web application
    ├── public/
    │   ├── assets/             # Images and static assets
    │   ├── manifest.json       # PWA manifest
    │   └── sw.js               # Service worker (offline shell caching)
    ├── src/
    │   ├── App.jsx             # Routes, nav, footer
    │   ├── index.css           # Global styles and design tokens
    │   ├── pages/              # All page components
    │   ├── api/
    │   │   ├── client.js       # Axios instance — mock↔real toggle
    │   │   ├── mockData/       # JSON mock data for all endpoints
    │   │   └── endpoints/      # One file per feature area
    │   ├── store/              # Zustand stores
    │   └── hooks/              # Custom React hooks
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & run (dev)

```bash
cd web
npm install
npm run dev
```

The app opens at `http://localhost:5173` and runs on **mock data** — no backend needed.

### Production build

```bash
cd web
npm run build
```

Output goes to `web/dist/`.

---

## Environment Variables

Create a `.env` file inside the `web/` directory:

```env
# Required to switch from mock data to the real backend
VITE_API_URL=https://your-api-domain.com/api

# Optional — link to the admin dashboard
VITE_DASHBOARD_URL=https://your-dashboard-domain.com
```

> **No `.env` needed** to run locally — the app works fully on mock data until `VITE_API_URL` is set.

---

## Backend Integration

The mock/real switch lives in [`web/src/api/client.js`](web/src/api/client.js):

```js
export const USE_MOCK = !import.meta.env.VITE_API_URL
```

Every endpoint file follows the same pattern — mock branch for development, real Axios call for production:

```js
export async function fetchAlerts() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250))
    return mockAlerts
  }
  const { data } = await apiClient.get('/alerts')
  return data
}
```

**Authentication:** The client automatically attaches the JWT on every request:
```
Authorization: Bearer <token>
```
Tokens are stored in `localStorage` under `ecopulse_token`.

For full endpoint contracts and expected response shapes, see the [Backend Integration Guide](backend_integration_guide.md) (in the repo).

---

## Design System

| Token | Value |
|---|---|
| Primary (forest) | `#0f3d2e` |
| Accent (gold) | `#f2c94c` |
| Alert (coral) | `#e05c45` |
| Background (mint) | `#e8f5ee` |
| Body text | `#4b5b54` |
| Display font | Poppins (extrabold) |
| Body font | DM Sans |
| Mono font | System monospace |

All tokens are defined in [`web/tailwind.config.js`](web/tailwind.config.js) and [`web/src/index.css`](web/src/index.css).

---

## Known Limitations / Pending Work

- **Map component** — Shelter Locator and Safe Routes currently show list views with Google Maps links. An embedded map (Mapbox wrapper in `shared-components/Map/`) can be dropped in once built.
- **Live updates** — Pages fetch on mount. No WebSocket / Socket.io client is wired yet for real-time alert/report push.
- **i18n** — Language preference is stored (English, Twi, Ga, Ewe), but UI translation is not yet implemented.
- **Offline caching** — The service worker caches the app shell; dynamic data (news, shelters, routes, community status) is not yet cached for offline use.

---

## Contributing

1. Branch from `main`
2. Use conventional commits (`feat:`, `fix:`, `chore:`)
3. Open a PR — tag the frontend lead for review

---

*EcoPulse · Ghana Community Flood Resilience Platform*
