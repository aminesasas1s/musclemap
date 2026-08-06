export const adminAccount = {
  email: 'admin@musclemap.fit',
  password: 'admin123',
}

export const clientAccount = {
  email: 'test@musclemap.fit',
  password: 'testuser',
}

export const USER_STORAGE_KEY = 'musclemap-users'
export const CURRENT_USER_KEY = 'musclemap-current-user'

export const getStoredUsers = () => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]')
}

export const saveStoredUsers = (users) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users))
}

export const findUserByEmail = (email) => {
  if (typeof email !== 'string') return undefined
  const normalizedEmail = email.trim().toLowerCase()
  return getStoredUsers().find((user) => user.email === normalizedEmail)
}

export const addUser = ({ name, email, password }) => {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const normalizedName = typeof name === 'string' ? name.trim() : ''

  if (!normalizedName || !normalizedEmail || !password) return null
  if (normalizedEmail === adminAccount.email) return null
  if (findUserByEmail(normalizedEmail)) return null

  const newUser = {
    name: normalizedName,
    email: normalizedEmail,
    password,
    role: 'user',
  }

  saveStoredUsers([...getStoredUsers(), newUser])
  return newUser
}

const normalizeStoredUser = (value) => {
  if (!value) return null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    try {
      return normalizeStoredUser(JSON.parse(trimmed))
    } catch {
      const normalizedEmail = trimmed.toLowerCase()
      return {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        role: normalizedEmail === adminAccount.email ? 'admin' : 'user',
      }
    }
  }

  if (typeof value === 'object') {
    const normalizedUser = { ...value }
    const normalizedEmail = typeof value.email === 'string' ? value.email.trim().toLowerCase() : ''

    if (normalizedEmail) {
      normalizedUser.email = normalizedEmail
    }

    if (typeof value.name === 'string' && value.name.trim()) {
      normalizedUser.name = value.name.trim()
    }

    normalizedUser.role = normalizedUser.role === 'admin' || normalizedEmail === adminAccount.email ? 'admin' : 'user'
    return normalizedUser
  }

  return null
}

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return normalizeStoredUser(stored)
}

export const setCurrentUser = (user) => {
  if (typeof window === 'undefined') return
  const normalizedUser = normalizeStoredUser(user)

  if (normalizedUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizedUser))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export const isUserAdmin = (user = null) => {
  const targetUser = user || getCurrentUser()
  if (!targetUser) return false
  return targetUser.role === 'admin' || targetUser.email === adminAccount.email
}

export const updateExerciseVideo = (exerciseId, videoUrl, videoTitle = null) => {
  if (typeof window === 'undefined') return false
  // This updates the video metadata in the current session
  // In a real app, this would persist to a backend
  const index = exerciseCatalog.findIndex(e => e.id === exerciseId)
  if (index !== -1) {
    exerciseCatalog[index].videoUrl = videoUrl
    if (videoTitle !== null) {
      exerciseCatalog[index].videoTitle = String(videoTitle).trim() || null
    }
    return true
  }
  return false
}

export const muscles = [
  'Neck', 'Traps', 'Shoulders', 'Chest', 'Back', 'Biceps', 'Triceps', 'Forearms', 'Lats', 'Abs', 'Obliques', 'Glutes', 'Quadriceps', 'Hamstrings', 'Adductors', 'Calves', 'Tibialis'
]

export const muscleDetails = {
  Chest: {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
    description: 'The chest drives pressing power, upper-body strength, and explosive pushing capacity. Prioritize controlled tempo, full stretch, and stable shoulder position.',
    tags: ['Push Strength', 'Power', 'Compound'],
  },
  Back: {
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=80',
    description: 'Back training builds posture, pull strength, and structural balance. Strong lats and upper-back fibers improve pulling, bracing, and shoulder stability.',
    tags: ['Pull Strength', 'Posture', 'Compound'],
  },
  Shoulders: {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80',
    description: 'Shoulders support overhead work, stabilize the upper arm, and connect pressing power to the rest of the torso.',
    tags: ['Stability', 'Press', 'Balance'],
  },
  Quadriceps: {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
    description: 'Quadriceps power knee extension and support powerful squat and jump mechanics. Build them with progressive loading and depth-focused range.',
    tags: ['Leg Drive', 'Explosive', 'Strength'],
  },
  Glutes: {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80',
    description: 'Glutes are the engine for hip extension, posture, and full-body power. They are central to sprinting, squatting, and posterior chain performance.',
    tags: ['Power', 'Hip Extension', 'Posterior Chain'],
  },
  Hamstrings: {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    description: 'Hamstrings control deceleration, knee flexion, and hip extension. Build them with both knee-dominant and hip-dominant patterns.',
    tags: ['Posterior Chain', 'Hip Drive', 'Recovery'],
  },
  Abs: {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    description: 'The abdominal wall supports trunk stability, bending control, and force transfer from the lower to upper body.',
    tags: ['Core', 'Stability', 'Control'],
  },
  Calves: {
    image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1400&q=80',
    description: 'Calves drive ankle power, balance, and lower-leg endurance. Focus on both plantar flexion and controlled ROM.',
    tags: ['Balance', 'Endurance', 'Lower Leg'],
  },
  Biceps: {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=80',
    description: 'Biceps support elbow flexion and pull mechanics. Use controlled concentric and eccentric rep work for clean arm development.',
    tags: ['Arm Size', 'Pull', 'Isolation'],
  },
  Triceps: {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80',
    description: 'The triceps contribute heavily to pressing force and pressing lockout strength. They respond well to varied angles and controlled tempo.',
    tags: ['Lockout', 'Press', 'Push'],
  },
  Forearms: {
    image: 'https://images.unsplash.com/photo-1571019614245-cd287e2385a2?auto=format&fit=crop&w=1400&q=80',
    description: 'Forearms increase grip strength, stabilisation, and durability on rows, carries, and loaded carries.',
    tags: ['Grip', 'Grip Endurance', 'Support'],
  },
  Lats: {
    image: 'https://images.unsplash.com/photo-1599058917212-d80ac5a8f7c3?auto=format&fit=crop&w=1400&q=80',
    description: 'Lats connect the torso to the upper arm and improve shoulder extension, scapular control, and heavy pulling capacity.',
    tags: ['Pull Width', 'Mobility', 'Upper Body'],
  },
  Obliques: {
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1400&q=80',
    description: 'Obliques resist torso rotation and improve anti-rotation strength for higher performance in lifts and sports.',
    tags: ['Anti-Rotation', 'Core', 'Balance'],
  },
  Tibialis: {
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80',
    description: 'The tibialis supports lower-leg stability and ankle control, improving balance and movement efficiency during lower-body work.',
    tags: ['Ankle Control', 'Balance', 'Foot Stability'],
  },
  Adductors: {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    description: 'Adductors support leg stability and hip control, especially during squats, lunges, and lateral movement.',
    tags: ['Hip Stability', 'Leg Control', 'Mobility'],
  },
  Neck: {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    description: 'The neck supports the head and aids posture. Training it improves cervical stability and overall body alignment.',
    tags: ['Posture', 'Stability', 'Head Control'],
  },
  Traps: {
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
    description: 'Traps stabilize the shoulders, support posture, and contribute to back strength in rows, shrugs, and carries.',
    tags: ['Posture', 'Back', 'Shoulder Stability'],
  },
}

export const exerciseCatalog = [
  {
    "id": 1,
    "muscle": "Abs",
    "name": "Alternating VUps Full Abs",
    "target": [
      "Abs"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/abs/Alternating_VUps_Full_Abs.mp4"
  },
  {
    "id": 2,
    "muscle": "Abs",
    "name": "Crunches Upper Abs",
    "target": [
      "Abs"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/abs/Crunches_Upper_Abs.mp4"
  },
  {
    "id": 3,
    "muscle": "Abs",
    "name": "Lying Leg Twists Abdominals",
    "target": [
      "Abs"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/abs/Lying_Leg_Twists_Abdominals.mp4"
  },
  {
    "id": 4,
    "muscle": "Abs",
    "name": "Reverse Crunches Lower Abs",
    "target": [
      "Abs"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/abs/Reverse_Crunches_Lower_Abs.mp4"
  },
  {
    "id": 5,
    "muscle": "Back",
    "name": "Barbell Row",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Barbell_Row.mp4"
  },
  {
    "id": 6,
    "muscle": "Back",
    "name": "Lat Pulldown Entire Lats Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Lat_Pulldown_Entire_Lats_Focus.mp4"
  },
  {
    "id": 7,
    "muscle": "Back",
    "name": "Lat Pulldown Lower Lats Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Lat_Pulldown_Lower_Lats_Focus.mp4"
  },
  {
    "id": 8,
    "muscle": "Back",
    "name": "Lat Pulldown Upper Lats Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Lat_Pulldown_Upper_Lats_Focus.mp4"
  },
  {
    "id": 9,
    "muscle": "Back",
    "name": "Seated Cable Row Lats Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Seated_Cable_Row_Lats_Focus.mp4"
  },
  {
    "id": 10,
    "muscle": "Back",
    "name": "Seated Cable Row Mid Back Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Seated_Cable_Row_Mid_Back_Focus.mp4"
  },
  {
    "id": 11,
    "muscle": "Back",
    "name": "Seated Cable Row Upper Back Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Seated_Cable_Row_Upper_Back_Focus.mp4"
  },
  {
    "id": 12,
    "muscle": "Back",
    "name": "Underhand Lat Pulldown Lower Lats Focus",
    "target": [
      "Back"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/back/Underhand_Lat_Pulldown_Lower_Lats_Focus.mp4"
  },
  {
    "id": 13,
    "muscle": "Bicep",
    "name": "EZ Bar Preacher Curl",
    "target": [
      "Bicep"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/bicep/EZ_Bar_Preacher_Curl.mp4"
  },
  {
    "id": 14,
    "muscle": "Bicep",
    "name": "Incline Dumbbell Curl",
    "target": [
      "Bicep"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/bicep/Incline_Dumbbell_Curl.mp4"
  },
  {
    "id": 15,
    "muscle": "Bicep",
    "name": "Seated Dumbbell Curl",
    "target": [
      "Bicep"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/bicep/Seated_Dumbbell_Curl.mp4"
  },
  {
    "id": 16,
    "muscle": "Bicep",
    "name": "Single Arm Dumbbell Preacher Curl",
    "target": [
      "Bicep"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/bicep/SingleArm_Dumbbell_Preacher_Curl.mp4"
  },
  {
    "id": 17,
    "muscle": "Bicep",
    "name": "Standing Dumbbell Curl",
    "target": [
      "Bicep"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/bicep/Standing_Dumbbell_Curl.mp4"
  },
  {
    "id": 18,
    "muscle": "Calves",
    "name": "Standing Calf Raise Entire",
    "target": [
      "Calves"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/calves/Standing_Calf_Raise_Entire.mp4"
  },
  {
    "id": 19,
    "muscle": "Calves",
    "name": "Standing Calf Raise Inner",
    "target": [
      "Calves"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/calves/Standing_Calf_Raise_Inner.mp4"
  },
  {
    "id": 20,
    "muscle": "Calves",
    "name": "Standing Calf Raise Outer",
    "target": [
      "Calves"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/calves/Standing_Calf_Raise_Outer.mp4"
  },
  {
    "id": 21,
    "muscle": "Chest",
    "name": "Flat Barbell Bench Press",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/Flat_Barbell_Bench_Press.mp4"
  },
  {
    "id": 22,
    "muscle": "Chest",
    "name": "Highto Low Cable Fly",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/HightoLow_Cable_Fly.mp4"
  },
  {
    "id": 23,
    "muscle": "Chest",
    "name": "Incline Barbell Bench Press",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/Incline_Barbell_Bench_Press.mp4"
  },
  {
    "id": 24,
    "muscle": "Chest",
    "name": "Lowto High Cable Fly",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/LowtoHigh_Cable_Fly.mp4"
  },
  {
    "id": 25,
    "muscle": "Chest",
    "name": "Pec Deck Machine Fly",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/Pec_Deck_Machine_Fly.mp4"
  },
  {
    "id": 26,
    "muscle": "Chest",
    "name": "Standing Cable Fly",
    "target": [
      "Chest"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/chest/Standing_Cable_Fly.mp4"
  },
  {
    "id": 27,
    "muscle": "Forearms",
    "name": "Dumbbell Radial Deviation",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Dumbbell_Radial_Deviation.mp4"
  },
  {
    "id": 28,
    "muscle": "Forearms",
    "name": "Dumbbell Ulnar Deviation",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Dumbbell_Ulnar_Deviation.mp4"
  },
  {
    "id": 29,
    "muscle": "Forearms",
    "name": "Reverse Grip Curls",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Reverse_Grip_Curls.mp4"
  },
  {
    "id": 30,
    "muscle": "Forearms",
    "name": "Reverse Wrist Curls",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Reverse_Wrist_Curls.mp4"
  },
  {
    "id": 31,
    "muscle": "Forearms",
    "name": "Wrist Curls",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Wrist_Curls.mp4"
  },
  {
    "id": 32,
    "muscle": "Forearms",
    "name": "Wrist Rotations",
    "target": [
      "Forearms"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/Forearms/Wrist_Rotations.mp4"
  },
  {
    "id": 33,
    "muscle": "Glutes",
    "name": "Kettlebell Glute Bridge",
    "target": [
      "Glutes"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/glutes/Kettlebell_Glute_Bridge.mp4"
  },
  {
    "id": 34,
    "muscle": "Glutes",
    "name": "Kettlebell RDL",
    "target": [
      "Glutes"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/glutes/Kettlebell_RDL.mp4"
  },
  {
    "id": 35,
    "muscle": "Glutes",
    "name": "Kettlebell Side Lying Kickback",
    "target": [
      "Glutes"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/glutes/Kettlebell_SideLying_Kickback.mp4"
  },
  {
    "id": 36,
    "muscle": "Glutes",
    "name": "Kettlebell Sumo Squat",
    "target": [
      "Glutes"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/glutes/Kettlebell_Sumo_Squat.mp4"
  },
  {
    "id": 37,
    "muscle": "Glutes",
    "name": "Leg Press Glute Focus",
    "target": [
      "Glutes"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/glutes/Leg_Press_Glute_Focus.mp4"
  },
  {
    "id": 38,
    "muscle": "Leg",
    "name": "Dumbbell Walking Lunge",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Dumbbell_Walking_Lunge.mp4"
  },
  {
    "id": 39,
    "muscle": "Leg",
    "name": "Leg Extension",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Leg_Extension.mp4"
  },
  {
    "id": 40,
    "muscle": "Leg",
    "name": "Leg Press Glute Focus",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Leg_Press_Glute_Focus.mp4"
  },
  {
    "id": 41,
    "muscle": "Leg",
    "name": "Leg Press Inner Thighs",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Leg_Press_Inner_Thighs.mp4"
  },
  {
    "id": 42,
    "muscle": "Leg",
    "name": "Leg Press Quad Focus",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Leg_Press_Quad_Focus.mp4"
  },
  {
    "id": 43,
    "muscle": "Leg",
    "name": "Lying Leg Curl Entire",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Lying_Leg_Curl_Entire.mp4"
  },
  {
    "id": 44,
    "muscle": "Leg",
    "name": "Lying Leg Curl Inner Focus",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Lying_Leg_Curl_Inner_Focus.mp4"
  },
  {
    "id": 45,
    "muscle": "Leg",
    "name": "Lying Leg Curl Outer Focus",
    "target": [
      "Leg"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/leg/Lying_Leg_Curl_Outer_Focus.mp4"
  },
  {
    "id": 46,
    "muscle": "Obliques",
    "name": "Plank",
    "target": [
      "Obliques"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/obliques/Plank.mp4"
  },
  {
    "id": 47,
    "muscle": "Shoulder",
    "name": "Machine Reverse Fly",
    "target": [
      "Shoulder"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/shoulder/Machine_Reverse_Fly.mp4"
  },
  {
    "id": 48,
    "muscle": "Shoulder",
    "name": "Machine Shoulder Press",
    "target": [
      "Shoulder"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/shoulder/Machine_Shoulder_Press.mp4"
  },
  {
    "id": 49,
    "muscle": "Shoulder",
    "name": "Seated Dumbbell Front Raise",
    "target": [
      "Shoulder"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/shoulder/Seated_Dumbbell_Front_Raise.mp4"
  },
  {
    "id": 50,
    "muscle": "Shoulder",
    "name": "Seated Dumbbell Lateral Raise",
    "target": [
      "Shoulder"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/shoulder/Seated_Dumbbell_Lateral_Raise.mp4"
  },
  {
    "id": 51,
    "muscle": "Traps",
    "name": "Behind the Back Barbell Shrug",
    "target": [
      "Traps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/traps/Behind_the_Back_Barbell_Shrug.mp4"
  },
  {
    "id": 52,
    "muscle": "Traps",
    "name": "Dumbbell Shrug",
    "target": [
      "Traps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/traps/Dumbbell_Shrug.mp4"
  },
  {
    "id": 53,
    "muscle": "Traps",
    "name": "Leaning Dumbbell Shrug",
    "target": [
      "Traps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/traps/Leaning_Dumbbell_Shrug.mp4"
  },
  {
    "id": 54,
    "muscle": "Traps",
    "name": "Overhead Barbell Shrug",
    "target": [
      "Traps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/traps/Overhead_Barbell_Shrug.mp4"
  },
  {
    "id": 55,
    "muscle": "Traps",
    "name": "Single Arm Behind the Back Dumbbell Shrug",
    "target": [
      "Traps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/traps/SingleArm_Behind_the_Back_Dumbbell_Shrug.mp4"
  },
  {
    "id": 56,
    "muscle": "Triceps",
    "name": "Cable Tricep Pushdown",
    "target": [
      "Triceps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/triceps/Cable_Tricep_Pushdown.mp4"
  },
  {
    "id": 57,
    "muscle": "Triceps",
    "name": "Dumbbell Tricep Kickback",
    "target": [
      "Triceps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/triceps/Dumbbell_Tricep_Kickback.mp4"
  },
  {
    "id": 58,
    "muscle": "Triceps",
    "name": "Lying Dumbbell Tricep Extension",
    "target": [
      "Triceps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/triceps/Lying_Dumbbell_Tricep_Extension.mp4"
  },
  {
    "id": 59,
    "muscle": "Triceps",
    "name": "Overhead Cable Tricep Extension",
    "target": [
      "Triceps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/triceps/Overhead_Cable_Tricep_Extension.mp4"
  },
  {
    "id": 60,
    "muscle": "Triceps",
    "name": "Standing Overhead Dumbbell Tricep Extension",
    "target": [
      "Triceps"
    ],
    "secondary": [],
    "equipment": "Custom",
    "difficulty": "Intermediate",
    "calories": 200,
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "/uploads/gym/triceps/Standing_Overhead_Dumbbell_Tricep_Extension.mp4"
  }
];

export const workoutPlans = [
  {
    "id": 1,
    "title": "Monday",
    "emoji": "💪",
    "goal": "Gain Muscle",
    "goalDescription": "Chest & Triceps",
    "targetMuscle": "Chest",
    "level": "Intermediate",
    "durationWeeks": 1,
    "durationMinutes": 60,
    "daysPerWeek": 6,
    "workoutTime": "50-60 min",
    "equipment": [
      "Barbell",
      "Machine",
      "Cable"
    ],
    "exercises": [
      "Flat Barbell Bench Press",
      "Incline Barbell Bench Press",
      "Pec Deck Machine Fly",
      "Standing Cable Fly",
      "Cable Tricep Pushdown",
      "Overhead Cable Tricep Extension",
      "Dumbbell Tricep Kickback"
    ],
    "rating": "4.6",
    "calories": 580,
    "completion": 85,
    "progressLabel": "Active",
    "description": "Push day: Build Chest Strength & Size",
    "tags": [
      "Push",
      "Upper Body",
      "Hypertrophy"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Chest & Triceps",
            "estimatedTime": 55,
            "exercises": [
              {
                "exerciseId": 1,
                "sets": 4,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 2,
                "sets": 3,
                "reps": 12,
                "rest": 75
              },
              {
                "exerciseId": 4,
                "sets": 3,
                "reps": 15,
                "rest": 60
              },
              {
                "exerciseId": 41,
                "sets": 3,
                "reps": 15,
                "rest": 60
              },
              {
                "exerciseId": 33,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 59,
                "sets": 3,
                "reps": 15,
                "rest": 45
              },
              {
                "exerciseId": 58,
                "sets": 2,
                "reps": 15,
                "rest": 45
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    "reviews": 11146,
    "members": 18577
  },
  {
    "id": 2,
    "title": "Tuesday",
    "emoji": "💪",
    "goal": "Gain Muscle",
    "goalDescription": "Back, Biceps & Traps",
    "targetMuscle": "Back",
    "level": "Intermediate",
    "durationWeeks": 1,
    "durationMinutes": 65,
    "daysPerWeek": 6,
    "workoutTime": "55-65 min",
    "equipment": [
      "Barbell",
      "Machine",
      "Dumbbell"
    ],
    "exercises": [
      "Lat Pulldown (Upper Lats Focus)",
      "Seated Cable Row (Lats Focus)",
      "Barbell Row",
      "Dumbbell Shrug",
      "Standing Dumbbell Curl",
      "Incline Dumbbell Curl",
      "EZ Bar Preacher Curl"
    ],
    "rating": "4.7",
    "calories": 610,
    "completion": 88,
    "progressLabel": "Active",
    "description": "Pull day: Back Width & Thickness",
    "tags": [
      "Pull",
      "Upper Body",
      "Hypertrophy"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Back, Biceps & Traps",
            "estimatedTime": 60,
            "exercises": [
              {
                "exerciseId": 22,
                "sets": 4,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 20,
                "sets": 3,
                "reps": 10,
                "rest": 75
              },
              {
                "exerciseId": 21,
                "sets": 3,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 26,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 28,
                "sets": 3,
                "reps": 10,
                "rest": 60
              },
              {
                "exerciseId": 29,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 32,
                "sets": 2,
                "reps": 12,
                "rest": 60
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop",
    "reviews": 10778,
    "members": 21377
  },
  {
    "id": 3,
    "title": "Wednesday",
    "emoji": "🦵",
    "goal": "Gain Muscle",
    "goalDescription": "Quads, Hamstrings, Glutes & Calves",
    "targetMuscle": "Legs",
    "level": "Intermediate",
    "durationWeeks": 1,
    "durationMinutes": 60,
    "daysPerWeek": 6,
    "workoutTime": "60 min",
    "equipment": [
      "Machine",
      "Dumbbell"
    ],
    "exercises": [
      "Leg Press (Quad Focus)",
      "Dumbbell Walking Lunge",
      "Leg Extension",
      "Lying Leg Curl (Entire)",
      "Standing Calf Raise (Entire)"
    ],
    "rating": "4.8",
    "calories": 680,
    "completion": 82,
    "progressLabel": "Active",
    "description": "Leg day: Complete lower body development",
    "tags": [
      "Legs",
      "Lower Body",
      "Hypertrophy"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Legs",
            "estimatedTime": 60,
            "exercises": [
              {
                "exerciseId": 8,
                "sets": 4,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 6,
                "sets": 3,
                "reps": 12,
                "rest": 75
              },
              {
                "exerciseId": 10,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 54,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 13,
                "sets": 4,
                "reps": 20,
                "rest": 45
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
    "reviews": 8691,
    "members": 18376
  },
  {
    "id": 4,
    "title": "Thursday",
    "emoji": "🔥",
    "goal": "Gain Muscle",
    "goalDescription": "Shoulders & Core",
    "targetMuscle": "Shoulders",
    "level": "Intermediate",
    "durationWeeks": 1,
    "durationMinutes": 55,
    "daysPerWeek": 6,
    "workoutTime": "50-55 min",
    "equipment": [
      "Machine",
      "Dumbbell",
      "Bodyweight"
    ],
    "exercises": [
      "Machine Shoulder Press",
      "Seated Dumbbell Lateral Raise",
      "Machine Reverse Fly",
      "Seated Dumbbell Front Raise",
      "Reverse Crunches (Lower Abs)",
      "Crunches (Upper Abs)",
      "Plank"
    ],
    "rating": "4.8",
    "calories": 520,
    "completion": 80,
    "progressLabel": "Active",
    "description": "Shoulder and core day: Bigger Shoulders & Strong Core",
    "tags": [
      "Shoulders",
      "Core",
      "Hypertrophy"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Shoulders & Core",
            "estimatedTime": 55,
            "exercises": [
              {
                "exerciseId": 14,
                "sets": 4,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 15,
                "sets": 4,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 16,
                "sets": 3,
                "reps": 15,
                "rest": 60
              },
              {
                "exerciseId": 17,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 34,
                "sets": 3,
                "reps": 15,
                "rest": 45
              },
              {
                "exerciseId": 35,
                "sets": 3,
                "reps": 20,
                "rest": 45
              },
              {
                "exerciseId": 55,
                "sets": 3,
                "reps": 60,
                "rest": 45
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    "reviews": 9100,
    "members": 29427
  },
  {
    "id": 5,
    "title": "Friday",
    "emoji": "💪",
    "goal": "Gain Muscle",
    "goalDescription": "Biceps, Triceps & Forearms",
    "targetMuscle": "Arms",
    "level": "Intermediate",
    "durationWeeks": 1,
    "durationMinutes": 60,
    "daysPerWeek": 6,
    "workoutTime": "55-60 min",
    "equipment": [
      "Dumbbell",
      "Cable",
      "Barbell"
    ],
    "exercises": [
      "Standing Dumbbell Curl",
      "EZ Bar Preacher Curl",
      "Seated Dumbbell Curl",
      "Cable Tricep Pushdown",
      "Overhead Cable Tricep Extension",
      "Lying Dumbbell Tricep Extension",
      "Wrist Curls",
      "Reverse Wrist Curls"
    ],
    "rating": "4.5",
    "calories": 480,
    "completion": 78,
    "progressLabel": "Active",
    "description": "Arm Specialization: Complete Arm Growth",
    "tags": [
      "Arms",
      "Isolation",
      "Specialization"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Arms",
            "estimatedTime": 60,
            "exercises": [
              {
                "exerciseId": 28,
                "sets": 3,
                "reps": 10,
                "rest": 60
              },
              {
                "exerciseId": 32,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 31,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 33,
                "sets": 3,
                "reps": 10,
                "rest": 60
              },
              {
                "exerciseId": 59,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 56,
                "sets": 3,
                "reps": 12,
                "rest": 60
              },
              {
                "exerciseId": 43,
                "sets": 3,
                "reps": 15,
                "rest": 45
              },
              {
                "exerciseId": 44,
                "sets": 3,
                "reps": 15,
                "rest": 45
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    "reviews": 14346,
    "members": 13077
  },
  {
    "id": 6,
    "title": "Saturday",
    "emoji": "🔥",
    "goal": "Strength",
    "goalDescription": "Full Body Strength",
    "targetMuscle": "Full Body",
    "level": "Advanced",
    "durationWeeks": 1,
    "durationMinutes": 70,
    "daysPerWeek": 6,
    "workoutTime": "60-70 min",
    "equipment": [
      "Barbell",
      "Machine",
      "Kettlebell"
    ],
    "exercises": [
      "Flat Barbell Bench Press",
      "Barbell Row",
      "Leg Press (Quad Focus)",
      "Machine Shoulder Press",
      "Kettlebell RDL",
      "Standing Calf Raise (Entire)",
      "Alternating V-Ups (Full Abs)"
    ],
    "rating": "4.6",
    "calories": 750,
    "completion": 84,
    "progressLabel": "Active",
    "description": "Full body power + conditioning: Strength & Conditioning",
    "tags": [
      "Full Body",
      "Power",
      "Conditioning"
    ],
    "weeks": [
      {
        "week": 1,
        "days": [
          {
            "day": 1,
            "title": "Full Body Strength",
            "estimatedTime": 65,
            "exercises": [
              {
                "exerciseId": 1,
                "sets": 3,
                "reps": 8,
                "rest": 90
              },
              {
                "exerciseId": 21,
                "sets": 3,
                "reps": 8,
                "rest": 90
              },
              {
                "exerciseId": 8,
                "sets": 3,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 14,
                "sets": 3,
                "reps": 10,
                "rest": 90
              },
              {
                "exerciseId": 48,
                "sets": 3,
                "reps": 12,
                "rest": 75
              },
              {
                "exerciseId": 13,
                "sets": 3,
                "reps": 15,
                "rest": 45
              },
              {
                "exerciseId": 36,
                "sets": 3,
                "reps": 15,
                "rest": 45
              }
            ]
          }
        ]
      }
    ],
    "coverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    "reviews": 13260,
    "members": 26160
  }
];

const FAVORITES_KEY = 'musclemap-favorites'

export const getFavorites = () => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
}

export const toggleFavorite = (exerciseId) => {
  if (typeof window === 'undefined') return false
  const current = getFavorites()
  const exists = current.includes(exerciseId)
  const updated = exists ? current.filter((id) => id !== exerciseId) : [...current, exerciseId]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return !exists // Returns true if added, false if removed
}

export const isFavorite = (exerciseId) => {
  return getFavorites().includes(exerciseId)
}
