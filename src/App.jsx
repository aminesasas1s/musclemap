import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AuthLayout from './components/AuthLayout.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'

// Auth pages — kept eager so login is instant
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPage from './pages/ForgotPage.jsx'

// Dashboard pages — lazy loaded so only the visited page is downloaded
const DashboardPage      = lazy(() => import('./pages/DashboardPage.jsx'))
const BodyMapPage        = lazy(() => import('./pages/BodyMapPage.jsx'))
const MusclePage         = lazy(() => import('./pages/MusclePage.jsx'))
const ExercisesPage      = lazy(() => import('./pages/ExercisesPage.jsx'))
const WorkoutPlansPage   = lazy(() => import('./pages/WorkoutPlansPage.jsx'))
const FavoritesPage      = lazy(() => import('./pages/FavoritesPage.jsx'))
const ProfilePage        = lazy(() => import('./pages/ProfilePage.jsx'))
const SettingsPage       = lazy(() => import('./pages/SettingsPage.jsx'))
const ExerciseDetailsPage = lazy(() => import('./pages/ExerciseDetailsPage.jsx'))
const ProgressPage       = lazy(() => import('./pages/ProgressPage.jsx'))
const AchievementsPage   = lazy(() => import('./pages/AchievementsPage.jsx'))
const NutritionPage      = lazy(() => import('./pages/NutritionPage.jsx'))

// Lightweight fallback shown during lazy page loads
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/body-map"       element={<BodyMapPage />} />
            <Route path="/muscle/:name"   element={<MusclePage />} />
            <Route path="/exercises"      element={<ExercisesPage />} />
            <Route path="/workout-plans"  element={<WorkoutPlansPage />} />
            <Route path="/progress"       element={<ProgressPage />} />
            <Route path="/favorites"      element={<FavoritesPage />} />
            <Route path="/achievements"   element={<AchievementsPage />} />
            <Route path="/nutrition"      element={<NutritionPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/settings"       element={<SettingsPage />} />
            <Route path="/exercise/:id"   element={<ExerciseDetailsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default App
