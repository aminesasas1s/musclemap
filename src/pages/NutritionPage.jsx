import { motion } from 'framer-motion'
import { Apple, Beef, Croissant, Droplet } from 'lucide-react'

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-semibold">Nutrition</h1>
        <p className="mt-2 text-slate-400">Track your daily macronutrients, calories, and hydration.</p>
      </div>

      {/* Main Macro Summary */}
      <div className="glass rounded-[24px] border border-slate-800 p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Calorie Circle */}
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1e293b" strokeWidth="10" />
              <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="90" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            </svg>
            <div className="text-center">
              <span className="block text-3xl font-bold text-white">0</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Kcal Eaten</span>
            </div>
          </div>

          {/* Macro Bars */}
          <div className="flex-1 w-full space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 font-medium text-white"><Beef size={16} className="text-rose-400" /> Protein</span>
                <span className="text-slate-400">0g / 160g</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 font-medium text-white"><Croissant size={16} className="text-amber-400" /> Carbs</span>
                <span className="text-slate-400">0g / 250g</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 font-medium text-white"><Apple size={16} className="text-emerald-400" /> Fats</span>
                <span className="text-slate-400">0g / 65g</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        {/* Meals Log */}
        <div className="glass rounded-[24px] border border-slate-800 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Meals</h2>
            <button className="rounded-full bg-brand/20 px-3 py-1 text-sm font-medium text-brand hover:bg-brand/30 transition">+ Add Meal</button>
          </div>
          <div className="space-y-4">
            {[]?.map((meal, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{meal.time}</p>
                  <p className="mt-1 font-medium text-white">{meal.name}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{meal.cals}</span>
                  <span className="ml-1 text-xs text-slate-400">kcal</span>
                </div>
              </motion.div>
            ))}
            <div className="text-center py-8 text-slate-500">
              <p>No meals logged today yet.</p>
            </div>
          </div>
        </div>

        {/* Hydration */}
        <div className="glass rounded-[24px] border border-slate-800 p-6">
          <h2 className="mb-6 text-lg font-semibold">Hydration</h2>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Droplet size={48} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">0.0 <span className="text-lg text-slate-400">/ 3.0 L</span></p>
            <p className="mt-2 text-sm text-slate-400">Time to drink some water.</p>
            
            <div className="mt-8 flex gap-3">
              <button className="flex items-center justify-center rounded-xl bg-slate-800 px-4 py-2 hover:bg-slate-700 transition">+ 250ml</button>
              <button className="flex items-center justify-center rounded-xl bg-brand px-4 py-2 font-medium text-white hover:bg-blue-600 transition">+ 500ml</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
