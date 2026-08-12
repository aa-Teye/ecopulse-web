export default function Card({ className = '', children, as: Tag = 'div', hover = false, ...props }) {
  return (
    <Tag
      className={`bg-white rounded-3xl border border-hairline shadow-card p-6 text-forest
        ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
