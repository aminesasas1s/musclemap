import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Edit3, Camera, Activity, Calendar, Trophy, Zap, MapPin, 
  Clock, Shield, Target, Flame, Dumbbell, Settings, Bell, 
  Lock, Globe, Palette, Users, Share2, PlayCircle, Star, Sparkles, CheckCircle2, UserCircle2, Heart, X
} from 'lucide-react'
import { workoutPlans } from '../data'

const PROFILE_DATA_KEY = 'musclemap-profile-data'
const WORKOUT_HISTORY_KEY = 'musclemap-workout-history'
const PLAN_PROGRESS_KEY = 'musclemap-plan-progress'

const defaultProfile = {
  name: 'Alex Carter',
  avatar: null,
  level: 12,
  xp: 1850,
  maxXp: 2500,
  streak: 18,
  memberSince: 'Jan 2026',
  online: true,

  age: 28,
  gender: 'Male',
  birthday: '1998-05-14',
  country: 'United States',
  timezone: 'EST',
  
  height: 178,
  weight: 82,
  bodyFat: 14,
  targetWeight: 78,
  experience: 'Intermediate',
  
  currentGoal: 'Build Muscle',
  secondaryGoal: 'Lose Fat',
  targetDate: '2026-12-31',

  measurements: {
    chest: 104,
    waist: 82,
    arms: 39,
    legs: 60,
  },

  prs: {
    bench: 110,
    squat: 150,
    deadlift: 190,
    pullups: 18,
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') return defaultProfile
    try {
      const stored = localStorage.getItem(PROFILE_DATA_KEY)
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile
    } catch {
      return defaultProfile
    }
  })

  const [history, setHistory] = useState([])
  const [planProgress, setPlanProgress] = useState({})
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState(profile)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setHistory(JSON.parse(localStorage.getItem(WORKOUT_HISTORY_KEY) || '[]'))
        setPlanProgress(JSON.parse(localStorage.getItem(PLAN_PROGRESS_KEY) || '{}'))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(profile))
  }, [profile])

  const totalWorkouts = history.length || 147
  const hoursTrained = Math.round(history.reduce((sum, h) => sum + (h.duration || 0), 0) / 60) || 186
  const exercisesCompleted = history.reduce((sum, h) => sum + (h.exercises || 0), 0) || 3428
  const caloriesBurned = history.reduce((sum, h) => sum + (h.calories || 0), 0) || 48700
  const weightLifted = history.reduce((sum, h) => sum + (h.volume || 0), 0) || 2450000

  const activePlanId = Object.keys(planProgress).find(id => planProgress[id]?.status === 'active' || planProgress[id]?.status === 'paused')
  const activePlan = activePlanId ? workoutPlans.find(p => p.id === Number(activePlanId)) : null

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setProfile(editForm)
    setIsEditModalOpen(false)
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-[28px] p-6 md:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand/50 bg-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-brand">{profile.name.charAt(0)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand text-slate-950 transition-transform hover:scale-110 shadow-lg">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>

          {/* Info Area */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                  {profile.online && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  )}
                </div>
                <p className="mt-1 text-slate-400 text-sm">
                  Height: {profile.height} cm • Weight: {profile.weight} kg • Goal: {profile.currentGoal}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1.5 text-brand"><Flame size={14} className="fill-brand" /> {profile.streak} Day Streak</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> Member since {profile.memberSince}</span>
                </div>
              </div>

              <button 
                onClick={() => { setEditForm(profile); setIsEditModalOpen(true); }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10 hover:border-white/20"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>

            {/* Level & XP */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                Level {profile.level} <Star size={16} className="fill-yellow-400" />
              </div>
              <div className="flex-1 w-full max-w-md">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-brand">XP: {profile.xp.toLocaleString()}</span>
                  <span className="text-slate-500">{profile.maxXp.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                    style={{ width: `${Math.min(100, (profile.xp / profile.maxXp) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI COACH */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-[24px] border border-purple-500/30 p-1 bg-gradient-to-br from-slate-900 to-purple-900/20">
        <div className="bg-slate-950/80 backdrop-blur-xl rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">AI Coach Insight</h3>
            <p className="mt-1 text-sm text-purple-200/80">You've improved your Bench Press by 15kg. Your chest training is excellent! Consider adding another leg session this week to balance your volume.</p>
          </div>
          <button className="shrink-0 rounded-xl bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500/30 transition">
            View Recommendations
          </button>
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* COLUMN 1: Personal, Goals, Measurements */}
        <div className="space-y-6">
          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserCircle2 size={18} className="text-brand" /> Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500 mb-1">Age</p><p className="font-medium text-white">{profile.age}</p></div>
              <div><p className="text-slate-500 mb-1">Gender</p><p className="font-medium text-white">{profile.gender}</p></div>
              <div><p className="text-slate-500 mb-1">Birthday</p><p className="font-medium text-white">{profile.birthday}</p></div>
              <div><p className="text-slate-500 mb-1">Country</p><p className="font-medium text-white flex items-center gap-1"><MapPin size={14} className="text-brand"/>{profile.country}</p></div>
              <div><p className="text-slate-500 mb-1">Height</p><p className="font-medium text-white">{profile.height} cm</p></div>
              <div><p className="text-slate-500 mb-1">Weight</p><p className="font-medium text-white">{profile.weight} kg</p></div>
              <div><p className="text-slate-500 mb-1">Body Fat</p><p className="font-medium text-white">{profile.bodyFat}%</p></div>
              <div><p className="text-slate-500 mb-1">Experience</p><p className="font-medium text-brand">{profile.experience}</p></div>
            </div>
          </div>

          <div className="glass rounded-[24px] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={100} /></div>
            <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2"><Target size={18} className="text-rose-400" /> Fitness Goals</h3>
            <div className="space-y-4 relative z-10 text-sm">
              <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
                <p className="text-slate-500 text-xs mb-1">Current Goal</p>
                <p className="font-bold text-white flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400"/> {profile.currentGoal}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-slate-500 mb-1">Secondary</p><p className="font-medium text-white">{profile.secondaryGoal}</p></div>
                <div><p className="text-slate-500 mb-1">Target Weight</p><p className="font-medium text-white">{profile.targetWeight} kg</p></div>
                <div><p className="text-slate-500 mb-1">Target Date</p><p className="font-medium text-white">{profile.targetDate}</p></div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-400" /> Body Measurements</h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {Object.entries(profile.measurements).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-slate-500 text-xs uppercase tracking-wider mb-1">{key}</span>
                  <div className="flex items-end gap-1"><span className="text-xl font-bold text-white">{val}</span><span className="text-sm text-slate-400 mb-0.5">cm</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Stats, PRs, Calendar, Plan */}
        <div className="space-y-6">
          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy size={18} className="text-yellow-400" /> Workout Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                <Dumbbell size={18} className="text-brand mb-2" />
                <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
                <p className="text-xs text-slate-500 mt-1">Total Workouts</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                <Clock size={18} className="text-emerald-400 mb-2" />
                <p className="text-2xl font-bold text-white">{hoursTrained}</p>
                <p className="text-xs text-slate-500 mt-1">Hours Trained</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                <Zap size={18} className="text-yellow-400 mb-2" />
                <p className="text-xl font-bold text-white">{(weightLifted / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-500 mt-1">Kg Lifted</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                <Flame size={18} className="text-rose-400 mb-2" />
                <p className="text-xl font-bold text-white">{(caloriesBurned / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-500 mt-1">Cals Burned</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-center text-slate-500">Exercises Completed: <span className="font-bold text-slate-300">{exercisesCompleted.toLocaleString()}</span></p>
          </div>

          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Star size={18} className="text-orange-400 fill-orange-400/20" /> Personal Records</h3>
            <div className="space-y-3">
              {Object.entries(profile.prs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5">
                  <span className="capitalize font-medium text-slate-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-bold text-white text-lg">{val} <span className="text-xs text-brand font-normal">{key === 'pullups' ? 'reps' : 'kg'}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Active Plan */}
          {activePlan && (
            <div className="glass rounded-[24px] border-brand/30 bg-brand/5 p-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><PlayCircle size={18} className="text-brand" /> Active Plan</h3>
              <p className="font-semibold text-xl text-white mb-1">{activePlan.title}</p>
              <p className="text-sm text-brand mb-4">Week {planProgress[activePlan.id]?.week || 1} • Day {planProgress[activePlan.id]?.day || 1}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-white font-bold">{planProgress[activePlan.id]?.percent || 0}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${planProgress[activePlan.id]?.percent || 0}%` }} />
                </div>
              </div>

              <button onClick={() => navigate('/workout-plans')} className="w-full py-2.5 bg-brand text-slate-950 font-semibold rounded-xl hover:bg-brand/90 transition shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                Continue Workout
              </button>
            </div>
          )}

          {/* Workout Calendar */}
          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-purple-400" /> This Week</h3>
            <div className="flex justify-between items-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const isCompleted = [0, 1, 3, 4].includes(i); // Mock completed days
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-slate-500">{day}</span>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-brand text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-700'}`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 3: Media, Favorites, Achievements, Settings */}
        <div className="space-y-6">
          
          {/* Achievement Showcase */}
          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield size={18} className="text-emerald-400" /> Top Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-blue-500/20">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Trophy size={20} /></div>
                <div><p className="font-bold text-white text-sm">Heavy Lifter</p><p className="text-xs text-slate-400">Epic Rarity</p></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-rose-500/20">
                <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400"><Flame size={20} /></div>
                <div><p className="font-bold text-white text-sm">30-Day Streak</p><p className="text-xs text-slate-400">Epic Rarity</p></div>
              </div>
              <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-xl border border-purple-500/20">
                <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Star size={20} /></div>
                <div><p className="font-bold text-white text-sm">Elite Athlete</p><p className="text-xs text-slate-400">Legendary Rarity</p></div>
              </div>
            </div>
            <button onClick={() => navigate('/achievements')} className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition">View All Achievements →</button>
          </div>

          {/* Progress Photos */}
          <div className="glass rounded-[24px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Camera size={18} className="text-slate-300" /> Progress Photos</h3>
              <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-white">+ Add</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80" alt="Week 1" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition" />
                <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">Wk 1</div>
              </div>
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80" alt="Week 4" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">Wk 4</div>
              </div>
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=300&q=80" alt="Week 8" className="w-full h-full object-cover transition" />
                <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-brand">Wk 8</div>
              </div>
            </div>
          </div>

          {/* Favorites */}
          <div className="glass rounded-[24px] p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-rose-500" /> Favorites</h3>
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Muscles</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-800 text-xs px-2.5 py-1 rounded-full text-slate-300">Chest</span>
                <span className="bg-slate-800 text-xs px-2.5 py-1 rounded-full text-slate-300">Back</span>
                <span className="bg-slate-800 text-xs px-2.5 py-1 rounded-full text-slate-300">Shoulders</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2">Exercises</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1 rounded-md text-slate-300">Bench Press</span>
                <span className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1 rounded-md text-slate-300">Pull-Up</span>
                <span className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1 rounded-md text-slate-300">Squat</span>
                <span className="bg-slate-900 border border-slate-700 text-xs px-2.5 py-1 rounded-md text-slate-300">Deadlift</span>
              </div>
            </div>
          </div>

          {/* Settings & Social */}
          <div className="glass rounded-[24px] p-2">
            <div className="grid grid-cols-2 p-2">
              <div className="text-center p-3 border-r border-slate-800">
                <p className="text-xl font-bold text-white">1.2k</p><p className="text-xs text-slate-500">Followers</p>
              </div>
              <div className="text-center p-3">
                <p className="text-xl font-bold text-white">450</p><p className="text-xs text-slate-500">Following</p>
              </div>
            </div>
            <div className="border-t border-slate-800/80 p-2">
              <button onClick={() => navigate('/settings')} className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-slate-300 hover:bg-slate-900/50 transition">
                <Settings size={16} /> Edit Settings
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-slate-300 hover:bg-slate-900/50 transition">
                <Lock size={16} /> Privacy & Security
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-slate-300 hover:bg-slate-900/50 transition">
                <Bell size={16} /> Notifications
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl p-3 text-sm text-brand hover:bg-brand/10 transition mt-2 border border-brand/20">
                <Share2 size={16} /> Share Profile
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4">
              <div className="glass max-h-[85vh] overflow-y-auto rounded-[28px] border border-slate-800 bg-slate-950 p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="rounded-full bg-slate-900 p-2 text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Basic Info</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Name</span><input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Age</span><input type="number" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Country</span><input value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Gender</span>
                        <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm">
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Body & Goals */}
                  <div>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Body & Goals</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Height (cm)</span><input type="number" value={editForm.height} onChange={e => setEditForm({...editForm, height: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Weight (kg)</span><input type="number" value={editForm.weight} onChange={e => setEditForm({...editForm, weight: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Body Fat %</span><input type="number" value={editForm.bodyFat} onChange={e => setEditForm({...editForm, bodyFat: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Current Goal</span><input value={editForm.currentGoal} onChange={e => setEditForm({...editForm, currentGoal: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Target Weight</span><input type="number" value={editForm.targetWeight} onChange={e => setEditForm({...editForm, targetWeight: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                      <label className="block"><span className="mb-1.5 block text-xs text-slate-400">Target Date</span><input type="date" value={editForm.targetDate} onChange={e => setEditForm({...editForm, targetDate: e.target.value})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" /></label>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Measurements (cm)</h3>
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                      {Object.keys(editForm.measurements).map(key => (
                        <label key={key} className="block"><span className="mb-1.5 block text-xs text-slate-400 capitalize">{key}</span>
                          <input type="number" value={editForm.measurements[key]} onChange={e => setEditForm({...editForm, measurements: {...editForm.measurements, [key]: e.target.value}})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Personal Records */}
                  <div>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Personal Records</h3>
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                      {Object.keys(editForm.prs).map(key => (
                        <label key={key} className="block"><span className="mb-1.5 block text-xs text-slate-400 capitalize">{key}</span>
                          <input type="number" value={editForm.prs[key]} onChange={e => setEditForm({...editForm, prs: {...editForm.prs, [key]: e.target.value}})} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 outline-none focus:border-brand text-sm" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl bg-slate-800 py-3 font-semibold hover:bg-slate-700 transition">Cancel</button>
                    <button type="submit" className="flex-1 rounded-xl bg-brand py-3 font-semibold text-slate-950 hover:bg-brand/90 transition shadow-[0_0_20px_rgba(56,189,248,0.3)]">Save Changes</button>
                  </div>
                </form>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
