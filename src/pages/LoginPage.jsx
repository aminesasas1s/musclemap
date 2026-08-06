import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { setCurrentUser } from '../data'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const normalizedEmail = email.trim().toLowerCase()

    try {
      const res = await fetch('http://localhost:5175/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password })
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      localStorage.setItem('musclemap-token', data.token)
      localStorage.setItem('musclemap-role', data.user.role)
      setCurrentUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Failed to connect to the server. Is it running?')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass w-full max-w-xl rounded-[28px] p-8 md:p-10"
    >
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-2xl text-brand neon-ring">M</div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-400">Log in to continue your fitness journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-4 text-lg outline-none transition focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-4 text-lg outline-none transition focus:border-brand"
          />
        </label>
        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-100 flex flex-col gap-1">
          <div>Login with the credentials you just registered, or use the admin account!</div>
        </div>
        <button type="submit" className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold transition hover:brightness-110">Login</button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
        <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
        <Link to="/register" className="hover:text-white">Create account</Link>
      </div>
    </motion.div>
  )
}
