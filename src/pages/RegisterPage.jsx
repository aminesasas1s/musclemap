import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { addUser, setCurrentUser } from '../data'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill out all fields.')
      return
    }

    const newUser = addUser({ name, email, password })
    if (!newUser) {
      setError('This email is already registered or invalid.')
      return
    }

    localStorage.setItem('musclemap-role', 'user')
    setCurrentUser({ ...newUser, role: 'user' })
    navigate('/dashboard')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-xl rounded-[28px] p-8 md:p-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-slate-400">Join MuscleMap and start building better routines.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-4 text-lg outline-none transition focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-4 text-lg outline-none transition focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-4 text-lg outline-none transition focus:border-brand"
          />
        </label>
        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</div>}
        <button className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold">Register</button>
      </form>
      <div className="mt-4 text-center text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-white">Login</Link>
      </div>
    </motion.div>
  )
}
