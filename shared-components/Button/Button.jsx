const variants = {
  primary:   'bg-forest text-white hover:bg-forest-light hover:shadow-card-lg font-bold active:scale-[0.98]',
  secondary: 'bg-mint text-forest hover:bg-mint-dark active:scale-[0.98]',
  danger:    'bg-coral text-white hover:brightness-110 active:scale-[0.98]',
  ghost:     'bg-transparent text-forest border border-hairline hover:bg-mint',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
