import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider }    from './context/AuthContext'
import ProtectedRoute      from './components/auth/ProtectedRoute'
import Header              from './components/common/Header'
import Footer              from './components/common/Footer'
import HomePage            from './pages/HomePage'
import LoginPage           from './pages/LoginPage'
import SignupPage          from './pages/SignupPage'
import ForgotPasswordPage  from './pages/ForgotPasswordPage'
import ResetPasswordPage   from './pages/ResetPasswordPage'
import AssessmentPage      from './pages/AssessmentPage'
import ResultsPage         from './pages/ResultsPage'
import PredictPage         from './pages/PredictPage'
import ChatBot             from './components/common/ChatBot'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"                element={<HomePage />} />
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/signup"          element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password"  element={<ResetPasswordPage />} />
              <Route path="/predict"         element={<PredictPage />} />

              {/* Protected — must be logged in */}
              <Route path="/assess"  element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ChatBot />
      </Router>
    </AuthProvider>
  )
}
