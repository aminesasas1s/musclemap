import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, Dumbbell, Flame, Trophy, Calendar, Medal, Plus, Download, Camera, Brain, Zap, Target, ArrowUp, ArrowDown, CheckCircle2, ChevronRight, Scale, Clock, Heart } from 'lucide-react'

// --- Mock Data for New User ---
const initialWeightData = []

const muscleDistributionData = [
  { name: 'No Data', value: 100, color: '#1e293b' },
]

const strengthProgress = [
  { name: 'Bench Press', start: 0, current: 0, unit: 'kg' },
  { name: 'Deadlift', start: 0, current: 0, unit: 'kg' },
  { name: 'Squat', start: 0, current: 0, unit: 'kg' },
  { name: 'Overhead Press', start: 0, current: 0, unit: 'kg' },
  { name: 'Pull-Ups', start: 0, current: 0, unit: 'reps' },
]

const bodyMeasurements = [
  { label: 'Weight', value: '-- kg', trend: 'none', change: '0kg' },
  { label: 'Body Fat', value: '-- %', trend: 'none', change: '0%' },
  { label: 'BMI', value: '--', trend: 'none', change: '0' },
  { label: 'Chest', value: '-- cm', trend: 'none', change: '0cm' },
  { label: 'Waist', value: '-- cm', trend: 'none', change: '0cm' },
  { label: 'Arms', value: '-- cm', trend: 'none', change: '0cm' },
  { label: 'Thighs', value: '-- cm', trend: 'none', change: '0cm' },
  { label: 'Shoulders', value: '-- cm', trend: 'none', change: '0cm' },
]

const muscleProgress = [
  { name: 'Chest', progress: 0, color: 'bg-blue-500' },
  { name: 'Back', progress: 0, color: 'bg-purple-500' },
  { name: 'Legs', progress: 0, color: 'bg-emerald-500' },
  { name: 'Shoulders', progress: 0, color: 'bg-amber-500' },
  { name: 'Arms', progress: 0, color: 'bg-red-500' },
  { name: 'Core', progress: 0, color: 'bg-cyan-500' },
]

const recoveryStatus = [
  { name: 'Chest', status: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { name: 'Legs', status: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { name: 'Shoulders', status: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { name: 'Back', status: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
]

const recentPRs = []
const achievements = []

export default function ProgressPage() {
  const [weightData, setWeightData] = useState(initialWeightData)
  const workoutsCompleted = 0
  const streak = 0
  const navigate = useNavigate()
  
  const aiInsight = useMemo(() => {
    // 1. First Time User
    if (workoutsCompleted === 0) {
      return {
        title: "Welcome to MuscleMap!",
        message: "Complete your first workout to start receiving AI-powered insights.",
        action: "Start Workout",
        icon: Brain
      }
    }

    // 2. Recovery Warning
    const fatiguedMuscle = recoveryStatus.find(m => m.status === 'Fatigued')
    if (fatiguedMuscle) {
      return {
        title: `${fatiguedMuscle.name} Recovery`,
        message: `Your ${fatiguedMuscle.name} is still recovering from your last session. Estimate: 18 hours remaining.`,
        action: "Train Other Muscles",
        icon: Activity
      }
    }

    // 3. Progressive Overload (Recent PRs)
    if (recentPRs.length > 0) {
      const pr = recentPRs[0]
      return {
        title: "Excellent progress!",
        message: `Your ${pr.name} increased by ${pr.increase}. Keep increasing weight gradually with proper form.`,
        action: "View PRs",
        icon: TrendingUp
      }
    }

    // 4. Missed Legs (Imbalance)
    const legProgress = muscleProgress.find(m => m.name === 'Legs')?.progress || 0
    const chestProgress = muscleProgress.find(m => m.name === 'Chest')?.progress || 0
    if (legProgress === 0 && chestProgress > 50) {
      return {
        title: "Muscle Imbalance Detected",
        message: "Your chest volume is much higher than your leg volume. Consider scheduling a lower-body workout.",
        action: "Start Leg Workout",
        icon: Dumbbell
      }
    }

    // 5. Weight Loss Trend
    if (weightData.length >= 2) {
      const first = weightData[0].weight
      const last = weightData[weightData.length - 1].weight
      if (first - last > 0.5) {
        return {
          title: "Healthy Weight Trend",
          message: `You've lost ${(first - last).toFixed(1)} kg recently. Your progress is steady and healthy.`,
          action: "Log Weight",
          icon: Scale
        }
      }
    }

    // 6. Consistency / Streak
    if (streak >= 7) {
      return {
        title: "Amazing consistency!",
        message: `You're on a ${streak}-day workout streak. Don't break it tomorrow!`,
        action: "View Schedule",
        icon: Flame
      }
    }

    // 7. General Fallback
    return {
      title: "Great work!",
      message: "You're consistently tracking your workouts. Keep up the momentum!",
      action: "Start Workout",
      icon: Brain
    }
  }, [workoutsCompleted, streak, weightData, recoveryStatus, muscleProgress, recentPRs])

  // Persist weight additions in local state for this session
  const handleAddWeight = () => {
    const newWeight = prompt("Enter new weight (kg):")
    if (newWeight && !isNaN(newWeight)) {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      setWeightData([...weightData, { date: dateStr, weight: parseFloat(newWeight) }])
    }
  }

  const handleUndoWeight = () => {
    if (weightData.length > 0) {
      setWeightData(weightData.slice(0, -1))
    }
  }

  const handleAiAction = () => {
    switch (aiInsight.action) {
      case "Start Workout":
      case "View Schedule":
        navigate('/workout-plans')
        break
      case "Train Other Muscles":
        navigate('/body-map')
        break
      case "Start Leg Workout":
        navigate('/muscle/legs')
        break
      case "Log Weight":
        handleAddWeight()
        break
      case "View PRs":
        window.scrollTo({ top: 500, behavior: 'smooth' })
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Fitness Journey Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative overflow-hidden rounded-[28px] border border-brand/30 bg-gradient-to-br from-slate-900/90 to-brand/10 p-6 sm:p-8"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                <Flame className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-white">Your Fitness Journey</h1>
            </div>
            <p className="text-slate-300">Level 1 • Beginner</p>
            
            <div className="mt-6 flex w-full max-w-md items-center gap-4">
              <div className="h-4 w-full flex-1 overflow-hidden rounded-full bg-slate-900/50 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand to-indigo-500"
                />
              </div>
              <span className="font-semibold text-white">0%</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">500 XP to Next Level</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 p-4 min-w-[100px]">
              <span className="text-3xl font-bold text-orange-400">{streak}</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Day Streak</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 p-4 min-w-[100px]">
              <span className="text-3xl font-bold text-brand">0</span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Achievements</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 16. AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-[24px] border-brand/30 bg-brand/5 p-5"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
            <aiInsight.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white">🧠 AI Insight: {aiInsight.title}</h3>
            <p className="text-sm text-slate-300 mt-1">{aiInsight.message}</p>
          </div>
        </div>
        <button 
          onClick={handleAiAction}
          className="whitespace-nowrap rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/80 sm:w-auto w-full"
        >
          {aiInsight.action}
        </button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Main Content) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* 6. Monthly Statistics & 19. Compare Months */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Workouts', value: workoutsCompleted, prev: '0', trend: 'none' },
              { label: 'Hours', value: '0', prev: '0', trend: 'none' },
              { label: 'Calories', value: '0', prev: '0', trend: 'none' },
              { label: 'Weight Lifted', value: '0', prev: '0', trend: 'none' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-[24px] p-4 text-center">
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>vs {stat.prev}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 14. Weight Timeline */}
          <div className="glass rounded-[24px] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Weight Timeline</h2>
                <p className="text-sm text-slate-400">Current: <span className="font-bold text-white">{weightData.length > 0 ? weightData[weightData.length - 1].weight : '--'} kg</span></p>
              </div>
              <div className="flex gap-2">
                {weightData.length > 0 && (
                  <button onClick={handleUndoWeight} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 border border-white/5">
                    Undo
                  </button>
                )}
                <button onClick={handleAddWeight} className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                  <Plus className="h-4 w-4" /> Add Weight
                </button>
              </div>
            </div>
            <div className="h-64 w-full">
              {weightData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-slate-500">
                  <Scale className="mb-2 h-8 w-8 opacity-50" />
                  <p>No weight data yet. Click "Add Weight" to start tracking!</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '16px', color: '#fff' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} dot={{ fill: '#020617', stroke: '#3b82f6', strokeWidth: 3, r: 5 }} activeDot={{ r: 8, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* 3. Strength Progress (PRs) */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Strength Progress</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {strengthProgress.map((pr, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                  <p className="font-medium text-slate-300">{pr.name}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">{pr.current}<span className="text-sm font-normal text-slate-400"> {pr.unit}</span></p>
                      <p className="text-xs text-slate-500 mt-1">{pr.start} {pr.unit} initially</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-1 text-xs font-medium text-slate-400">
                      -
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Muscle Progress Weekly */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Muscle Training Progress (Weekly)</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {muscleProgress.map((muscle, i) => (
                <div key={i}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-300">{muscle.name}</span>
                    <span className="text-white">{muscle.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${muscle.progress}%` }} className={`h-full rounded-full ${muscle.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Workout Heatmap & 8. Workout Calendar */}
          <div className="glass rounded-[24px] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Consistency Heatmap</h2>
              <select className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none focus:border-brand">
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2">
                {Array.from({ length: 12 }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {Array.from({ length: 7 }).map((_, rowIndex) => {
                      const isActive = Math.random() > 0.4;
                      const isHighlyActive = Math.random() > 0.8;
                      return (
                        <div 
                          key={`${colIndex}-${rowIndex}`} 
                          className={`h-4 w-4 rounded-sm sm:h-5 sm:w-5 sm:rounded-md transition-colors ${
                            isHighlyActive ? 'bg-brand' : isActive ? 'bg-brand/40' : 'bg-slate-800/50'
                          }`}
                          title={`Workout ${isActive ? 'completed' : 'missed'}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span>Less</span>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-slate-800/50" />
                <div className="h-3 w-3 rounded-sm bg-brand/40" />
                <div className="h-3 w-3 rounded-sm bg-brand" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* 15. Photos */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Progress Photos</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[1, 4, 8].map((week) => (
                <div key={week} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-900">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 p-3 pt-8">
                    <p className="text-sm font-medium text-white">Week {week}</p>
                  </div>
                </div>
              ))}
              <div className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 bg-slate-950/40 text-slate-500 transition hover:border-brand/50 hover:text-brand">
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Add Photo</span>
              </div>
            </div>
          </div>

          {/* 7. Goal Progress & 12. Weekly Goals */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="glass rounded-[24px] p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Long Term Goals</h2>
              <div className="space-y-6">
                {[
                  { label: 'Lose Weight (Target: 70kg)', progress: 0, color: 'bg-emerald-500' },
                  { label: 'Gain Muscle (Target: 15% BF)', progress: 0, color: 'bg-brand' },
                ].map((goal, i) => (
                  <div key={i}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-slate-300">{goal.label}</span>
                      <span className="text-white">{goal.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }} className={`h-full rounded-full ${goal.color}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-[24px] p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Weekly Goals</h2>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-300">5 Workouts</span>
                    <span className="text-white">0 / 5</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className={`h-2.5 flex-1 rounded-full bg-slate-900`} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-300">Protein (180g/day)</span>
                    <span className="text-white">0 / 7 Days</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                      <div key={step} className={`h-2.5 flex-1 rounded-full bg-slate-900`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-6">
          
          {/* 9. Best Workout */}
          <div className="glass rounded-[24px] border border-yellow-500/20 bg-gradient-to-b from-yellow-500/10 p-6">
            <div className="mb-4 flex items-center gap-3 text-yellow-400">
              <Trophy className="h-6 w-6" />
              <h2 className="text-lg font-bold">Best Session</h2>
            </div>
            <h3 className="text-2xl font-bold text-slate-400">No sessions yet</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Duration</p>
                <p className="font-semibold text-slate-500">0 Minutes</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Calories</p>
                <p className="font-semibold text-slate-500">0 kcal</p>
              </div>
            </div>
          </div>

          {/* 2. Body Measurements */}
          <div className="glass rounded-[24px] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Measurements</h2>
              <Scale className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {bodyMeasurements.map((measure, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-950/40 p-3">
                  <span className="text-sm font-medium text-slate-300">{measure.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{measure.value}</span>
                    <span className={`flex items-center text-xs font-medium text-slate-500`}>
                      -
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 11. Recovery */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Muscle Recovery</h2>
            <div className="space-y-3">
              {recoveryStatus.map((muscle, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">{muscle.name}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${muscle.color} ${muscle.bg}`}>
                    {muscle.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 17. Workout Distribution Pie Chart */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Volume Distribution</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {muscleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {muscleDistributionData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* 18. Nutrition Progress */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Today's Nutrition</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-400">Protein</span>
                  <span className="font-medium text-slate-500">0 / 200g</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900"><div className="h-full w-[0%] rounded-full bg-blue-500" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-400">Carbs</span>
                  <span className="font-medium text-slate-500">0 / 300g</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900"><div className="h-full w-[0%] rounded-full bg-emerald-500" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-400">Water</span>
                  <span className="font-medium text-slate-500">0 / 8 Glasses</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900"><div className="h-full w-[0%] rounded-full bg-cyan-500" /></div>
              </div>
            </div>
          </div>

          {/* 10. Recent PRs & 13. Achievement Timeline */}
          <div className="glass rounded-[24px] p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">Recent Milestones</h2>
            <div className="space-y-6">
              {recentPRs.length === 0 && achievements.length === 0 && (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-500 mb-3">
                    <Medal className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-slate-400">Complete your first workout to unlock milestones and achievements!</p>
                </div>
              )}
              {recentPRs.map((pr, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{pr.name} <span className="text-brand">{pr.increase}</span></p>
                    <p className="text-xs text-slate-400">{pr.date}</p>
                  </div>
                </div>
              ))}
              
              <div className="my-4 h-px w-full bg-white/5" />

              {achievements.map((ach, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ach.bg} ${ach.color}`}>
                    <ach.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{ach.title}</p>
                    <p className="text-xs text-slate-400">{ach.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 20. Export Progress */}
          <div className="glass flex flex-col gap-3 rounded-[24px] p-6">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              <Download className="h-4 w-4" /> Export as PDF
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              <Download className="h-4 w-4" /> Export as CSV
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
