import { Construction } from "lucide-react";

export default function Placeholder({ title }) {
  return (
    <div className="section-pad max-w-lg mx-auto py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-mint flex items-center justify-center mx-auto mb-5 text-forest/30">
        <Construction size={24} />
      </div>
      <p className="eyebrow justify-center mb-3">Coming soon</p>
      <h1 className="text-2xl mb-3">{title}</h1>
      <p className="text-body">This page hasn't been built yet, check back soon.</p>
    </div>
  )
}
