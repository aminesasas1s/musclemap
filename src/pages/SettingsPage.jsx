import { useEffect, useMemo, useState } from 'react'
import { addUser, exerciseCatalog, muscles } from '../data'

const STORAGE_KEY = 'musclemap-uploaded-videos'

export default function SettingsPage() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('musclemap-role') : 'user'
  const [videoUrl, setVideoUrl] = useState('')
  const [muscle, setMuscle] = useState(muscles[0] || '')
  const [slot, setSlot] = useState(1)
  const [message, setMessage] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPassword, setClientPassword] = useState('')
  const [clientMessage, setClientMessage] = useState('')
  const [uploadedVideos, setUploadedVideos] = useState([])
  const [uploadToken, setUploadToken] = useState(localStorage.getItem('musclemap-upload-token') || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5175'

  useEffect(() => {
    // fetch persisted uploads from backend
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/uploads`)
        const json = await res.json()
        if (json?.success) setUploadedVideos(json.uploads || [])
      } catch (e) {
        console.debug('Failed to load uploads', e)
      }
    }
    load()
  }, [])

  const adminMode = role === 'admin'

  // we no longer create object URLs; uploads are sent to the backend

  const handleCreateClientUser = (e) => {
    e.preventDefault()
    setClientMessage('')

    if (!clientName.trim() || !clientEmail.trim() || !clientPassword) {
      setClientMessage('Please complete all client fields.')
      return
    }

    const newUser = addUser({
      name: clientName,
      email: clientEmail,
      password: clientPassword,
    })

    if (!newUser) {
      setClientMessage('Unable to create client user. Email may already exist.')
      return
    }

    setClientName('')
    setClientEmail('')
    setClientPassword('')
    setClientMessage(`Client user ${newUser.email} created successfully.`)
  }

  const [videoTitle, setVideoTitle] = useState('')

  const saveUpload = async (e) => {
    e.preventDefault()
    setMessage('')
    if (selectedFile) {
      setIsConverting(true)
      const uploadObject = {
        muscle: muscle.trim(),
        slot,
        fileName: selectedFile.name,
        title: videoTitle,
      }
      console.debug('[SettingsPage] uploading file', uploadObject)
      const fd = new FormData()
      fd.append('file', selectedFile)
      fd.append('muscle', muscle)
      fd.append('slot', String(slot))
      if (videoTitle.trim()) fd.append('title', videoTitle.trim())
      try {
        const headers = uploadToken ? { 'x-upload-token': uploadToken } : {}
        const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd, headers })
        const json = await res.json()
        if (!json?.success) throw new Error(json?.message || 'Upload failed')
        console.debug('[SettingsPage] upload response', json)
        // update local list and notify other components
        const res2 = await fetch(`${API_BASE}/api/uploads`)
        const j2 = await res2.json()
        const uploads = j2?.uploads || []
        setUploadedVideos(uploads)
        try { window.dispatchEvent(new CustomEvent('musclemap:uploads-updated', { detail: uploads })) } catch (e) {}
        setMessage('Video uploaded and now visible to all users.')
        setSelectedFile(null)
        setVideoUrl('')
      } catch (err) {
        console.error(err)
        setMessage(`Upload failed: ${err?.message || String(err)}`)
      } finally {
        setIsConverting(false)
      }
      return
    }

    // fallback: user provided an external URL — save it on the server metadata
    const nextVideoUrl = videoUrl.trim()
    if (!nextVideoUrl) {
      setMessage('Choose a local video file or add a valid video URL first.')
      return
    }
    try {
      const uploadObject = { muscle: muscle.trim(), slot, videoUrl: nextVideoUrl }
      console.debug('[SettingsPage] saving external URL', uploadObject)
      const headers = uploadToken ? { 'Content-Type': 'application/json', 'x-upload-token': uploadToken } : { 'Content-Type': 'application/json' }
      const res = await fetch(`${API_BASE}/api/add-url`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ muscle, slot, videoUrl: nextVideoUrl, title: videoTitle.trim() || undefined })
      })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.message || 'Failed to save URL')
      const res2 = await fetch(`${API_BASE}/api/uploads`)
      const j2 = await res2.json()
      const uploads = j2?.uploads || []
      setUploadedVideos(uploads)
      try { window.dispatchEvent(new CustomEvent('musclemap:uploads-updated', { detail: uploads })) } catch (e) {}
      setMessage('Video URL saved and now visible to all users.')
      setVideoUrl('')
    } catch (err) {
      console.error(err)
      setMessage(`Saving URL failed: ${err?.message || String(err)}`)
    }
  }

  const handleSaveToken = () => {
    localStorage.setItem('musclemap-upload-token', uploadToken)
    setMessage('Upload token saved in localStorage for this browser.')
  }

  const handleDelete = async (muscleName, p, targetSlot) => {
    setMessage('')
    try {
      const headers = uploadToken ? { 'Content-Type': 'application/json', 'x-upload-token': uploadToken } : { 'Content-Type': 'application/json' }
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'DELETE', headers, body: JSON.stringify({ muscle: muscleName, path: p, slot: targetSlot }) })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.message || 'Delete failed')
      const res2 = await fetch(`${API_BASE}/api/uploads`)
      const j2 = await res2.json()
      setUploadedVideos(j2?.uploads || [])
      setMessage('Upload removed.')
      try { window.dispatchEvent(new CustomEvent('musclemap:uploads-updated', { detail: j2?.uploads || [] })) } catch (e) {}
    } catch (err) {
      console.error(err)
      setMessage(`Delete failed: ${err?.message || String(err)}`)
    }
  }

  const migrateLocalUploads = async () => {
    setMessage('Starting migration...')
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      for (const item of stored) {
        const { videoUrl: url, muscle: mus } = item || {}
        if (!url) continue
        if (url.startsWith('blob:') || url.startsWith('data:')) {
          try {
            const resp = await fetch(url)
            const blob = await resp.blob()
            const filename = `${(mus||'upload').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`
            const ext = blob.type && blob.type.split('/')?.[1] ? `.${blob.type.split('/')[1].split(';')[0]}` : ''
            const file = new File([blob], `${filename}${ext}`)
            const fd = new FormData()
            fd.append('file', file)
            fd.append('muscle', mus)
            fd.append('slot', item.slot || 1)
            const headers = uploadToken ? { 'x-upload-token': uploadToken } : {}
            const upl = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd, headers })
            const ju = await upl.json()
            if (!ju?.success) console.warn('migration upload failed', ju)
          } catch (e) {
            console.warn('failed migrating item', item, e)
          }
        } else {
          // external URL: save via add-url
          try {
            const headers = uploadToken ? { 'Content-Type': 'application/json', 'x-upload-token': uploadToken } : { 'Content-Type': 'application/json' }
            await fetch(`${API_BASE}/api/add-url`, { method: 'POST', headers, body: JSON.stringify({ muscle: mus, videoUrl: url, slot: item.slot || 1 }) })
          } catch (e) {
            console.warn('failed saving external url', item, e)
          }
        }
      }
      const res2 = await fetch(`${API_BASE}/api/uploads`)
      const j2 = await res2.json()
      setUploadedVideos(j2?.uploads || [])
      setMessage('Migration complete.')
    } catch (err) {
      console.error(err)
      setMessage(`Migration failed: ${err?.message || String(err)}`)
    }
  }

  const exerciseOptions = useMemo(() => exerciseCatalog.map((exercise) => ({
    value: String(exercise.id),
    label: `${exercise.name} (${exercise.muscle})`,
  })), [])

  // Compute how many slots to show for the selected muscle (always offer one more than the highest used)
  const availableSlots = useMemo(() => {
    const muscleUploads = uploadedVideos.filter(
      (item) => (item.muscle || '').trim().toLowerCase() === (muscle || '').trim().toLowerCase()
    )
    const maxUsedSlot = muscleUploads.reduce((max, item) => Math.max(max, Number(item.slot || 1)), 0)
    const totalSlots = Math.max(maxUsedSlot + 1, 1)
    return Array.from({ length: totalSlots }, (_, i) => i + 1)
  }, [muscle, uploadedVideos])

  return (
    <div className="space-y-6">
      <div className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-slate-400">Dark/Light mode, BMI and calorie calculators, timers, and advanced recommendations.</p>
      </div>

      {adminMode && (
        <section className="glass rounded-[20px] sm:rounded-[28px] p-4 sm:p-5">
          <h2 className="text-xl font-semibold">Admin video uploader</h2>
          <p className="mt-2 text-sm text-slate-400">Upload a public video URL and it will show in the video slots for all users.</p>

          <form onSubmit={saveUpload} className="mt-4 space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Muscle</span>
              <select name="muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand">
                {muscles.map((muscleOption) => (
                  <option key={muscleOption} value={muscleOption}>{muscleOption}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Target slot <span className="text-xs text-slate-500">(new slot added automatically)</span></span>
              <select name="slot" value={slot} onChange={(e) => setSlot(Number(e.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand">
                {availableSlots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Local video or GIF file</span>
              <input
                type="file"
                accept="video/*,image/gif"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Video title (optional)</span>
              <input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="My chest fly tutorial"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Or use a public video/GIF URL</span>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/... or https://example.com/animation.gif"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
              />
            </label>

            <button type="submit" disabled={isConverting} className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {isConverting ? 'Uploading...' : 'Upload video'}
            </button>
          </form>

          <div className="mt-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Upload token (optional)</span>
              <input value={uploadToken} onChange={(e) => setUploadToken(e.target.value)} placeholder="dev secret token" className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand" />
            </label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={handleSaveToken} className="rounded-2xl bg-slate-700 px-3 py-2 text-sm">Save token</button>
              <button type="button" onClick={migrateLocalUploads} className="rounded-2xl bg-slate-700 px-3 py-2 text-sm">Migrate local uploads</button>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold">Create client user</h3>
            <p className="mt-2 text-sm text-slate-400">Add a new normal user account for your website.</p>
            <form onSubmit={handleCreateClientUser} className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Full name</span>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <input
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  value={clientPassword}
                  onChange={(e) => setClientPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-brand"
                />
              </label>
              <button type="submit" className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold">Create user</button>
            </form>
            {clientMessage && <p className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{clientMessage}</p>}
          </div>

          {message && <p className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{message}</p>}
          {isConverting && <p className="mt-2 text-sm text-slate-400">Uploading your file, please wait...</p>}

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold">Uploaded video links</p>
            <div className="mt-2 space-y-2 text-xs text-slate-300">
              {uploadedVideos.length ? uploadedVideos.map((item, index) => (
                <div key={`${item.muscle}-${index}`} className="rounded-xl bg-slate-900/70 px-3 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">{item.title || item.muscle}</p>
                    <p className="text-slate-400">{item.muscle} (slot {item.slot || 1})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a target="_blank" rel="noreferrer" href={item.path && item.path.startsWith('/') ? `${API_BASE}${item.path}` : (item.path || item.videoUrl || item.url)} className="rounded-full border border-slate-700 px-2 py-1 text-xs">Open</a>
                    <button type="button" onClick={() => handleDelete(item.muscle, item.path, item.slot || 1)} className="rounded-full bg-red-700 px-2 py-1 text-xs">Delete</button>
                  </div>
                </div>
              )) : <div className="rounded-xl bg-slate-900/70 px-3 py-2">No uploaded videos yet.</div>}
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="glass rounded-[24px] p-5"><p className="text-lg font-semibold">BMI Calculator</p><p className="mt-2 text-sm text-slate-400">Lean body ratio and progress calculation.</p></div>
        <div className="glass rounded-[24px] p-5"><p className="text-lg font-semibold">Calorie Calculator</p><p className="mt-2 text-sm text-slate-400">Estimate burned energy by exercise and duration.</p></div>
        <div className="glass rounded-[24px] p-5"><p className="text-lg font-semibold">Workout Timer</p><p className="mt-2 text-sm text-slate-400">Structured rest and interval support.</p></div>
        <div className="glass rounded-[24px] p-5"><p className="text-lg font-semibold">AI Workout Plan Generator</p><p className="mt-2 text-sm text-slate-400">Goal-based routine generation for build muscle, fat loss, strength, and endurance.</p></div>
      </div>
    </div>
  )
}
