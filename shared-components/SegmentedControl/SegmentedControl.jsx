export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`inline-flex max-w-full overflow-x-auto no-scrollbar bg-mint-dark rounded-full p-1 ${className}`} role="tablist">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
              active
                ? 'bg-white text-forest shadow-card'
                : 'text-body hover:text-forest'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
