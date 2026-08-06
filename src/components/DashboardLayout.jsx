import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Activity, Dumbbell, CalendarClock, Heart, UserCircle2, Settings, LogOut, BarChart3, Award, Leaf, Sparkles, Menu, X } from 'lucide-react'
import { CURRENT_USER_KEY } from '../data'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/body-map', label: 'Body Map', icon: Activity },
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/workout-plans', label: 'Workout Plans', icon: CalendarClock },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/achievements', label: 'Achievements', icon: Award },
  { to: '/nutrition', label: 'Nutrition', icon: Leaf },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('musclemap-role')
    localStorage.removeItem(CURRENT_USER_KEY)
    navigate('/login')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white">
      <div className="flex h-full flex-col lg:flex-row">

        {/* Mobile top bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-4 py-3 backdrop-blur-lg lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/20 text-sm font-bold text-brand neon-ring">M</div>
            <p className="text-base font-semibold">MuscleMap</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-300 transition hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile slide-out menu overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl lg:hidden"
              >
                <div className="p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand neon-ring">M</div>
                      <div>
                        <p className="text-base font-semibold">MuscleMap</p>
                        <p className="text-[11px] text-slate-400">Premium fitness control</p>
                      </div>
                    </div>
                    <button onClick={closeMobileMenu} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800">
                      <X size={18} />
                    </button>
                  </div>

                  <nav className="grid gap-1.5">
                    {navItems.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={label}
                        to={to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                            isActive ? 'bg-brand/20 text-white neon-ring' : 'text-slate-300 hover:bg-slate-800/70'
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </NavLink>
                    ))}

                    <button
                      type="button"
                      onClick={() => { closeMobileMenu(); handleLogout() }}
                      className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800/70"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside className="glass sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto border-r border-slate-800/80 lg:block">
          <div className="p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/20 text-brand neon-ring">M</div>
              <div>
                <p className="text-lg font-semibold">MuscleMap</p>
                <p className="text-xs text-slate-400">Premium fitness control</p>
              </div>
            </div>

            <nav className="grid gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={label}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive ? 'bg-brand/20 text-white neon-ring' : 'text-slate-300 hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800/70"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
