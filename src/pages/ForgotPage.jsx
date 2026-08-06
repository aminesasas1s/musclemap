import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ForgotPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass w-full max-w-md rounded-[28px] p-6 md:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="mt-2 text-slate-400">Enter your email and we’ll send recovery instructions.</p>
      </div>
      <form className="space-y-4">
        <input placeholder="Email" className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3" />
        <button className="w-full rounded-2xl bg-brand px-4 py-3 font-semibold">Send reset link</button>
      </form>
      <div className="mt-4 text-center text-sm text-slate-400">
        <Link to="/login" className="text-white">Back to login</Link>
      </div>
    </motion.div>
  )
}
