/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', '../shared-components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── EcoPulse / Wɔnɔ Pure White & Forest Design System ──
        forest:         '#0f3d2e',      // primary surface — hero cards, headings, buttons
        'forest-light': '#14503d',    // elevated surface / hover states
        emerald:        '#34C77B',      // neon green accent / safe status
        mint:           '#f4f9f6',      // soft tint background
        'mint-dark':    '#e4ebe6',      // hover track background
        gold:           '#f2c94c',      // primary accent — badges, crowns, eyebrows
        'gold-soft':    '#fbefcb',      // glowing badge background
        coral:          '#E4572E',      // emergency / danger
        moss:           '#4C7A5D',      // safe / success
        body:           '#4b5b54',      // secondary text
        hairline:       '#e4ebe6',      // clean borders/dividers
        'live-bg':      '#ddf0de',      // live badge bg
        'live-text':    '#1f7a44',      // live badge text
        'sim-bg':       '#fbefcb',      // simulated badge bg
        'sim-text':     '#9a7412',      // simulated badge text
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '24px',
        '3xl': '28px',
      },
      boxShadow: {
        card:        '0 1px 3px rgba(15,61,46,0.06), 0 8px 24px -12px rgba(15,61,46,0.12)',
        'card-lg':    '0 20px 60px -20px rgba(15,61,46,0.22)',
        'card-hover': '0 24px 64px -14px rgba(15,61,46,0.25)',
        'gold-glow':  '0 0 20px rgba(242, 201, 76, 0.35)',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s cubic-bezier(0.22,0.61,0.36,1) both',
        'ring-expand': 'ringExpand 2.2s ease-out infinite',
        'pulse-dot':   'pulseDot 1.2s ease-in-out infinite',
        'gold-pulse':  'goldPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ringExpand: {
          '0%':   { transform: 'scale(0.92)', opacity: '0.7' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(0.65)' },
        },
        goldPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(242,201,76,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(242,201,76,0)' },
        },
      },
    },
  },
  plugins: [],
}
