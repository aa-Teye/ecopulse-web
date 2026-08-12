import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../shared-components/Button/Button.jsx'
import { signUp } from '../api/endpoints/auth.js'

export default function SignUp() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [district, setDistrict] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!agreed) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await signUp({ fullName, password, district, phone })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not create your account, please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden w-full"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #eaf5ee 0%, #34C77B 70%, #0f3d2e 130%)' }}
    >
      {/* Concentric ripple rings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[200, 360, 520, 700].map((size, i) => (
          <span
            key={i}
            className="concentric-ring"
            style={{
              width: size, height: size,
              top: '55%', left: '65%',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white drop-shadow-sm">
            Welcome to Wɔnɔ
          </h1>
          <p className="text-white/90 mt-3 text-base sm:text-lg leading-relaxed">
            Create your account to start reporting drains and earning rewards
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card-lg border border-hairline">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1.5">Full name</label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ama Annim"
                className="input-base !py-3 !px-4"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1.5">New password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="input-base !py-3 !px-4"
              />
            </div>

            <div>
              <label htmlFor="signup-district" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1.5">District</label>
              <input
                id="signup-district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Ga East, Adenta, Kpone-Katamanso"
                className="input-base !py-3 !px-4"
              />
            </div>

            <div>
              <label htmlFor="signup-phone" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-1.5">Phone Number</label>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 54632456"
                className="input-base !py-3 !px-4"
              />
            </div>

            <label className="flex items-center gap-2 text-xs sm:text-sm text-forest cursor-pointer select-none font-medium pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-hairline w-4 h-4 text-forest"
              />
              I agree with the terms and conditions
            </label>

            {error && (
              <p className="text-xs text-white bg-coral rounded-xl px-4 py-3 font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full justify-center py-4 text-base font-bold mt-2" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Sign Up for Wɔnɔ'}
            </Button>
          </form>



          <p className="text-center text-sm text-body mt-8">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-bold text-forest underline underline-offset-2 hover:text-forest-light">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
