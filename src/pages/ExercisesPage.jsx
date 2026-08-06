import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { exerciseCatalog, muscles, isFavorite, toggleFavorite } from '../data'
import { motion } from 'framer-motion'

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedEquipment, setSelectedEquipment] = useState('All')
  const [favorites, setFavorites] = useState(() => exerciseCatalog.filter(e => isFavorite(e.id)).map(e => e.id))

  const handleFavorite = (id, e) => {
    e.preventDefault()
    const added = toggleFavorite(id)
    setFavorites(prev => added ? [...prev, id] : prev.filter(fid => fid !== id))
  }

  // Extract unique equipment for filter
  const equipments = useMemo(() => {
    const all = exerciseCatalog.map(e => e.equipment)
    return ['All', ...new Set(all)]
  }, [])

  const filteredExercises = useMemo(() => {
    return exerciseCatalog.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase()) || 
                            exercise.target.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchesMuscle = selectedMuscle === 'All' || exercise.target.includes(selectedMuscle)
      const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty
      const matchesEquipment = selectedEquipment === 'All' || exercise.equipment === selectedEquipment
      
      return matchesSearch && matchesMuscle && matchesDifficulty && matchesEquipment
    })
  }, [search, selectedMuscle, selectedDifficulty, selectedEquipment])

  return (
    <div className="space-y-6">
      <div className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-semibold">Exercises</h1>
        <p className="mt-2 text-slate-400">Discover and filter the best movement patterns for your goals.</p>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Search exercises..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
          />
          <select 
            value={selectedMuscle} 
            onChange={(e) => setSelectedMuscle(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
          >
            <option value="All">All Muscles</option>
            {muscles.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
          >
            {equipments.map(e => <option key={e} value={e}>{e === 'All' ? 'All Equipment' : e}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredExercises.length > 0 ? filteredExercises.map((exercise, idx) => {
          const isFav = favorites.includes(exercise.id)
          return (
            <motion.div 
              key={exercise.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              className="group glass relative flex flex-col rounded-[20px] sm:rounded-[24px] border border-slate-800 p-3 sm:p-4 hover:-translate-y-1 hover:border-brand transition-all"
            >
              <button 
                onClick={(e) => handleFavorite(exercise.id, e)}
                className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md transition hover:bg-slate-800 hover:scale-110"
              >
                <Heart size={16} className={isFav ? 'fill-rose-500 text-rose-500' : 'text-white'} />
              </button>
              
              <Link to={`/exercise/${exercise.id}`} className="flex flex-col h-full">
                <img className="h-40 w-full rounded-[16px] object-cover" src={exercise.image} alt={exercise.name} />
                <div className="mt-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold leading-tight">{exercise.name}</h2>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-brand/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand">{exercise.difficulty}</span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-300">{exercise.equipment}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400 mt-auto">{exercise.target.join(', ')}</p>
                </div>
              </Link>
            </motion.div>
          )
        }) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            No exercises match your current filters. Try adjusting them.
          </div>
        )}
      </div>
    </div>
  )
}

