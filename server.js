import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { PrismaClient } from './src/generated/prisma/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5175
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
const metadataFile = path.join(uploadsDir, 'uploads.json')

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(metadataFile)) fs.writeFileSync(metadataFile, '[]')

const MAX_FILE_BYTES = parseInt(process.env.MAX_UPLOAD_BYTES || String(200 * 1024 * 1024), 10) // default 200MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ''
    const muscle = (req.body.muscle || 'upload').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    cb(null, `${muscle}-${unique}${ext}`)
  }
})

function fileFilter(req, file, cb) {
  const allowed = (file.mimetype || '').startsWith('video/') || (file.mimetype === 'image/gif')
  if (!allowed) return cb(new Error('Invalid file type. Only video files and GIFs are allowed.'), false)
  cb(null, true)
}

const upload = multer({ storage, limits: { fileSize: MAX_FILE_BYTES }, fileFilter })

// simple token auth middleware: if UPLOAD_TOKEN set, require header x-upload-token
function requireUploadToken(req, res, next) {
  const token = process.env.UPLOAD_TOKEN || ''
  if (!token) return next()
  const provided = req.headers['x-upload-token'] || req.query?.token
  if (!provided || String(provided) !== String(token)) return res.status(401).json({ success: false, message: 'Unauthorized' })
  return next()
}

function readMetadata() {
  try {
    const raw = fs.readFileSync(metadataFile, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

function writeMetadata(data) {
  fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2))
}

app.use('/uploads', express.static(uploadsDir))

app.get('/api/uploads', (req, res) => {
  const list = readMetadata()
  res.json({ success: true, uploads: list })
})

// Authentication Endpoints

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' })

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash }
    })
    
    // Auto-login after register
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.post('/api/upload', requireUploadToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
    const muscleRaw = req.body.muscle || ''
    const muscle = String(muscleRaw).trim()
    const titleRaw = req.body.title || ''
    const title = String(titleRaw).trim()
    const filename = req.file.filename
    const filePath = `/uploads/${filename}`
    const rawSlot = req.body.slot
    const slot = Number.isInteger(Number(rawSlot)) && Number(rawSlot) >= 1
      ? Number(rawSlot)
      : 1

    const metadata = readMetadata()
    const idx = metadata.findIndex((m) => {
      const entryMuscle = (m.muscle || '').toLowerCase()
      const entrySlot = Number(m.slot || 1)
      return entryMuscle === muscle.toLowerCase() && entrySlot === slot
    })
    const entry = {
      muscle,
      slot,
      path: filePath,
      videoUrl: filePath,
      title: title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      originalName: req.file.originalname,
    }
    if (idx !== -1) {
      // remove old file
      try {
        const oldPath = path.join(uploadsDir, path.basename(metadata[idx].path || ''))
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      } catch (e) {
        console.warn('Failed to remove old upload', e)
      }
      metadata[idx] = entry
    } else {
      metadata.push(entry)
    }

    writeMetadata(metadata)
    console.log('[server] saved upload', entry)
    console.log('[server] uploads.json', JSON.stringify(metadata, null, 2))
    return res.json({ success: true, upload: entry, videoUrl: entry.videoUrl })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: String(err) })
  }
})

// delete an upload by muscle, slot, or path
app.delete('/api/upload', requireUploadToken, (req, res) => {
  try {
    const { muscle = '', path: givenPath = '', slot: slotValue } = req.body || {}
    let metadata = readMetadata()
    const slot = Number.isInteger(Number(slotValue)) && Number(slotValue) >= 1
      ? Number(slotValue)
      : null
    const idx = metadata.findIndex((m) => {
      const sameMuscle = (m.muscle || '').toLowerCase() === (muscle || '').toLowerCase()
      const sameSlot = slot === null ? true : Number(m.slot || 1) === slot
      const samePath = (m.path || '') === givenPath
      return (sameMuscle && sameSlot) || samePath
    })
    if (idx === -1) return res.status(404).json({ success: false, message: 'Upload not found' })
    const removed = metadata.splice(idx, 1)[0]
    // remove file from disk if it's a local upload path
    try {
      if (removed.path && removed.path.startsWith('/uploads/')) {
        const fileOnDisk = path.join(uploadsDir, path.basename(removed.path))
        if (fs.existsSync(fileOnDisk)) fs.unlinkSync(fileOnDisk)
      }
    } catch (e) {
      console.warn('Failed to remove file on delete', e)
    }
    writeMetadata(metadata)
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: String(err) })
  }
})

app.post('/api/add-url', (req, res) => {
  try {
    const { muscle = '', videoUrl = '', slot: slotValue, title: titleRaw = '' } = req.body || {}
    if (!videoUrl) return res.status(400).json({ success: false, message: 'videoUrl required' })
    const title = String(titleRaw).trim()
    const slot = Number.isInteger(Number(slotValue)) && Number(slotValue) >= 1
      ? Number(slotValue)
      : 1
    const metadata = readMetadata()
    const idx = metadata.findIndex((m) => {
      const entryMuscle = (m.muscle || '').toLowerCase()
      const entrySlot = Number(m.slot || 1)
      return entryMuscle === String(muscle).toLowerCase() && entrySlot === slot
    })
    const entry = {
      muscle,
      slot,
      path: videoUrl,
      videoUrl,
      title: title || path.basename(videoUrl, path.extname(videoUrl)),
    }
    if (idx !== -1) {
      metadata[idx] = { ...metadata[idx], ...entry }
    } else {
      metadata.push(entry)
    }
    writeMetadata(metadata)
    console.log('[server] saved URL upload', entry)
    console.log('[server] uploads.json', JSON.stringify(metadata, null, 2))
    return res.json({ success: true, upload: entry })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Upload server listening on http://localhost:${PORT}`)
})
