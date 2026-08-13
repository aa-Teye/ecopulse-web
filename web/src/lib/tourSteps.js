// `target` is a `data-tour` attribute value on the real element to spotlight
// on the Home page. `null` means a centered, untargeted intro/outro step.
export const TOUR_STEPS = [
  {
    target: null,
    title: 'Welcome to Wɔnɔ',
    body: 'Wɔnɔ means "our own" in Ga. This is your community\'s flood detection and prevention hub. Let\'s walk through what\'s on this page.',
  },
  {
    target: 'flood-risk',
    title: "Today's flood risk",
    body: 'A live score for your area, based on drainage conditions and the GMet forecast. Higher means act sooner.',
  },
  {
    target: 'quick-actions',
    title: 'Quick actions',
    body: 'Report a blocked drain, log a green act for instant Eco-Tokens, play a climate game, check alerts, or build your emergency plan — all one tap away.',
  },
  {
    target: 'community-activity',
    title: 'Community activity',
    body: "See what your neighbours are doing — green acts logged nearby, and the Eco-Tokens they've earned for it.",
  },
  {
    target: 'weather',
    title: 'Weather now',
    body: "Today's conditions from GMet Ghana, so you know what you're preparing for.",
  },
  {
    target: 'news',
    title: 'Climate + flood news',
    body: 'Local flood and climate updates, kept current so you know what\'s happening beyond your own street.',
  },
  {
    target: null,
    title: "That's the tour",
    body: 'Sign in to start earning Eco-Tokens, submit reports, and save your emergency plan. You can always replay this tour from the menu.',
  },
]
