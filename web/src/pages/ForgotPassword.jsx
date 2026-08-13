import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../shared-components/Button/Button.jsx'
import { forgotPassword, resetPassword } from '../api/endpoints/auth.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('identify') // identify | reset | done
  const [identifier, setIdentifier] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleIdentify(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { found } = await forgotPassword(identifier.trim())
      if (!found) {
        setError("We couldn't find an account with that email, phone, or username.")
        return
      }
      setStep('reset')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong, please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Use at least 6 characters.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await resetPassword(identifier.trim(), newPassword)
      setStep('done')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong, please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden w-full"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #eaf5ee 0%, #34C77B 70%, #0f3d2e 130%)' }}
    >
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white drop-shadow-sm">
            Reset your password
          </h1>
          <p className="text-white/90 mt-3 text-base sm:text-lg leading-relaxed">
            {step === 'done'
              ? 'All set — sign in with your new password.'
              : 'No email is sent — this MVP resets it directly once we find your account.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card-lg border border-hairline">
          {step === 'identify' && (
            <form onSubmit={handleIdentify} className="space-y-5">
              <div>
                <label htmlFor="fp-identifier" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-2">
                  Email, phone, or username
                </label>
                <input
                  id="fp-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nanaadjei@gmail.com"
                  className="input-base !py-3.5 !px-4 text-base"
                />
              </div>
              {error && <p className="text-xs text-white bg-coral rounded-xl px-4 py-3 font-medium">{error}</p>}
              <Button type="submit" className="w-full justify-center py-4 text-base font-bold" disabled={submitting}>
                {submitting ? 'Checking…' : 'Continue'}
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-5">
              <p className="text-sm text-body">Account found. Set a new password for <span className="font-bold text-forest">{identifier}</span>.</p>
              <div>
                <label htmlFor="fp-password" className="text-xs font-semibold text-forest uppercase tracking-wider block mb-2">New password</label>
                <div className="relative">
                  <input
                    id="fp-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a new password"
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
              {error && <p className="text-xs text-white bg-coral rounded-xl px-4 py-3 font-medium">{error}</p>}
              <Button type="submit" className="w-full justify-center py-4 text-base font-bold" disabled={submitting}>
                {submitting ? 'Saving…' : 'Set new password'}
              </Button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4">
              <Button className="w-full justify-center py-4 text-base font-bold" onClick={() => navigate('/sign-in')}>
                Go to sign in
              </Button>
            </div>
          )}

          {step !== 'done' && (
            <p className="text-center text-sm text-body mt-8">
              <Link to="/sign-in" className="font-bold text-forest underline underline-offset-2 hover:text-forest-light">Back to sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
