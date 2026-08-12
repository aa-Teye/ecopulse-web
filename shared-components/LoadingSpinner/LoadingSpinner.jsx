export default function LoadingSpinner({ label = 'Loading…', size = 22 }) {
  return (
    <div className="flex items-center gap-3 text-body text-sm" role="status">
      <span
        className="inline-block rounded-full border-2 border-forest/20 border-t-forest animate-spin"
        style={{ width: size, height: size }}
      />
      <span className="font-medium">{label}</span>
    </div>
  )
}
