import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthLayout from './components/AuthLayout.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPage from './pages/ForgotPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import BodyMapPage from './pages/BodyMapPage.jsx'
import MusclePage from './pages/MusclePage.jsx'
import ExercisesPage from './pages/ExercisesPage.jsx'
import WorkoutPlansPage from './pages/WorkoutPlansPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ExerciseDetailsPage from './pages/ExerciseDetailsPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import NutritionPage from './pages/NutritionPage.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<AuthLayout />}> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/body-map" element={<BodyMapPage />} />
          <Route path="/muscle/:name" element={<MusclePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/workout-plans" element={<WorkoutPlansPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
