import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate          = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const initials = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Prognos</span>
          <span className="text-xs text-gray-400 font-medium hidden sm:block">
            AI Cancer Risk Predictor
          </span>
        </Link>

        {/* Nav + auth */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex gap-6">
            <NavLink to="/" end
              className={({ isActive }) => isActive
                ? 'text-blue-600 font-semibold text-sm'
                : 'text-gray-600 hover:text-gray-900 text-sm transition-colors'
              }
            >
              Home
            </NavLink>
            <NavLink to="/assess"
              className={({ isActive }) => isActive
                ? 'text-blue-600 font-semibold text-sm'
                : 'text-gray-600 hover:text-gray-900 text-sm transition-colors'
              }
            >
              Assess Risk
            </NavLink>
          </nav>

          {user ? (
            /* Logged-in: avatar dropdown */
            <div className="relative">
              <button
                onClick={() => setMenuOpen(p => !p)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold select-none">
                  {initials}
                </span>
                <span className="hidden sm:block max-w-[140px] truncate text-xs text-gray-500">
                  {user.email}
                </span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Signed in</p>
                    </div>
                    <Link to="/assess" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Start Assessment
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged-out: sign in / sign up */
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-1.5">
                Sign in
              </Link>
              <Link to="/signup"
                className="text-sm bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
