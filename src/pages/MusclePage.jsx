import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { exerciseCatalog, getCurrentUser, isUserAdmin, muscleDetails } from '../data'

const STORAGE_KEY = 'musclemap-uploaded-videos'

export default function MusclePage() {
  const { name } = useParams()
  const cleanName = name?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const detail = muscleDetails[cleanName] || muscleDetails['Chest']
  const [uploadedVideos, setUploadedVideos] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [slotTitles, setSlotTitles] = useState({})
  const [message, setMessage] = useState('')
  const videoRefs = useRef({})

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5175'
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/uploads`)
        const json = await res.json()
        if (json?.success) {
          const normalized = (json.uploads || []).map(u => {
            const rawUrl = u.videoUrl || u.path || ''
            return {
              muscle: (u.muscle || '').trim(),
              slot: Number(u.slot || 1),
              path: u.path,
              videoUrl: rawUrl.startsWith('/') ? `${API_BASE}${rawUrl}` : rawUrl,
              title: u.title,
            }
          })
          console.debug('[MusclePage] loaded uploads', normalized)
          setUploadedVideos(normalized)
        }
      } catch (e) {
        console.debug('Failed to load uploads', e)
      }
    }
    load()

    const onCustom = (e) => {
      if (e?.detail) {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5175'
        const isProd = import.meta.env.PROD
        const normalized = (e.detail || []).map(u => {
          const rawUrl = u.videoUrl || u.path || ''
          return {
            muscle: (u.muscle || '').trim(),
            slot: Number(u.slot || 1),
            path: u.path,
            videoUrl: (rawUrl.startsWith('/') && !isProd) ? `${API_BASE}${rawUrl}` : rawUrl,
            title: u.title,
          }
        })
        console.debug('[MusclePage] event uploads updated', normalized)
        setUploadedVideos(normalized)
      }
    }
    window.addEventListener('musclemap:uploads-updated', onCustom)
    return () => {
      window.removeEventListener('musclemap:uploads-updated', onCustom)
    }
  }, [])

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const exercises = useMemo(() => exerciseCatalog.filter((exercise) => {
    const targetMatch = exercise.target.includes(cleanName)
    const muscleMatch = exercise.muscle.toLowerCase() === cleanName.toLowerCase()
    const secondaryMatch = exercise.secondary.includes(cleanName)
    return targetMatch || muscleMatch || secondaryMatch
  }), [cleanName])

  const allSlots = useMemo(() => {
    // Find the highest slot number that has a video for this muscle
    const muscleUploads = uploadedVideos.filter((item) =>
      (item.muscle || '').trim().toLowerCase() === (cleanName || '').trim().toLowerCase()
    )
    const maxFilledSlot = muscleUploads.reduce((max, item) => Math.max(max, Number(item.slot || 1)), 0)
    // Always show one extra empty slot after the last filled one, and ensure all exercises are shown
    const totalSlots = Math.max(maxFilledSlot + 1, exercises.length + 1)

    return Array.from({ length: totalSlots }, (_, index) => {
      const slotNumber = index + 1
      const saved = muscleUploads.find((item) => Number(item.slot || 1) === slotNumber)
      const exercise = exercises[index] || {
        id: `placeholder-${slotNumber}`,
        name: `Exercise slot ${slotNumber}`,
        muscle: cleanName,
        target: [cleanName],
        secondary: [],
        equipment: 'Custom',
        difficulty: 'Custom',
        calories: 0,
        image: '',
        videoUrl: saved?.videoUrl || saved?.path || '',
      }
      const title = saved?.title || exercise.videoTitle || exercise.name || `Exercise slot ${slotNumber}`
      console.debug('[MusclePage] slot lookup', { slotNumber, cleanName, saved, exerciseHasVideo: Boolean(saved), title })
      return {
        ...exercise,
        slot: slotNumber,
        videoUrl: saved?.videoUrl || saved?.path || exercise.videoUrl,
        title,
      }
    })
  }, [cleanName, exercises, uploadedVideos])

  const filteredSlots = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return allSlots
    return allSlots.filter((slot) => {
      const titleMatch = (slot.title || slot.name || '').toLowerCase().includes(query)
      const nameMatch = (slot.name || '').toLowerCase().includes(query)
      return titleMatch || nameMatch
    })
  }, [searchTerm, allSlots])

  useEffect(() => {
    const titles = {}
    allSlots.forEach((slot) => {
      titles[slot.slot] = slot.title
    })
    setSlotTitles(titles)
  }, [allSlots])

  const visibleSlots = searchTerm.trim() ? filteredSlots : allSlots

  const handleRestartVideo = (id) => {
    const video = videoRefs.current[id]
    if (video) {
      video.currentTime = 0
      video.play().catch(() => { })
    }
  }

  const handleSlotTitleChange = (slotNumber, nextTitle) => {
    setSlotTitles((current) => ({ ...current, [slotNumber]: nextTitle }))
  }

  const saveSlotTitle = async (slotNumber, videoUrl) => {
    const title = (slotTitles[slotNumber] || '').trim()
    if (!videoUrl || !title) {
      setMessage('Add a title before saving for this slot.')
      return
    }
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5175'
    try {
      const res = await fetch(`${API_BASE}/api/add-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ muscle: cleanName, slot: slotNumber, videoUrl, title }),
      })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.message || 'Failed to save slot title')
      const res2 = await fetch(`${API_BASE}/api/uploads`)
      const j2 = await res2.json()
      if (j2?.success) {
        setUploadedVideos(j2.uploads || [])
        setMessage('Slot title saved successfully.')
      }
    } catch (err) {
      console.error(err)
      setMessage(`Failed to save title: ${err.message || String(err)}`)
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass overflow-hidden rounded-[32px]">
        <img className="h-44 sm:h-56 md:h-72 w-full object-cover" src={detail.image} alt={cleanName} />
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">{cleanName || 'Muscle Focus'}</h1>
          <p className="mt-3 max-w-3xl text-slate-400">{detail.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand/20 px-3 py-1 text-sm text-brand">{exercises.length} exercises</span>
            {detail.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-sm">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Exercise Videos</h2>
            <p className="mt-1 text-sm text-slate-400">Add videos — new slots appear automatically.</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-slate-400">Search by title or exercise</label>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search video titles..."
                className="w-full sm:min-w-[220px] rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none focus:border-brand"
              />
            </div>
            <span className="rounded-full bg-brand/20 px-3 py-1 text-xs text-brand">{visibleSlots.filter(s => s.videoUrl).length} video{visibleSlots.filter(s => s.videoUrl).length !== 1 ? 's' : ''} · {visibleSlots.length} slot{visibleSlots.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        {message && <p className="mt-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-200">{message}</p>}

        <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {visibleSlots.map((exercise, index) => (
            <article key={`${exercise.id}-${exercise.slot}`} className="rounded-[16px] sm:rounded-[20px] border border-slate-800 bg-slate-950/60 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">Slot {exercise.slot}</span>
                <span className="text-[11px] text-slate-400">{exercise.difficulty}</span>
              </div>
              {exercise.title && (
                <p className="mb-3 text-sm font-semibold text-slate-100">{exercise.title}</p>
              )}
              {exercise.videoUrl ? (
                exercise.videoUrl.includes('youtube.com') || exercise.videoUrl.includes('youtu.be') ? (
                  <iframe
                    className="w-full rounded-2xl border border-slate-800 aspect-video"
                    src={exercise.videoUrl}
                    title={exercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : exercise.videoUrl.toLowerCase().includes('.gif') || exercise.videoUrl.startsWith('data:image/gif') ? (
                  <img
                    className="w-full rounded-2xl border border-slate-800 object-contain"
                    src={exercise.videoUrl}
                    alt={exercise.name}
                  />
                ) : (
                  <div className="space-y-2">
                    <video ref={(element) => { if (element) videoRefs.current[exercise.id] = element }} className="w-full rounded-2xl border border-slate-800 object-contain" controls preload="none" poster={exercise.image}>
                      <source src={exercise.videoUrl} type="video/mp4" />
                    </video>
                    <button
                      type="button"
                      onClick={() => handleRestartVideo(exercise.id)}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                    >
                      Restart video
                    </button>
                  </div>
                )
              ) : (
                <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 text-center text-xs text-slate-400">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Video slot {index + 1}</p>
                    <p className="mt-1">Add the exercise video here</p>
                  </div>
                </div>
              )}

              {currentUser && isUserAdmin(currentUser) && exercise.videoUrl && (
                <div className="mt-3 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <label className="block text-xs text-slate-400">Slot title (admin only)</label>
                  <input
                    value={slotTitles[exercise.slot] ?? exercise.title}
                    onChange={(e) => handleSlotTitleChange(exercise.slot, e.target.value)}
                    placeholder="Enter slot title"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => saveSlotTitle(exercise.slot, exercise.videoUrl)}
                    className="w-full rounded-2xl bg-brand px-3 py-2 text-sm font-semibold text-slate-950"
                  >
                    Save slot title
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
