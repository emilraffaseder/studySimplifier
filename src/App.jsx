import { BellIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeColorProvider } from './context/ThemeColorContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LinksProvider } from './context/LinksContext'
import { TodoProvider } from './context/TodoContext'
import { NotificationProvider } from './context/NotificationContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Account from './components/Account'
import Settings from './components/Settings'
import TasksPage from './components/TasksPage'
import FeedbackModal from './components/FeedbackModal'
import AddLinkButton from './components/AddLinkButton'
import LoginModal from './components/LoginModal'

function PageTitle() {
  const location = useLocation()
  const [title, setTitle] = useState('Dashboard')

  useEffect(() => {
    if (location.pathname === '/') {
      setTitle('Dashboard')
    } else if (location.pathname === '/login') {
      setTitle('Login')
    } else if (location.pathname === '/tasks') {
      setTitle('Aufgaben')
    } else if (location.pathname === '/account') {
      setTitle('Account')
    } else if (location.pathname === '/settings') {
      setTitle('Einstellungen')
    }
  }, [location.pathname])

  return (
    <h1 className="text-2xl font-bold">{title}</h1>
  )
}

function LoginPage() {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <LoginModal onClose={handleClose} />
    </div>
  )
}

function AppContent() {
  const [showFeedback, setShowFeedback] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isLoggedIn, logout } = useAuth()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white transition-colors">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <div className="flex justify-between items-center mb-8 md:mt-0 mt-14">
          <PageTitle />
          <div className="flex items-center gap-4">
            <BellIcon className="h-6 w-6" />
            {isLoggedIn ? (
              <button 
                onClick={logout}
                className="px-6 py-2 rounded-lg hover:opacity-90 text-white transition-colors"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 rounded-lg hover:opacity-90 text-white transition-colors"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                Login
              </button>
            )}
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/tasks"
            element={isLoggedIn ? <TasksPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/account"
            element={isLoggedIn ? <Account /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>

      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
      {showLoginModal && !window.location.pathname.includes('login') && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {isLoggedIn && <AddLinkButton />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ThemeColorProvider>
        <Router>
          <AuthProvider>
            <NotificationProvider>
              <TodoProvider>
                <LinksProvider>
                  <AppContent />
                </LinksProvider>
              </TodoProvider>
            </NotificationProvider>
          </AuthProvider>
        </Router>
      </ThemeColorProvider>
    </ThemeProvider>
  )
}

export default App 