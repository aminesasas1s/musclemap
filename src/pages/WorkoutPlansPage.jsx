import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Clock3, Dumbbell, Flame, Heart, PlayCircle, Sparkles, Target, Users, Star, Calendar, X, CheckCircle2 } from 'lucide-react'
import { exerciseCatalog, workoutPlans, getCurrentUser, isUserAdmin, updateExerciseVideo } from '../data'
import VideoUploadManager from '../components/VideoUploadManager'

const goalOptions = ['Any', 'Gain Muscle', 'Lose Weight', 'Strength', 'Endurance', 'Mobility']
const muscleOptions = ['Any', 'Chest', 'Back', 'Legs', 'Arms', 'Core', 'Full Body', 'Glutes']
const difficultyOptions = ['Any', 'Beginner', 'Intermediate', 'Advanced']
const durationOptions = ['Any', '15', '30', '45', '60+']
const equipmentOptions = ['Any', 'Bodyweight', 'Dumbbells', 'Gym', 'Resistance Bands']
const daysOptions = ['Any', '3', '4', '5', '6', '7']
const FAVORITES_KEY = 'musclemap-favorites'
const WORKOUT_SESSION_KEY = 'musclemap-workout-session'
const WORKOUT_HISTORY_KEY = 'musclemap-workout-history'
const PLAN_PROGRESS_KEY = 'musclemap-plan-progress'

function createSession(plan) {
  const week = plan.weeks?.[0]
  const day = week?.days?.[0]

  return {
    planId: plan.id,
    planTitle: plan.title,
    week: week?.week ?? 1,
    day: day?.day ?? 1,
    dayTitle: day?.title ?? 'Day 1',
    estimatedTime: day?.estimatedTime ?? plan.durationMinutes,
    startedAt: new Date().toISOString(),
    currentExerciseIndex: 0,
    completedExerciseCount: 0,
    totalVolume: 0,
    calories: plan.calories,
    status: 'active',
    exercises: (day?.exercises || []).map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      completedSets: 0,
      weight: '',
      completed: false,
    })),
  }
}

export default function WorkoutPlansPage() {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const isAdmin = isUserAdmin(currentUser)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('Any')
  const [selectedMuscle, setSelectedMuscle] = useState('Any')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any')
  const [selectedDuration, setSelectedDuration] = useState('Any')
  const [selectedEquipment, setSelectedEquipment] = useState('Any')
  const [selectedDays, setSelectedDays] = useState('Any')
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [session, setSession] = useState(null)
  const [summary, setSummary] = useState(null)
  const [restSeconds, setRestSeconds] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  const [previewPlan, setPreviewPlan] = useState(null)
  const [planProgress, setPlanProgress] = useState(() => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem(PLAN_PROGRESS_KEY) || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedSession = JSON.parse(localStorage.getItem(WORKOUT_SESSION_KEY) || 'null')
      if (savedSession) {
        setSession(savedSession)
      }
    } catch {
      // ignore invalid storage payloads
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (session) {
      localStorage.setItem(WORKOUT_SESSION_KEY, JSON.stringify(session))
    }
  }, [session])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(planProgress))
  }, [planProgress])

  const activePlanId = Object.entries(planProgress).find(
    ([_, p]) => p.status === 'active' || p.status === 'paused'
  )?.[0]
  const activePlan = activePlanId ? workoutPlans.find((p) => p.id === Number(activePlanId)) : null

  useEffect(() => {
    if (!session || !isResting || restSeconds <= 0) {
      if (session && isResting && restSeconds <= 0) {
        const currentExercise = session.exercises?.[session.currentExerciseIndex ?? 0]
        if (currentExercise?.completed) {
          moveToNextExercise(session)
        } else {
          setIsResting(false)
        }
      }
      return
    }

    const timer = window.setTimeout(() => setRestSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [isResting, restSeconds, session])
  useEffect(() => {
    if (summary) {
      const timer = window.setTimeout(() => setSummary(null), 6000)
      return () => window.clearTimeout(timer)
    }
  }, [summary])

  const filteredPlans = useMemo(() => {
    const query = searchTerm.toLowerCase()

    return workoutPlans.filter((plan) => {
      const matchesSearch =
        !query ||
        [plan.title, plan.goalDescription, plan.description, plan.targetMuscle, plan.level, ...plan.exercises]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesGoal = selectedGoal === 'Any' || plan.goal === selectedGoal
      const matchesMuscle = selectedMuscle === 'Any' || plan.targetMuscle === selectedMuscle
      const matchesDifficulty = selectedDifficulty === 'Any' || plan.level === selectedDifficulty
      const matchesDuration =
        selectedDuration === 'Any' ||
        (selectedDuration === '60+'
          ? plan.durationMinutes >= 60
          : plan.durationMinutes <= Number(selectedDuration))
      const matchesEquipment =
        selectedEquipment === 'Any' || plan.equipment.some((item) => item === selectedEquipment)
      const matchesDays = selectedDays === 'Any' || plan.daysPerWeek === Number(selectedDays)
      const matchesFavorites = !favoriteOnly || favorites.includes(plan.id)

      return matchesSearch && matchesGoal && matchesMuscle && matchesDifficulty && matchesDuration && matchesEquipment && matchesDays && matchesFavorites
    })
  }, [favorites, favoriteOnly, searchTerm, selectedDays, selectedDifficulty, selectedDuration, selectedEquipment, selectedGoal, selectedMuscle])

  const toggleFavorite = (planId) => {
    setFavorites((current) =>
      current.includes(planId) ? current.filter((id) => id !== planId) : [...current, planId],
    )
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedGoal('Any')
    setSelectedMuscle('Any')
    setSelectedDifficulty('Any')
    setSelectedDuration('Any')
    setSelectedEquipment('Any')
    setSelectedDays('Any')
    setFavoriteOnly(false)
  }

  const updatePlanProgress = (planId, payload) => {
    setPlanProgress((current) => ({ ...current, [planId]: payload }))
  }

  const moveToNextExercise = (currentSession) => {
    if (!currentSession) return
    const currentIndex = currentSession.currentExerciseIndex ?? 0
    const isLastExercise = currentIndex >= currentSession.exercises.length - 1

    if (isLastExercise) {
      completeWorkout(currentSession)
      return
    }

    setSession({ ...currentSession, currentExerciseIndex: currentIndex + 1, status: 'active' })
    setIsResting(false)
    setRestSeconds(0)
  }

  const completeWorkout = (currentSession) => {
    if (!currentSession) return

    const totalDuration = Math.max(20, Math.round((Date.now() - new Date(currentSession.startedAt).getTime()) / 60000))
    const completedExercises = currentSession.exercises.filter((exercise) => exercise.completed).length
    const volume = currentSession.exercises.reduce((sum, exercise) => sum + (Number(exercise.weight || 0) * Number(exercise.reps || 0)), 0)
    const newSummary = {
      title: currentSession.planTitle,
      duration: totalDuration,
      calories: currentSession.calories,
      volume,
      exercises: currentSession.exercises.length,
      completedExercises,
      prs: 2,
      progress: 100,
      week: currentSession.week,
      day: currentSession.day,
    }

    const historyEntry = {
      planTitle: currentSession.planTitle,
      calories: currentSession.calories,
      duration: totalDuration,
      volume,
      completedAt: new Date().toISOString(),
      exercises: currentSession.exercises.length,
    }

    const existingHistory = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(WORKOUT_HISTORY_KEY) || '[]') : []
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify([...existingHistory, historyEntry]))

    updatePlanProgress(currentSession.planId, {
      planId: currentSession.planId,
      status: 'completed',
      percent: 100,
      week: currentSession.week,
      day: currentSession.day,
    })

    setSummary(newSummary)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WORKOUT_SESSION_KEY)
    }
    setSession(null)
    setIsResting(false)
    setRestSeconds(0)
  }

  const startWorkout = (plan) => {
    if (typeof window !== 'undefined') {
      const storedSession = JSON.parse(localStorage.getItem(WORKOUT_SESSION_KEY) || 'null')
      if (storedSession && storedSession.planId === plan.id) {
        setSession(storedSession)
        setSummary(null)
        setIsResting(false)
        setRestSeconds(0)
        return
      }
    }

    const newSession = createSession(plan)
    setSession(newSession)
    setSummary(null)
    setIsResting(false)
    setRestSeconds(0)
    updatePlanProgress(plan.id, { planId: plan.id, status: 'active', percent: 0, week: newSession.week, day: newSession.day })
  }

  const pauseWorkout = () => {
    if (!session) return
    const totalSets = session.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    const completedSets = session.exercises.reduce((sum, ex) => sum + (ex.completedSets || 0), 0)
    const currentProgress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
    
    updatePlanProgress(session.planId, { planId: session.planId, status: 'paused', percent: currentProgress, week: session.week, day: session.day })
    setSession(null)
  }

  const handleNextExercise = () => {
    if (!session) return

    const currentIndex = session.currentExerciseIndex ?? 0
    const nextIndex = currentIndex + 1

    if (nextIndex >= session.exercises.length) {
      completeWorkout(session)
      return
    }

    setSession({ ...session, currentExerciseIndex: nextIndex, status: 'active' })
    setIsResting(false)
    setRestSeconds(0)
  }

  const updateCurrentExercise = (patch) => {
    setSession((current) => {
      if (!current) return current
      const currentIndex = current.currentExerciseIndex ?? 0
      const nextExercises = [...current.exercises]
      nextExercises[currentIndex] = { ...nextExercises[currentIndex], ...patch }
      return { ...current, exercises: nextExercises }
    })
  }

  const handleCompleteSet = () => {
    if (!session) return

    const currentIndex = session.currentExerciseIndex ?? 0
    const currentExercise = session.exercises[currentIndex]
    if (currentExercise.completed) return

    const nextCompletedSets = currentExercise.completedSets + 1
    const isComplete = nextCompletedSets >= currentExercise.sets

    const nextExercise = {
      ...currentExercise,
      completedSets: nextCompletedSets,
      completed: isComplete,
      weight: currentExercise.weight || '',
      reps: currentExercise.reps || currentExercise.sets,
    }

    const nextExercises = [...session.exercises]
    nextExercises[currentIndex] = nextExercise

    const totalSets = nextExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    const totalCompletedSets = nextExercises.reduce((sum, ex) => sum + (ex.completedSets || 0), 0)
    const calculatedProgress = totalSets > 0 ? Math.round((totalCompletedSets / totalSets) * 100) : 0

    const nextSession = {
      ...session,
      exercises: nextExercises,
      completedExerciseCount,
      totalVolume: session.totalVolume + Number(nextExercise.weight || 0) * Number(nextExercise.reps || 0),
      status: 'active',
      progressPercent: calculatedProgress,
      currentExerciseIndex: currentIndex,
    }

    setRestSeconds(currentExercise.rest)
    setIsResting(true)

    setSession(nextSession)

    updatePlanProgress(session.planId, {
      planId: session.planId,
      status: 'active',
      percent: calculatedProgress,
      week: session.week,
      day: session.day,
    })
  }

  const handleAddSet = () => {
    if (!session) return

    const currentIndex = session.currentExerciseIndex ?? 0
    const currentExercise = session.exercises[currentIndex]
    const nextCompletedSets = currentExercise.completedSets + 1
    const nextExercise = {
      ...currentExercise,
      completedSets: nextCompletedSets,
      completed: nextCompletedSets >= currentExercise.sets,
      weight: currentExercise.weight || '',
      reps: currentExercise.reps || currentExercise.sets,
    }

    const nextExercises = [...session.exercises]
    nextExercises[currentIndex] = nextExercise
    const nextSession = {
      ...session,
      exercises: nextExercises,
      completedExerciseCount: nextExercises.filter((exercise) => exercise.completed).length,
      status: 'active',
    }

    setSession(nextSession)
    setIsResting(false)
    setRestSeconds(0)
  }

  const handleAddRestTime = () => {
    if (!session) return

    if (isResting) {
      setRestSeconds((value) => value + 10)
      return
    }

    setRestSeconds(10)
    setIsResting(true)
  }

  const currentExercise = session?.exercises?.[session.currentExerciseIndex ?? 0]
  const currentExerciseDetails = currentExercise ? exerciseCatalog.find((item) => item.id === currentExercise.exerciseId) : null
  const progressPercent = session ? (() => {
    const totalSets = session.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
    const completedSets = session.exercises.reduce((sum, ex) => sum + (ex.completedSets || 0), 0)
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
  })() : 0

  useEffect(() => {
    setVideoTitle(currentExerciseDetails?.videoTitle || '')
  }, [currentExerciseDetails?.id, currentExerciseDetails?.videoTitle])

  const handleSaveWorkoutVideoTitle = () => {
    if (!currentExerciseDetails) return
    updateExerciseVideo(currentExerciseDetails.id, currentExerciseDetails.videoUrl, videoTitle)
    setSession((s) => (s ? { ...s } : s))
  }

  return (
    <div className="space-y-6">
      {!session && !summary && (
        <>
          <div className="glass rounded-[28px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-brand">
                  <Sparkles className="h-4 w-4" />
                  <span>Premium training library</span>
                </div>
                <h1 className="mt-2 text-3xl font-semibold">Workout plans</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                  Browse goal-based programs with planned progression, equipment guidance, progress tracking, and premium-style cards.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">Programs</span>
                  </div>
                  <p className="mt-2 text-xl font-semibold">{workoutPlans.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                  <p className="mt-2 text-xl font-semibold">{favorites.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm">Visible</span>
                  </div>
                  <p className="mt-2 text-xl font-semibold">{filteredPlans.length}</p>
                </div>
              </div>
            </div>
          </div>

          {activePlan && (
            <div className="glass group relative overflow-hidden rounded-[28px] border border-brand/30 bg-gradient-to-br from-slate-900/90 to-brand/10 p-1 mb-6 mt-6">
              <div className="absolute inset-0 bg-brand/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative rounded-[24px] bg-slate-950/80 p-6 backdrop-blur-xl md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1 text-xs font-medium text-brand shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                      <Flame className="h-4 w-4" />
                      Current Active Plan
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white md:text-4xl">{activePlan.title}</h2>
                      <p className="mt-2 text-slate-400">Week {planProgress[activePlan.id]?.week || 1} • {activePlan.description}</p>
                    </div>
                    <div className="max-w-md">
                      <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                        <span>Overall Progress</span>
                        <span className="text-brand">{planProgress[activePlan.id]?.percent || 0}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-900/80 shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000"
                          style={{ width: `${planProgress[activePlan.id]?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => startWorkout(activePlan)}
                      className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-brand px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all hover:scale-105 hover:bg-brand/90 hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Continue Workout
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="glass rounded-[28px] p-6 mb-6">
            <h3 className="mb-4 text-lg font-semibold text-white">This Week's Schedule</h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row lg:items-center">
              {workoutPlans.map(plan => {
                const sp = planProgress[plan.id]
                const isCompleted = sp?.status === 'completed'
                const isActive = sp?.status === 'active' || sp?.status === 'paused'
                return (
                  <div key={plan.id} onClick={() => setPreviewPlan(plan)} className={`flex flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 transition hover:bg-white/5 ${isActive ? 'border border-brand/50 bg-brand/10' : 'border border-white/5 bg-slate-950/40'}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-brand/20 text-brand' : 'bg-slate-800 text-slate-500'}`}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isActive ? <PlayCircle className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isActive ? 'text-brand' : isCompleted ? 'text-green-400' : 'text-slate-300'}`}>{plan.title}</p>
                      <p className="text-xs text-slate-500">{plan.targetMuscle}</p>
                    </div>
                  </div>
                )
              })}
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-3 opacity-50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Sunday</p>
                  <p className="text-xs text-slate-500">Rest</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-[28px] p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="md:col-span-2 xl:col-span-1">
                <label className="mb-2 block text-sm text-slate-400">Search plans</label>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by goal or exercise"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Goal</label>
                <select value={selectedGoal} onChange={(event) => setSelectedGoal(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {goalOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Muscle focus</label>
                <select value={selectedMuscle} onChange={(event) => setSelectedMuscle(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {muscleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Difficulty</label>
                <select value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {difficultyOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Duration</label>
                <select value={selectedDuration} onChange={(event) => setSelectedDuration(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>{option === 'Any' ? 'Any' : `${option} min`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Equipment</label>
                <select value={selectedEquipment} onChange={(event) => setSelectedEquipment(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {equipmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-400">Days/week</label>
                <select value={selectedDays} onChange={(event) => setSelectedDays(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand">
                  {daysOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={() => setFavoriteOnly((value) => !value)} className={`rounded-full px-3 py-2 text-sm ${favoriteOnly ? 'bg-brand text-white' : 'bg-slate-900/70 text-slate-300'}`}>
                {favoriteOnly ? '★ Favorites only' : '☆ Favorites'}
              </button>
              <button onClick={resetFilters} className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
                Reset filters
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlans.map((plan) => {
              const isFavorite = favorites.includes(plan.id)
              const savedProgress = planProgress[plan.id]
              const canResume = savedProgress && ['active', 'paused'].includes(savedProgress.status)
              const isCompleted = savedProgress?.status === 'completed'
              
              const currentCompletion = savedProgress?.percent ?? 0
              const currentProgressLabel = savedProgress?.status === 'active' || savedProgress?.status === 'paused' 
                ? `In progress - Week ${savedProgress.week || 1}` 
                : savedProgress?.status === 'completed'
                ? `Completed`
                : 'Not started'

              return (
                <article
                  key={plan.id}
                  onClick={() => setPreviewPlan(plan)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/5 bg-slate-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-slate-900/60 hover:shadow-[0_8px_30px_rgba(56,189,248,0.15)]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    {plan.coverImage && (
                      <img src={plan.coverImage} alt={plan.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-2 flex-wrap">
                      {plan.level === 'Beginner' && <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400 backdrop-blur-md">🟢 Beginner</span>}
                      {plan.level === 'Intermediate' && <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-md">🟡 Intermediate</span>}
                      {plan.level === 'Advanced' && <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 backdrop-blur-md">🔴 Advanced</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.id); }}
                      className="absolute right-4 top-4 rounded-full bg-slate-950/40 p-2 text-slate-300 backdrop-blur-md transition hover:bg-slate-950/80 hover:text-brand"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-brand text-brand' : ''}`} />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">{plan.goal}</p>
                      <h2 className="mt-1 text-2xl font-bold text-white shadow-black drop-shadow-md">{plan.emoji} {plan.title}</h2>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="line-clamp-2 text-sm text-slate-400">{plan.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-slate-300">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {plan.rating || '4.9'} ({plan.reviews?.toLocaleString() || '2.4k'})
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-slate-300">
                        <Users className="h-3 w-3 text-brand" />
                        {plan.members?.toLocaleString() || '15k'}
                      </span>
                    </div>

                    <div className="mt-4 grid flex-1 grid-cols-2 gap-2 text-sm text-slate-300">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2">
                        <Calendar className="h-4 w-4 text-brand" />
                        {plan.durationWeeks} Weeks
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2">
                        <Dumbbell className="h-4 w-4 text-brand" />
                        {plan.daysPerWeek} Days/wk
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2">
                        <Flame className="h-4 w-4 text-orange-400" />
                        {plan.calories}/sess
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 p-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        {plan.targetMuscle}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-400">{currentProgressLabel}</span>
                        <span className="text-brand">{currentCompletion}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand to-cyan-400 transition-all duration-500" style={{ width: `${currentCompletion}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredPlans.length === 0 && (
            <div className="glass rounded-[28px] p-8 text-center text-slate-400">
              No plans match the current filters. Try widening your criteria or clearing the favorites toggle.
            </div>
          )}
        </>
      )}

      {session && (
        <div className="space-y-4">
          <div className="glass rounded-[28px] p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-4">
                <button onClick={pauseWorkout} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-slate-900/80 to-slate-800/70 text-lg text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] transition duration-200 hover:border-brand/50 hover:text-brand hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                  ←
                </button>
                <div>
                  <p className="text-sm text-brand">Workout session</p>
                  <h2 className="mt-1 text-2xl font-semibold">{session.planTitle}</h2>
                  <p className="mt-1 text-sm text-slate-400">Week {session.week} • {session.dayTitle} • {session.estimatedTime} min</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <span>Workout progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 w-48 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand to-cyan-400" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{session.completedExerciseCount} / {session.exercises.length} exercises complete</p>
                <p className="mt-1 text-xs text-brand">Set {Math.min(currentExercise?.completedSets || 0, currentExercise?.sets || 0)} / {currentExercise?.sets || 0}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="glass rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Exercise {Math.min((session.currentExerciseIndex ?? 0) + 1, session.exercises.length)} of {session.exercises.length}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{currentExerciseDetails?.name || 'Exercise'}</h3>
                </div>
                <div className="rounded-2xl border border-brand/20 bg-brand/10 px-3 py-2 text-sm text-brand">{currentExerciseDetails?.difficulty || session.level || 'Intermediate'}</div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="w-full">
                  {currentExerciseDetails?.videoUrl ? (
                    <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                        <video
                          key={currentExerciseDetails?.id}
                          controls
                          poster={currentExerciseDetails?.image}
                          className="w-full max-h-[500px] object-contain"
                        >
                          <source src={currentExerciseDetails.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl overflow-hidden bg-slate-950/70 border border-white/10 border-dashed">
                      <div className="aspect-video w-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {currentExerciseDetails?.videoTitle && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Video title</p>
                    <p className="mt-1 text-lg font-semibold text-white">{currentExerciseDetails.videoTitle}</p>
                  </div>
                )}

                {isAdmin && (
                  <div className="rounded-lg bg-slate-950/50 border border-white/10 p-3 space-y-4">
                    <VideoUploadManager
                      exerciseId={currentExerciseDetails?.id}
                      currentVideoUrl={currentExerciseDetails?.videoUrl || null}
                      onVideoUpload={(newVideoUrl, newVideoTitle) => {
                        if (!currentExerciseDetails) return
                        updateExerciseVideo(currentExerciseDetails.id, newVideoUrl, newVideoTitle)
                        setVideoTitle(newVideoTitle || '')
                        // exerciseCatalog is mutated by updateExerciseVideo; force a re-render
                        // so `currentExerciseDetails` (derived from exerciseCatalog) updates in the UI.
                        setSession((s) => (s ? { ...s } : s))
                      }}
                      isAdmin={true}
                    />

                    <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <label className="text-sm text-slate-400">Video title</label>
                      <input
                        value={videoTitle}
                        onChange={(event) => setVideoTitle(event.target.value)}
                        placeholder="Enter a title for this exercise video"
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
                      />
                      <button
                        type="button"
                        onClick={handleSaveWorkoutVideoTitle}
                        className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950"
                      >
                        Save title
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Muscles worked</span>
                  <span>Equipment</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(currentExerciseDetails?.target || []).map((muscle) => (
                    <span key={muscle} className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">{muscle}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">{currentExerciseDetails?.equipment || 'Bodyweight'}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">Sets</p>
                  <p className="mt-2 text-xl font-semibold">{currentExercise?.sets} Sets</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">Reps</p>
                  <p className="mt-2 text-xl font-semibold">{currentExercise?.reps} Reps</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-400">Rest</p>
                  <p className="mt-2 text-xl font-semibold">{currentExercise?.rest} sec</p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
                <h4 className="text-lg font-semibold">Instructions</h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  <li>Keep your posture tall and controlled.</li>
                  <li>Focus on full range of motion before increasing load.</li>
                  <li>Move with intent and breathe steadily between reps.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-[28px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Log your set</h3>
                  <button onClick={handleNextExercise} className="rounded-2xl border border-brand/30 bg-brand/10 px-3 py-2 text-sm font-medium text-brand transition hover:border-brand/50 hover:bg-brand/15">
                    {(session.currentExerciseIndex ?? 0) >= session.exercises.length - 1 ? 'Complete workout' : 'Next exercise →'}
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">Weight</label>
                    <input
                      value={currentExercise?.weight || ''}
                      onChange={(event) => updateCurrentExercise({ weight: event.target.value })}
                      placeholder="60"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-400">Reps completed</label>
                    <input
                      value={currentExercise?.reps || ''}
                      onChange={(event) => updateCurrentExercise({ reps: event.target.value })}
                      placeholder="10"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
                    />
                  </div>
                  <div className="flex gap-2">
                    {currentExercise?.completed ? (
                      <button onClick={handleNextExercise} className="flex-1 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand/90 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                        {(session.currentExerciseIndex ?? 0) >= session.exercises.length - 1 ? 'Complete workout' : 'Next exercise →'}
                      </button>
                    ) : (
                      <>
                        <button onClick={handleCompleteSet} className="flex-1 rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950">
                          Complete set
                        </button>
                        <button onClick={handleAddSet} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                          Add set
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass rounded-[28px] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Rest timer</h3>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-sm text-brand">{isResting ? `${restSeconds}s` : 'Ready'}</span>
                </div>
                {isResting ? (
                  <div className="mt-4 rounded-[20px] border border-white/10 bg-slate-950/70 p-4 text-center">
                    <p className="text-4xl font-semibold text-white">{restSeconds}</p>
                    <p className="mt-2 text-sm text-slate-400">Recovery time before the next set.</p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">The timer will automatically count down after you complete a set.</p>
                )}
                <button onClick={handleAddRestTime} className="mt-4 w-full rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
                  +10s rest
                </button>
              </div>

              <div className="glass rounded-[28px] p-6">
                <button onClick={pauseWorkout} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                  Save & continue later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div className="glass rounded-[28px] p-8 text-center">
          <p className="text-sm text-slate-400">Workout complete</p>
        </div>
      )}
      {previewPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewPlan(null)} />
          
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
            <div className="relative h-64 shrink-0 bg-slate-900">
              {previewPlan.coverImage && (
                <img src={previewPlan.coverImage} alt={previewPlan.title} className="absolute inset-0 h-full w-full object-cover opacity-60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <button 
                onClick={() => setPreviewPlan(null)}
                className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition hover:bg-brand"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap items-center gap-3">
                  {previewPlan.level === 'Beginner' && <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">🟢 Beginner</span>}
                  {previewPlan.level === 'Intermediate' && <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">🟡 Intermediate</span>}
                  {previewPlan.level === 'Advanced' && <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">🔴 Advanced</span>}
                  <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-200">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {previewPlan.rating || '4.9'}
                  </span>
                </div>
                <h2 className="mt-3 text-4xl font-bold text-white">{previewPlan.emoji} {previewPlan.title}</h2>
                <p className="mt-2 max-w-2xl text-lg text-slate-300">{previewPlan.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="col-span-2 space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Target Muscles</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-xl bg-brand/10 px-4 py-2 text-sm text-brand">{previewPlan.targetMuscle}</span>
                      {previewPlan.tags.map(t => <span key={t} className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300">{t}</span>)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">Equipment Needed</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {previewPlan.equipment.map(eq => (
                        <span key={eq} className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-4 py-2 text-sm text-slate-300">
                          <Dumbbell className="h-4 w-4 text-slate-500" />
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">Exercises Overview</h3>
                    <ul className="mt-3 space-y-3">
                      {previewPlan.exercises.slice(0, 5).map((ex, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                          <CheckCircle2 className="h-4 w-4 text-brand" />
                          {ex}
                        </li>
                      ))}
                      {previewPlan.exercises.length > 5 && (
                        <li className="text-sm italic text-slate-500">And {previewPlan.exercises.length - 5} more...</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                    <h4 className="text-sm font-medium text-slate-400">Plan Stats</h4>
                    <dl className="mt-4 space-y-4">
                      <div>
                        <dt className="text-xs text-slate-500">Total Duration</dt>
                        <dd className="mt-1 text-xl font-semibold text-white">{previewPlan.durationWeeks} Weeks</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Workouts</dt>
                        <dd className="mt-1 text-xl font-semibold text-white">{previewPlan.daysPerWeek * previewPlan.durationWeeks}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500">Calories per session</dt>
                        <dd className="mt-1 text-xl font-semibold text-white">~{previewPlan.calories}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-slate-950 p-6">
              <button
                onClick={() => {
                  startWorkout(previewPlan)
                  setPreviewPlan(null)
                }}
                className="w-full rounded-2xl bg-brand py-4 text-center text-lg font-bold text-white transition hover:bg-brand/90 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                {(() => {
                  const sp = planProgress[previewPlan.id]
                  if (sp?.status === 'completed') return 'Restart Plan'
                  if (sp?.status === 'active' || sp?.status === 'paused') return `Continue • Week ${sp?.week || 1}`
                  return 'Start Plan'
                })()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
