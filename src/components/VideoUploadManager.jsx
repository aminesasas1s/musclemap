import { useState, useRef } from 'react'

const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

export default function VideoUploadManager({ exerciseId, currentVideoUrl, onVideoUpload, isAdmin = false }) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [title, setTitle] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Check file type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload an MP4, WebM, or MOV file.')
      return false
    }

    // Check file size
    if (file.size > MAX_VIDEO_SIZE) {
      setError(`File size exceeds 100MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`)
      return false
    }

    return true
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')

    if (!validateFile(file)) {
      fileInputRef.current.value = ''
      return
    }

    if (!title) {
      const defaultTitle = file.name.replace(/\.[^/.]+$/, '')
      setTitle(defaultTitle)
    }

    await uploadVideo(file)
    fileInputRef.current.value = ''
  }

  const uploadVideo = async (file) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('exerciseId', exerciseId)
      formData.append('muscle', 'exercise')

      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(progress)
        }
      })

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success && response.videoUrl) {
              setSuccess('Video uploaded successfully!')
              setUploadProgress(0)
              onVideoUpload(response.videoUrl, response.title || title.trim() || null)
              setTimeout(() => setSuccess(''), 3000)
            } else {
              setError(response.message || 'Upload failed. Please try again.')
            }
          } catch (e) {
            setError('Failed to process server response.')
          }
        } else {
          setError(`Upload failed (${xhr.status}). Please try again.`)
        }
        setUploading(false)
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        setError('Network error. Please check your connection and try again.')
        setUploading(false)
      })

      xhr.addEventListener('abort', () => {
        setError('Upload cancelled.')
        setUploading(false)
      })

      // Get upload token from environment if available
      const token = import.meta.env.VITE_UPLOAD_TOKEN || ''
      if (title) {
        formData.append('title', title.trim())
      }
      xhr.open('POST', 'http://localhost:5175/api/upload')
      if (token) {
        xhr.setRequestHeader('x-upload-token', token)
      }
      xhr.send(formData)
    } catch (err) {
      setError(err.message || 'An error occurred during upload.')
      setUploading(false)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveVideo = () => {
    if (window.confirm('Are you sure you want to remove this video?')) {
      onVideoUpload(null)
      setSuccess('Video removed successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />

      <div>
        <label className="mb-2 block text-sm text-slate-400">Video name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional title for this video"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
          disabled={uploading}
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Uploading...</span>
            <span className="text-brand">{uploadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/50 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand to-cyan-400 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Action Buttons - Admin Only */}
      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={openFileDialog}
            disabled={uploading}
            className="flex-1 rounded-lg border border-brand/50 bg-brand/10 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentVideoUrl ? 'Replace Video' : 'Upload Video'}
          </button>

          {currentVideoUrl && (
            <button
              onClick={handleRemoveVideo}
              disabled={uploading}
              className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}
