import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { exerciseCatalog, getCurrentUser, isUserAdmin, updateExerciseVideo, isFavorite, toggleFavorite } from '../data'
import VideoUploadManager from '../components/VideoUploadManager'
import { Heart } from 'lucide-react'

export default function ExerciseDetailsPage() {
  const { id } = useParams()
  const [exercise, setExercise] = useState(exerciseCatalog.find((item) => String(item.id) === String(id)) || exerciseCatalog[0])
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [videoUrl, setVideoUrl] = useState(exercise.videoUrl || null)
  const isAdmin = isUserAdmin(currentUser)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const [videoTitle, setVideoTitle] = useState(exercise.videoTitle || '')
  const [isFav, setIsFav] = useState(() => isFavorite(exercise.id))

  const handleFavorite = () => {
    const added = toggleFavorite(exercise.id)
    setIsFav(added)
  }

  const handleVideoUpload = (newVideoUrl, newVideoTitle) => {
    setVideoUrl(newVideoUrl)
    const updatedTitle = newVideoTitle || videoTitle
    setVideoTitle(updatedTitle || '')
    updateExerciseVideo(exercise.id, newVideoUrl, updatedTitle)
    setExercise({ ...exercise, videoUrl: newVideoUrl, videoTitle: updatedTitle })
  }

  const handleSaveTitle = () => {
    updateExerciseVideo(exercise.id, videoUrl, videoTitle)
    setExercise({ ...exercise, videoTitle })
  }

  return (
    <div className="space-y-6">
      <div className="glass overflow-hidden rounded-[32px]">
        {/* Video Player Section */}
        <div className="relative w-full bg-slate-950">
          {/* Video area: responsive 16:9 box */}
          <div className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
            <div className="aspect-video w-full flex items-center justify-center">
              {videoUrl ? (
                <video
                  key={exercise.id}
                  className="w-full h-full object-cover"
                  controls
                  poster={exercise.image}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <svg className="w-24 h-24 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-400 text-lg">No exercise video available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {videoTitle && (
          <div className="border-t border-white/10 bg-slate-950/60 px-6 py-4">
            <p className="text-sm text-slate-400">Video title</p>
            <p className="mt-1 text-lg font-semibold text-white">{videoTitle}</p>
          </div>
        )}

        {/* Video Management Controls - Admin Only */}
        {isAdmin && (
          <div className="border-t border-white/10 bg-slate-950/50 p-4">
            <div className="grid gap-4 lg:grid-cols-[1.4fr,0.8fr]">
              <div>
                <VideoUploadManager
                  exerciseId={exercise.id}
                  currentVideoUrl={videoUrl}
                  onVideoUpload={handleVideoUpload}
                  isAdmin={true}
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                <p className="text-sm text-slate-400">Video title</p>
                <input
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter a title for this exercise video"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="mt-4 w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950"
                >
                  Save title
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Details */}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">{exercise.name}</h1>
            <button 
              onClick={handleFavorite}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 hover:bg-slate-800 transition"
            >
              <Heart size={20} className={isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
              <span className="text-sm font-medium">{isFav ? 'Saved' : 'Save to Favorites'}</span>
            </button>
          </div>
          <p className="mt-2 text-slate-400">Animated demonstration and step-by-step coaching for efficient execution.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <h2 className="font-semibold">Muscles worked</h2>
              <p className="mt-2 text-sm text-slate-400">{exercise.target.join(', ')}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <h2 className="font-semibold">Equipment needed</h2>
              <p className="mt-2 text-sm text-slate-400">{exercise.equipment}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <h2 className="font-semibold">Recommended sets / reps</h2>
              <p className="mt-2 text-sm text-slate-400">4 sets • 8-12 reps</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4">
              <h2 className="font-semibold">Estimated calories burned</h2>
              <p className="mt-2 text-sm text-slate-400">{exercise.calories} kcal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

