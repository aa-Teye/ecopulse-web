const toneStyles = {
  warning: 'bg-gold-soft border-l-4 border-gold text-forest',
  danger:  'bg-coral/10 border-l-4 border-coral text-coral',
  info:    'bg-mint border-l-4 border-forest/30 text-forest',
}

export default function AlertBanner({ tone = 'info', title, message, action }) {
  return (
    <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 ${toneStyles[tone]}`} role="alert">
      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-current shrink-0 animate-pulse-dot" />
      <div className="flex-1">
        <p className="font-display font-semibold text-sm">{title}</p>
        {message && <p className="text-sm opacity-80 mt-1 leading-relaxed">{message}</p>}
      </div>
      {action}
    </div>
  )
}
