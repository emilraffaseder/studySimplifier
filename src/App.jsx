import { BellIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Account from './components/Account'
import Settings from './components/Settings'
import FeedbackModal from './components/FeedbackModal'
import AddLinkButton from './components/AddLinkButton'
import LoginModal from './components/LoginModal'
import { LinksProvider } from './context/LinksContext'

function App() {
  const [showFeedback, setShowFeedback] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = (email, password) => {
    // Hier würde normalerweise die API-Authentifizierung stattfinden
    console.log('Login attempt:', email)
    setIsLoggedIn(true)
    setShowLoginModal(false)
  }

  return (
    <ThemeProvider>
      <LinksProvider>
        <Router>
          <div className="flex min-h-screen bg-[#1C1C1C] dark:bg-[#1C1C1C] bg-white text-gray-900 dark:text-white transition-colors">
            <Sidebar isLoggedIn={isLoggedIn} />
            <main className="flex-1 p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                  <BellIcon className="h-6 w-6" />
                  {isLoggedIn ? (
                    <button 
                      onClick={() => setIsLoggedIn(false)}
                      className="bg-[#67329E] px-6 py-2 rounded-lg hover:bg-[#7b3db8]"
                    >
                      Logout
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowLoginModal(true)}
                      className="bg-[#67329E] px-6 py-2 rounded-lg hover:bg-[#7b3db8]"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route 
                  path="/account" 
                  element={isLoggedIn ? <Account /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/settings" 
                  element={isLoggedIn ? <Settings /> : <Navigate to="/" />} 
                />
              </Routes>
            </main>

            {showFeedback && (
              <FeedbackModal onClose={() => setShowFeedback(false)} />
            )}
            {showLoginModal && (
              <LoginModal 
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
              />
            )}
            <AddLinkButton />
          </div>
        </Router>
      </LinksProvider>
    </ThemeProvider>
  )
}

export default App 