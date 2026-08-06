import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bell, Sparkles, Flame, HeartPulse, CalendarDays, TimerReset, ArrowRight, Trophy, Droplet, ShieldCheck, BadgeCheck, Activity, Target, Star, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { exerciseCatalog, getFavorites, toggleFavorite } from '../data'

const PROFILE_DATA_KEY = 'musclemap-profile-data'
const WORKOUT_HISTORY_KEY = 'musclemap-workout-history'
const DASHBOARD_STATE_KEY = 'musclemap-dashboard-state'
const ACHIEVEMENTS_KEY = 'musclemap-achievements-progress'

const baseWeeklyData = [
  { day: 'Mon', workouts: 0, calories: 0, duration: 0 },
  { day: 'Tue', workouts: 0, calories: 0, duration: 0 },
  { day: 'Wed', workouts: 0, calories: 0, duration: 0 },
  { day: 'Thu', workouts: 0, calories: 0, duration: 0 },
  { day: 'Fri', workouts: 0, calories: 0, duration: 0 },
  { day: 'Sat', workouts: 0, calories: 0, duration: 0 },
  { day: 'Sun', workouts: 0, calories: 0, duration: 0 },
]

const baseRecoveryData = [
  { muscle: 'Chest', value: 100, color: 'bg-emerald-500' },
  { muscle: 'Back', value: 100, color: 'bg-emerald-500' },
  { muscle: 'Legs', value: 100, color: 'bg-emerald-500' },
  { muscle: 'Shoulders', value: 100, color: 'bg-emerald-500' },
]

function StatsCard({ label, value, icon: Icon, progress, note }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass group rounded-[20px] p-4 sm:p-5 shadow-2xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3 text-brand transition duration-300 group-hover:bg-brand/20">
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-brand" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xs text-slate-400">{note}</p>
    </motion.div>
  )
}

function ProgressBar({ label, value, status }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{status}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-brand" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function RecoveryRow({ muscle, value, color }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{muscle}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [hydration, setHydration] = useState(0)
  const [profile, setProfile] = useState({ name: 'Athlete', weight: 0, prs: {}, targetWeight: 0, currentGoal: 'Train Hard' })
  const [favorites, setFavorites] = useState([])
  const [streak, setStreak] = useState(0)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [recentActivityList, setRecentActivityList] = useState([])
  const [weeklyChartData, setWeeklyChartData] = useState(baseWeeklyData)
  const [recoveryStatus, setRecoveryStatus] = useState(baseRecoveryData)
  const [todayWorkout, setTodayWorkout] = useState('Rest Day')
  const [unlockedBadges, setUnlockedBadges] = useState([])
  const [workoutsCount, setWorkoutsCount] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // 1. Profile Data
    try {
      const storedProfile = JSON.parse(localStorage.getItem(PROFILE_DATA_KEY))
      if (storedProfile) setProfile(storedProfile)
    } catch (e) {}

    // 2. Hydration State
    try {
      const storedState = JSON.parse(localStorage.getItem(DASHBOARD_STATE_KEY) || '{}')
      if (typeof storedState.hydration === 'number') setHydration(storedState.hydration)
    } catch (e) {}

    // 3. Favorites
    const favIds = getFavorites()
    const favList = exerciseCatalog.filter(ex => favIds.includes(ex.id))
    setFavorites(favList)

    // 4. Achievements
    try {
      const storedAch = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]')
      setUnlockedBadges(storedAch)
    } catch (e) {}

    // 5. Workout History
    try {
      const history = JSON.parse(localStorage.getItem(WORKOUT_HISTORY_KEY) || '[]')
      setWorkoutsCount(history.length)
      if (history.length > 0) {
        setStreak(history.length) // Simplified streak based on total history count
        setCaloriesBurned(history.reduce((sum, item) => sum + (item.calories || 0), 0))
        const latest = history[history.length - 1]
        setTodayWorkout(latest.planTitle || 'Custom Workout')
        
        setRecentActivityList(
          history.slice(-4).reverse().map((item) => ({
            label: item.planTitle || 'Workout',
            time: new Date(item.completedAt).toLocaleDateString(),
          }))
        )

        // Map history to weekly chart
        const chartData = [...baseWeeklyData]
        history.forEach(item => {
          const date = new Date(item.completedAt)
          const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' })
          const index = chartData.findIndex(d => d.day === dayStr)
          if (index !== -1) {
            chartData[index] = {
              ...chartData[index],
              workouts: chartData[index].workouts + 1,
              calories: chartData[index].calories + (item.calories || 0),
              duration: chartData[index].duration + (item.duration || 0)
            }
          }
        })
        setWeeklyChartData(chartData)

        // Dynamic Recovery (Naive computation based on history length for demo)
        const computeRecovery = (base, penalty) => Math.max(10, 100 - (history.length * penalty))
        setRecoveryStatus([
          { muscle: 'Chest', value: computeRecovery(100, 5), color: computeRecovery(100, 5) > 50 ? 'bg-emerald-500' : 'bg-amber-400' },
          { muscle: 'Back', value: computeRecovery(100, 8), color: computeRecovery(100, 8) > 50 ? 'bg-emerald-500' : 'bg-red-500' },
          { muscle: 'Legs', value: computeRecovery(100, 12), color: computeRecovery(100, 12) > 50 ? 'bg-emerald-500' : 'bg-red-500' },
          { muscle: 'Shoulders', value: computeRecovery(100, 3), color: 'bg-emerald-500' },
        ])
      }
    } catch (e) {}

  }, [])

  useEffect(() => {
    localStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify({ hydration }))
  }, [hydration])

  const filteredFavorites = useMemo(
    () => favorites.filter((exercise) => {
      const searchText = searchQuery.trim().toLowerCase()
      if (!searchText) return true
      return exercise.name.toLowerCase().includes(searchText) || exercise.muscle.toLowerCase().includes(searchText)
    }),
    [favorites, searchQuery]
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'
  const firstName = profile.name.split(' ')[0] || 'Athlete'

  const statCards = [
    { label: 'Workout Streak', value: `${streak} Days`, icon: Flame, progress: Math.min(100, streak * 10), note: 'Keep it going' },
    { label: 'Latest Session', value: todayWorkout, icon: HeartPulse, progress: 100, note: 'Fresh session logged' },
    { label: 'Workouts', value: workoutsCount, icon: TimerReset, progress: Math.min(100, workoutsCount * 5), note: 'Total count' },
    { label: 'Calories Burned', value: `${caloriesBurned} kcal`, icon: Sparkles, progress: Math.min(100, (caloriesBurned / 5000) * 100), note: 'Target 5,000 kcal' },
    { label: 'Weekly Goal', value: `${Math.min(workoutsCount, 5)} / 5`, icon: CalendarDays, progress: Math.min(100, (workoutsCount / 5) * 100), note: 'Almost there' },
    { label: 'Current Weight', value: `${profile.weight || 0} kg`, icon: Activity, progress: profile.targetWeight ? Math.min(100, (profile.weight / profile.targetWeight) * 100) : 0, note: profile.currentGoal },
  ]

  const handleHydrationUpdate = (value) => {
    setHydration((current) => Math.min(8, Math.max(0, current + value)))
  }
  
  const toggleFav = (id) => {
    toggleFavorite(id)
    const favIds = getFavorites()
    setFavorites(exerciseCatalog.filter(ex => favIds.includes(ex.id)))
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <section className="glass rounded-[20px] sm:rounded-[24px] border border-white/10 p-4 sm:p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{greeting}</p>
                <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">{firstName}, ready for your next session?</h1>
                <p className="mt-2 text-sm sm:text-base max-w-2xl text-slate-400">Stay focused with your premium dynamic training dashboard.</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 rounded-[20px] border border-slate-800 bg-slate-950/80 p-3 sm:p-4 shadow-inner shadow-slate-950/20">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="User avatar" className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl object-cover border border-slate-800" />
                ) : (
                  <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-brand/20 text-brand font-bold text-xl">{firstName.charAt(0)}</div>
                )}
                <div>
                  <p className="text-xs sm:text-sm text-slate-400">Active member</p>
                  <p className="text-sm sm:text-lg font-semibold">{firstName}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
              <div className="glass rounded-[20px] border border-slate-800 p-4 sm:p-5 shadow-xl shadow-slate-950/10">
                <p className="text-xs sm:text-sm text-slate-400">Today's workout</p>
                <p className="mt-2 sm:mt-3 text-lg sm:text-2xl font-semibold truncate">{todayWorkout}</p>
              </div>
              <div className="glass rounded-[20px] border border-slate-800 p-4 sm:p-5 shadow-xl shadow-slate-950/10">
                <p className="text-xs sm:text-sm text-slate-400">Calories burned</p>
                <p className="mt-2 sm:mt-3 text-lg sm:text-2xl font-semibold truncate">{caloriesBurned} kcal</p>
              </div>
              <div className="glass rounded-[20px] border border-slate-800 p-4 sm:p-5 shadow-xl shadow-slate-950/10 col-span-2 lg:col-span-1">
                <p className="text-xs sm:text-sm text-slate-400">Total Workouts</p>
                <p className="mt-2 sm:mt-3 text-lg sm:text-2xl font-semibold">{workoutsCount} sessions</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4 w-full">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="rounded-2xl bg-slate-900/80 p-3 text-brand"> <Bell size={20} /> </div>
                  <span className="text-sm sm:text-base">Ready to train</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-[22px] bg-slate-950/80 p-4 shadow-inner shadow-slate-950/10 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80">
                      <svg viewBox="0 0 120 120" className="h-full w-full">
                        <circle cx="60" cy="60" r="50" className="fill-transparent stroke-slate-800 stroke-[10]" />
                        <circle cx="60" cy="60" r="50" className="fill-transparent stroke-brand stroke-[10] stroke-linecap=round" strokeDasharray="314" strokeDashoffset={314 - (Math.min(1, streak / 30) * 314)} transform="rotate(-90 60 60)" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xl sm:text-3xl font-semibold text-white">{Math.round(Math.min(100, (streak / 30) * 100))}%</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-center sm:text-left w-full">
                      <div className="rounded-2xl bg-slate-900/90 p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-slate-400">Monthly Goal</p>
                        <p className="mt-1 sm:mt-2 text-base sm:text-xl font-semibold">{streak} / 30 Days</p>
                      </div>
                      <button onClick={() => navigate('/workout-plans')} className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-500">
                        <ArrowRight size={18} /> Start Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 flex items-center gap-3 rounded-[22px] border border-slate-800 bg-slate-900/80 px-4 py-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Search favorite exercises"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-[1.6fr,0.9fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Weekly progress</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Performance summary</h2>
            </div>
            <div className="rounded-2xl bg-slate-900/80 px-4 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand">Live</div>
          </div>
          <div className="h-[250px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyChartData} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(148,163,184,0.16)', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="workouts" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="calories" stroke="#22C55E" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="duration" stroke="#F59E0B" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Muscle recovery</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Recovery status</h2>
            </div>
            <div className="rounded-full bg-slate-900/80 px-3 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-300">Health</div>
          </div>
          <div className="space-y-4">
            {recoveryStatus.map((item) => (
              <RecoveryRow key={item.muscle} {...item} />
            ))}
          </div>
          
          {/* Recent Activity List embedded here on smaller screens or if we have space */}
          <div className="mt-6 border-t border-slate-800 pt-4">
            <p className="text-sm text-slate-400 mb-3">Recent Activities</p>
            {recentActivityList.length > 0 ? recentActivityList.map((act, i) => (
              <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-800/50 last:border-0 text-slate-300">
                <span>{act.label}</span>
                <span className="text-xs text-slate-500">{act.time}</span>
              </div>
            )) : <p className="text-sm text-slate-500">No recent activity.</p>}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-[1.2fr,0.8fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Favorite Exercises</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Your top movements</h2>
            </div>
            <button onClick={() => navigate('/favorites')} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:border-brand hover:text-white">View all</button>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {filteredFavorites.length > 0 ? (
              filteredFavorites.slice(0, 4).map((exercise) => (
                <div key={exercise.id} className="group rounded-[20px] sm:rounded-[24px] border border-slate-800 bg-slate-950/80 p-3 shadow-xl shadow-slate-950/10 transition hover:-translate-y-1 hover:border-brand flex flex-col sm:flex-row gap-3">
                  <img src={exercise.image} alt={exercise.name} className="h-32 sm:h-20 w-full sm:w-20 rounded-2xl object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-white leading-tight">{exercise.name}</h3>
                        <button onClick={() => toggleFav(exercise.id)} className="text-rose-500 bg-slate-900 p-1.5 rounded-full"><Heart size={14} className="fill-rose-500" /></button>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{exercise.muscle}</p>
                    </div>
                    <button onClick={() => navigate(`/exercise/${exercise.id}`)} className="mt-2 rounded-xl bg-brand/10 text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand hover:text-slate-950 transition">Quick Start</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-[24px] border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-400">
                No favorites found. Browse exercises to add some.
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Personal Records</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Best lifts</h2>
            </div>
            <Trophy className="text-brand" size={22} />
          </div>
          <div className="grid gap-3">
            {profile.prs && Object.keys(profile.prs).length > 0 ? (
              Object.entries(profile.prs).map(([key, val]) => (
                <div key={key} className="rounded-[20px] border border-slate-800 bg-slate-950/80 p-3 sm:p-4 shadow-inner shadow-slate-950/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="mt-1 text-lg sm:text-xl font-semibold text-white">{val} {key === 'pullups' ? 'reps' : 'kg'}</p>
                  </div>
                  <div className="rounded-2xl bg-brand/20 p-2 sm:p-3 text-brand"><Trophy size={18} /></div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No PRs logged. Edit your profile to add them.</p>
            )}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Hydration</span>
              <span>{hydration} / 8 glasses</span>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative h-32 w-32 sm:h-44 sm:w-44 rounded-full bg-slate-900/80 p-4 sm:p-6">
                <svg viewBox="0 0 120 120" className="h-full w-full">
                  <circle cx="60" cy="60" r="48" className="fill-transparent stroke-slate-800 stroke-[12]" />
                  <circle cx="60" cy="60" r="48" className="fill-transparent stroke-brand stroke-[12]" strokeLinecap="round" strokeDasharray="302" strokeDashoffset={302 - (Math.min(hydration, 8) / 8) * 302} transform="rotate(-90 60 60)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Droplet size={24} className="text-brand sm:w-7 sm:h-7" />
                  <p className="mt-1 sm:mt-3 text-2xl sm:text-3xl font-semibold text-white">{Math.round((hydration / 8) * 100)}%</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button onClick={() => handleHydrationUpdate(-1)} className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs sm:text-sm text-slate-200 transition hover:border-brand">-1</button>
              <button onClick={() => handleHydrationUpdate(1)} className="flex-1 rounded-2xl bg-brand px-3 py-2 text-xs sm:text-sm font-semibold text-slate-950 transition hover:bg-blue-500">+1 Glass</button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Achievements</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Latest badges</h2>
            </div>
            <Star className="text-brand" size={22} />
          </div>
          <div className="grid gap-3">
            {unlockedBadges.length > 0 ? (
              unlockedBadges.slice(0, 3).map((badge, i) => (
                <div key={i} className="flex items-center justify-between rounded-[22px] border border-slate-800 bg-slate-950/80 p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand/20 p-2 sm:p-3 text-brand"><Trophy size={18} /></div>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">{badge.name || `Badge #${badge.id}`}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No badges unlocked yet.</p>
            )}
          </div>
          <button onClick={() => navigate('/achievements')} className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition">View Vault →</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Goals</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Targets</h2>
            </div>
            <Target className="text-brand" size={22} />
          </div>
          <div className="space-y-4">
            <ProgressBar label="Workouts" value={Math.min(100, (workoutsCount / 20) * 100)} status={`${workoutsCount} / 20`} />
            {profile.targetWeight ? (
               <ProgressBar label="Weight Target" value={Math.min(100, (profile.weight / profile.targetWeight) * 100)} status={`${profile.weight} / ${profile.targetWeight} kg`} />
            ) : (
               <ProgressBar label="Set a weight goal" value={0} status="0%" />
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass relative rounded-[24px] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-slate-950/20">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Quick actions</p>
              <h2 className="text-xl sm:text-2xl font-semibold">Go to</h2>
            </div>
            <div className="rounded-full bg-slate-900/80 p-2 sm:p-3 text-brand"><ArrowRight size={18} /></div>
          </div>
          <div className="grid gap-2 sm:gap-3">
            <button onClick={() => navigate('/workout-plans')} className="rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-500">Start Workout</button>
            <button onClick={() => navigate('/exercises')} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-brand">Browse Exercises</button>
            <button onClick={() => navigate('/profile')} className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-brand">Log Weight</button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
