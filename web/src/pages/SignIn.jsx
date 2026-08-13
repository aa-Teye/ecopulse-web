import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../shared-components/Button/Button.jsx'
import { signIn } from '../api/endpoints/auth.js'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError("The server is waking up (free hosting sleeps when idle) — this can take up to a minute. Please try again.")
      } else {
        setError(err.response?.data?.detail || err.message || 'Could not sign in, check your details and try again.')
      }
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
              top: '60%', left: '70%',
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
            Sign in to join your community in building a flood-resilient neighbourhood
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card-lg border border-hairline">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signin-email" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-2">Email address</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nanaadjei@gmail.com"
                className="input-base !py-3.5 !px-4 text-base"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-base !py-3.5 !px-4 text-base pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-body text-xs font-semibold hover:text-forest transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 text-forest cursor-pointer select-none font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-hairline w-4 h-4 text-forest"
                />
                Remember me
              </label>
              <Link to="#" className="text-forest font-semibold underline underline-offset-2 hover:text-forest-light">Forgot Password?</Link>
            </div>

            {error && (
              <p className="text-xs text-white bg-coral rounded-xl px-4 py-3 font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full justify-center py-4 text-base font-bold mt-2" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In to Wɔnɔ '}
            </Button>
          </form>

          <p className="text-center text-sm text-body mt-8">
            Don't have an account?{' '}
            <Link to="/sign-up" className="font-bold text-forest underline underline-offset-2 hover:text-forest-light">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
