import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, Star, Zap, Flame, Trophy, Shield, 
  Dumbbell, Calendar, Target, Heart, Users,
  Moon, Sun, Crown, X, Check, Search, Lock, HelpCircle
} from 'lucide-react'

// --- Mock Data ---

const initialXpHistory = {
  today: 0,
  thisWeek: 0,
  total: 0,
  toNextLevel: 500,
  level: 1
}

const categories = ['All', 'Strength', 'Streak', 'Milestones', 'Workout', 'Nutrition', 'Special']
const rarities = ['Common', 'Rare', 'Epic', 'Legendary']

const achievementsData = [
  // Milestones (Beginner)
  { id: 1, title: 'First Workout', description: 'Complete your first workout session.', category: 'Milestones', rarity: 'Common', icon: Star, unlocked: false, xp: 50, related: [2, 10] },
  { id: 2, title: 'First Week', description: 'Complete your first week of training.', category: 'Milestones', rarity: 'Common', icon: Calendar, unlocked: false, xp: 100, related: [3] },
  { id: 3, title: 'First Month', description: 'Complete your first month of training.', category: 'Milestones', rarity: 'Rare', icon: Calendar, target: 1, current: 0, unit: 'Months', unlocked: false, xp: 250, related: [2] },
  { id: 4, title: 'Plan Finisher', description: 'Complete your first workout plan.', category: 'Milestones', rarity: 'Rare', icon: Check, target: 1, current: 0, unit: 'Plans', unlocked: false, xp: 300, related: [] },
  
  // Streaks
  { id: 5, title: '3-Day Streak', description: 'Work out for 3 consecutive days.', category: 'Streak', rarity: 'Common', icon: Flame, unlocked: false, xp: 50, related: [6] },
  { id: 6, title: '7-Day Streak', description: 'Work out for 7 consecutive days.', category: 'Streak', rarity: 'Rare', icon: Flame, unlocked: false, xp: 150, related: [5, 7] },
  { id: 7, title: '30-Day Streak', description: 'Work out for 30 consecutive days.', category: 'Streak', rarity: 'Epic', icon: Flame, target: 30, current: 0, unit: 'Days', unlocked: false, xp: 500, related: [6] },
  { id: 8, title: '100-Day Streak', description: 'Work out for 100 consecutive days.', category: 'Streak', rarity: 'Legendary', icon: Flame, target: 100, current: 0, unit: 'Days', unlocked: false, xp: 2000, related: [7] },
  
  // Strength
  { id: 9, title: 'Heavy Lifter', description: 'Lift a total of 10,000kg in one session.', category: 'Strength', rarity: 'Epic', icon: Trophy, unlocked: false, xp: 500, related: [10, 11] },
  { id: 10, title: '5,000 kg Club', description: 'Lift 5,000kg cumulative across all workouts.', category: 'Strength', rarity: 'Common', icon: Dumbbell, unlocked: false, xp: 100, related: [9] },
  { id: 11, title: '50,000 kg Club', description: 'Lift 50,000kg cumulative across all workouts.', category: 'Strength', rarity: 'Epic', icon: Dumbbell, target: 50000, current: 0, unit: 'kg', unlocked: false, xp: 1000, related: [10, 12] },
  { id: 12, title: '100,000 kg Club', description: 'Lift 100,000kg cumulative across all workouts.', category: 'Strength', rarity: 'Legendary', icon: Crown, target: 100000, current: 0, unit: 'kg', unlocked: false, xp: 3000, related: [11] },

  // Workouts
  { id: 13, title: 'Consistency', description: 'Complete 20 workouts.', category: 'Workout', rarity: 'Rare', icon: Shield, target: 20, current: 0, unit: 'Workouts', unlocked: false, xp: 200, related: [14] },
  { id: 14, title: 'Dedicated', description: 'Complete 50 workouts.', category: 'Workout', rarity: 'Epic', icon: Shield, target: 50, current: 0, unit: 'Workouts', unlocked: false, xp: 500, related: [13, 15] },
  { id: 15, title: 'Unstoppable', description: 'Complete 100 workouts.', category: 'Workout', rarity: 'Legendary', icon: Shield, target: 100, current: 0, unit: 'Workouts', unlocked: false, xp: 1500, related: [14] },
  
  // Nutrition
  { id: 16, title: 'Protein Master', description: 'Hit your protein goal 7 days in a row.', category: 'Nutrition', rarity: 'Rare', icon: Target, target: 7, current: 0, unit: 'Days', unlocked: false, xp: 200, related: [] },
  { id: 17, title: 'Hydro Homie', description: 'Hit your water goal 30 days in a row.', category: 'Nutrition', rarity: 'Epic', icon: Heart, target: 30, current: 0, unit: 'Days', unlocked: false, xp: 400, related: [] },

  // Special / Secret
  { id: 18, title: 'Midnight Athlete', description: 'Finish a workout between 12 AM and 3 AM.', category: 'Special', rarity: 'Rare', icon: Moon, target: 1, current: 0, unit: 'Times', unlocked: false, xp: 300, isSecret: false, related: [19] },
  { id: 19, title: 'Early Bird', description: 'Finish a workout before 6 AM.', category: 'Special', rarity: 'Rare', icon: Sun, target: 1, current: 0, unit: 'Times', unlocked: false, xp: 300, isSecret: false, related: [18] },
  { id: 20, title: 'Iron Will', description: 'Complete a single workout lasting longer than 90 minutes.', category: 'Special', rarity: 'Epic', icon: Zap, unlocked: false, xp: 500, related: [] },
  { id: 21, title: '???', description: 'Unlock by discovering it.', category: 'Special', rarity: 'Legendary', icon: HelpCircle, target: 1, current: 0, unit: '?', unlocked: false, xp: 1000, isSecret: true, related: [] },
]

const challenges = {
  daily: { title: "Bench Press", desc: "Complete 5 Sets of Bench Press.", reward: 80, progress: 0, target: 5 },
  weekly: { title: "Consistent", desc: "Complete 4 Workouts this week.", reward: 300, progress: 0, target: 4 },
  monthly: { title: "Titan", desc: "Workout 20 Times this month.", reward: 1500, progress: 0, target: 20 }
}

const rewardLevels = [
  { level: 5, reward: "Dark Blue Theme", unlocked: false },
  { level: 10, reward: "Premium Avatar", unlocked: false },
  { level: 20, reward: "Legend Frame", unlocked: false },
]

const recentUnlocks = []

const rarityColors = {
  Common: { border: 'border-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-400', glow: 'shadow-slate-500/20' },
  Rare: { border: 'border-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  Epic: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-blue-500/30' },
  Legendary: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/40' }
}

export default function AchievementsPage() {
  const [xpHistory, setXpHistory] = useState(initialXpHistory)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeFilter, setActiveFilter] = useState('All') // All, Unlocked, Locked
  
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showUnlockDemo, setShowUnlockDemo] = useState(false)

  const handleClaimDemoXP = () => {
    setXpHistory(prev => {
      const newToNextLevel = prev.toNextLevel - 500
      return {
        ...prev,
        today: prev.today + 500,
        thisWeek: prev.thisWeek + 500,
        total: prev.total + 500,
        level: newToNextLevel <= 0 ? prev.level + 1 : prev.level,
        toNextLevel: newToNextLevel <= 0 ? 1000 + newToNextLevel : newToNextLevel
      }
    })
    setShowUnlockDemo(false)
  }

  const unlockedCount = achievementsData.filter(a => a.unlocked).length
  const totalCount = achievementsData.length
  const completionPct = Math.round((unlockedCount / totalCount) * 100)

  const nextAchievement = achievementsData.filter(a => !a.unlocked && !a.isSecret).sort((a, b) => {
    const aProgress = a.current / a.target
    const bProgress = b.current / b.target
    return bProgress - aProgress
  })[0]

  const filteredAchievements = useMemo(() => {
    return achievementsData.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory
      const matchesFilter = activeFilter === 'All' || (activeFilter === 'Unlocked' && a.unlocked) || (activeFilter === 'Locked' && !a.unlocked)
      return matchesSearch && matchesCategory && matchesFilter
    })
  }, [search, activeCategory, activeFilter])

  return (
    <div className="space-y-8 pb-24 relative">
      
      {/* 1. Header & Demo Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
          <p className="mt-2 text-slate-400">Track your milestones, conquer challenges, and unlock rewards.</p>
        </div>
        <button 
          onClick={() => setShowUnlockDemo(true)}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-brand px-6 py-2.5 font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:scale-105"
        >
          ✨ Demo Unlock
        </button>
      </div>

      {/* 2. Top Section: XP Hero & Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Level Hero */}
        <div className="glass lg:col-span-2 relative overflow-hidden rounded-[28px] border border-brand/30 bg-gradient-to-br from-slate-900/90 to-brand/10 p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-800 bg-slate-900 shadow-xl">
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                    <circle cx="50" cy="50" r="46" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * 0.8)} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </svg>
                  <span className="text-xl font-bold text-white">{xpHistory.level}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Athlete Level {xpHistory.level}</h2>
                  <p className="text-sm text-slate-300">{xpHistory.toNextLevel} XP to Next Level</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="rounded-2xl bg-slate-950/50 p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Today's XP</p>
                  <p className="text-2xl font-bold text-emerald-400">+{xpHistory.today}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/50 p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">This Week</p>
                  <p className="text-2xl font-bold text-brand">+{xpHistory.thisWeek}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/50 p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-white">{xpHistory.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion & Next Achievement */}
        <div className="space-y-6">
          <div className="glass rounded-[28px] p-6 text-center">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Completion</h3>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl font-bold text-white">{completionPct}%</span>
              <div className="text-left">
                <p className="text-lg font-semibold text-slate-200">{unlockedCount} / {totalCount}</p>
                <p className="text-xs text-slate-500">Achievements Unlocked</p>
              </div>
            </div>
            <div className="h-2 w-full mt-4 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand to-purple-500" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          <div className="glass rounded-[28px] border-orange-500/30 bg-orange-500/5 p-6 relative overflow-hidden">
            <Target className="absolute -right-4 -bottom-4 h-24 w-24 text-orange-500/10" />
            <h3 className="text-sm font-medium text-orange-400 uppercase tracking-wider mb-3 relative z-10 flex items-center gap-2">
              <Target size={16} /> Next Achievement
            </h3>
            <p className="font-bold text-white relative z-10">{nextAchievement?.title}</p>
            <p className="text-sm text-slate-400 mt-1 mb-3 relative z-10">{nextAchievement?.current} / {nextAchievement?.target} {nextAchievement?.unit}</p>
            <div className="h-2 w-full rounded-full bg-slate-900 relative z-10">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(nextAchievement?.current / nextAchievement?.target) * 100}%` }} />
            </div>
            <p className="text-xs text-orange-300 mt-2 text-right relative z-10">{nextAchievement?.target - nextAchievement?.current} remaining</p>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Challenges & Milestones */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Challenges */}
        <div className="glass lg:col-span-2 rounded-[28px] p-6">
          <h2 className="text-xl font-bold text-white mb-6">Active Challenges</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { type: 'Daily', data: challenges.daily, color: 'emerald' },
              { type: 'Weekly', data: challenges.weekly, color: 'blue' },
              { type: 'Monthly', data: challenges.monthly, color: 'purple' },
            ].map((c) => (
              <div key={c.type} className="rounded-2xl bg-slate-900/60 p-4 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute top-0 left-0 w-full h-1 bg-${c.color}-500`} />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">{c.type}</span>
                  <span className={`text-xs font-bold text-${c.color}-400 bg-${c.color}-500/10 px-2 py-1 rounded-full`}>+{c.data.reward} XP</span>
                </div>
                <h4 className="font-bold text-white">{c.data.title}</h4>
                <p className="text-sm text-slate-400 mt-1 mb-4 h-10">{c.data.desc}</p>
                
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{c.data.progress} / {c.data.target}</span>
                  <span className={`text-${c.color}-400`}>{Math.round((c.data.progress/c.data.target)*100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-950">
                  <div className={`h-full bg-${c.color}-500 rounded-full`} style={{ width: `${(c.data.progress/c.data.target)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline & Rewards */}
        <div className="glass rounded-[28px] p-6">
          <h2 className="text-lg font-bold text-white mb-4">Milestone Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><Check size={14} /></div>
              <p className="text-sm text-slate-300 line-through decoration-slate-500">First Workout</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><Check size={14} /></div>
              <p className="text-sm text-slate-300 line-through decoration-slate-500">7-Day Streak</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><Check size={14} /></div>
              <p className="text-sm text-slate-300 line-through decoration-slate-500">Bench 100kg</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0"><Lock size={12} /></div>
              <p className="text-sm text-white font-medium">Deadlift 180kg</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0"><Lock size={12} /></div>
              <p className="text-sm text-white font-medium">100 Workouts</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <h2 className="text-lg font-bold text-white mb-4">Level Rewards</h2>
            <div className="space-y-3">
              {rewardLevels.map(r => (
                <div key={r.level} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs text-brand font-medium">Level {r.level}</p>
                    <p className={`text-sm ${r.unlocked ? 'text-white' : 'text-slate-500'}`}>{r.reward}</p>
                  </div>
                  {r.unlocked ? <Check size={16} className="text-emerald-500" /> : <Lock size={14} className="text-slate-600" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Badge Vault Filters & Grid */}
      <div className="pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">The Vault</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search achievements..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand"
              />
            </div>
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-brand"
            >
              <option value="All">All Status</option>
              <option value="Unlocked">Unlocked Only</option>
              <option value="Locked">Locked Only</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide mb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                activeCategory === cat 
                  ? 'bg-brand text-white border-brand' 
                  : 'bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredAchievements.map((achievement, idx) => {
              const rarityStyle = rarityColors[achievement.rarity]
              const isSecretLocked = achievement.isSecret && !achievement.unlocked

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={achievement.id}
                  onClick={() => setSelectedBadge(achievement)}
                  className={`glass relative cursor-pointer overflow-hidden rounded-[24px] border transition-all hover:scale-[1.02] 
                    ${achievement.unlocked ? `border-2 ${rarityStyle.border} ${rarityStyle.glow}` : 'border-slate-800 opacity-75 hover:opacity-100'} p-5`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl 
                      ${achievement.unlocked ? rarityStyle.bg : 'bg-slate-800'} 
                      ${achievement.unlocked ? rarityStyle.text : 'text-slate-500'}`}>
                      <achievement.icon size={24} />
                    </div>
                    {achievement.unlocked ? (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${rarityStyle.bg} ${rarityStyle.text}`}>
                        {achievement.rarity}
                      </span>
                    ) : (
                      <Lock size={16} className="text-slate-600" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white text-lg">{isSecretLocked ? '???' : achievement.title}</h3>
                    <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                      {isSecretLocked ? 'Unlock by discovering it.' : achievement.description}
                    </p>
                  </div>

                  {/* Progress Bar for Locked */}
                  {!achievement.unlocked && !isSecretLocked && achievement.target && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{achievement.current} / {achievement.target} {achievement.unit}</span>
                        <span className="text-slate-400">{Math.round((achievement.current / achievement.target) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-900">
                        <div className="h-full bg-slate-500 rounded-full transition-all" style={{ width: `${(achievement.current / achievement.target) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Date for Unlocked */}
                  {achievement.unlocked && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-slate-500">Unlocked {achievement.dateUnlocked}</span>
                      <span className="text-xs font-bold text-yellow-500">+{achievement.xp} XP</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {filteredAchievements.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No achievements match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md rounded-[32px] border-2 bg-slate-950 p-6 shadow-2xl relative overflow-hidden
                ${selectedBadge.unlocked ? rarityColors[selectedBadge.rarity].border : 'border-slate-800'}`}
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-4">
                <div className={`flex h-24 w-24 items-center justify-center rounded-[2rem] mb-6 shadow-2xl
                  ${selectedBadge.unlocked ? rarityColors[selectedBadge.rarity].bg : 'bg-slate-900'} 
                  ${selectedBadge.unlocked ? rarityColors[selectedBadge.rarity].text : 'text-slate-600'}`}>
                  <selectedBadge.icon size={48} />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedBadge.isSecret && !selectedBadge.unlocked ? 'Secret Achievement' : selectedBadge.title}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full 
                    ${selectedBadge.unlocked ? rarityColors[selectedBadge.rarity].bg : 'bg-slate-900'} 
                    ${selectedBadge.unlocked ? rarityColors[selectedBadge.rarity].text : 'text-slate-500'}`}>
                    {selectedBadge.rarity}
                  </span>
                  <span className="text-xs font-medium text-slate-400 px-3 py-1 bg-slate-900 rounded-full">
                    {selectedBadge.category}
                  </span>
                </div>

                <p className="text-slate-300 mb-8 px-4">
                  {selectedBadge.isSecret && !selectedBadge.unlocked ? 'The requirements for this achievement are hidden.' : selectedBadge.description}
                </p>

                <div className="w-full space-y-4 bg-slate-900/50 rounded-2xl p-5 border border-white/5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Reward</span>
                    <span className="font-bold text-yellow-500">+{selectedBadge.xp} XP</span>
                  </div>
                  
                  {!selectedBadge.unlocked && selectedBadge.target && !selectedBadge.isSecret && (
                    <div className="border-t border-white/5 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Progress</span>
                        <span className="text-white font-bold">{selectedBadge.current} / {selectedBadge.target}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-950">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${(selectedBadge.current / selectedBadge.target) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {selectedBadge.unlocked && (
                    <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                      <span className="text-sm text-slate-400">Unlocked</span>
                      <span className="font-bold text-white">{selectedBadge.dateUnlocked}</span>
                    </div>
                  )}
                </div>

                {/* Related Achievements could go here */}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Demo Reward Popup */}
      <AnimatePresence>
        {showUnlockDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.5, y: -100, rotate: 10 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full max-w-sm rounded-[40px] border border-brand/50 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-[0_0_100px_rgba(59,130,246,0.3)] relative overflow-hidden"
            >
              {/* Starburst background effect */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent opacity-50 animate-pulse" />
              
              <div className="relative z-10">
                <p className="text-sm font-bold text-brand uppercase tracking-widest mb-6">🎉 Achievement Unlocked!</p>
                
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 shadow-2xl shadow-blue-500/20 border border-blue-500/30 mb-6">
                  <Trophy size={64} />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">Heavy Lifter</h2>
                <p className="text-slate-400 mb-8">You lifted 10,000kg in a single session.</p>
                
                <div className="bg-slate-900/80 rounded-2xl p-4 mb-8 border border-white/5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Reward Earned</p>
                  <p className="text-2xl font-bold text-yellow-400">+500 XP</p>
                </div>
                
                <button 
                  onClick={handleClaimDemoXP}
                  className="w-full rounded-2xl bg-white text-slate-950 px-6 py-4 font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
