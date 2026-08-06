import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { exerciseCatalog, getFavorites, toggleFavorite } from '../data'
import { motion } from 'framer-motion'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleFavorite = (id, e) => {
    e.preventDefault()
    toggleFavorite(id)
    setFavorites(getFavorites()) // Re-fetch favorites after toggling
  }

  const favoriteExercises = exerciseCatalog.filter(exercise => favorites.includes(exercise.id))

  return (
    <div className="space-y-6">
      <div className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-semibold">Favorites</h1>
        <p className="mt-2 text-slate-400">Your saved exercises and high-priority movements.</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteExercises.length > 0 ? favoriteExercises.map((exercise, idx) => (
          <motion.div 
            key={exercise.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(idx * 0.05, 0.3) }}
            className="group glass relative flex flex-col rounded-[20px] sm:rounded-[24px] border border-slate-800 p-3 sm:p-4 hover:-translate-y-1 hover:border-brand transition-all"
          >
            <button 
              onClick={(e) => handleFavorite(exercise.id, e)}
              className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md transition hover:bg-slate-800 hover:scale-110"
            >
              <Heart size={16} className="fill-rose-500 text-rose-500" />
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
        )) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Heart size={48} className="mx-auto mb-4 text-slate-700 opacity-50" />
            <p className="text-lg font-medium text-white">No favorites yet</p>
            <p className="mt-1">Tap the heart icon on any exercise to save it here.</p>
            <Link to="/exercises" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-medium text-white transition hover:bg-blue-600">
              Browse Exercises
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
