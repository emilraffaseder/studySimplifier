import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function LoginModal({ onClose }) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwörter stimmen nicht überein')
          setIsLoading(false)
          return
        }

        await register(firstName, lastName, email, password, confirmPassword)
        onClose()
      } else {
        await login(email, password)
        onClose()
      }
    } catch (err) {
      console.error('Login-Fehler:', err)
      
      // Extrahiere die Fehlermeldung aus der API-Antwort
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg)
      } else {
        setError('Login-Fehler: ' + (err.message || 'Unbekannter Fehler'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#242424] p-8 rounded-lg w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isRegistering ? 'Registrieren' : 'Anmelden'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Vorname</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:outline-none"
                  style={{ borderColor: 'var(--theme-color)' }}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nachname</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:outline-none"
                  style={{ borderColor: 'var(--theme-color)' }}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:outline-none"
              style={{ borderColor: 'var(--theme-color)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:outline-none"
              style={{ borderColor: 'var(--theme-color)' }}
              required
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium mb-1">Passwort bestätigen</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:outline-none"
                style={{ borderColor: 'var(--theme-color)' }}
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded text-white transition-colors"
            style={{ backgroundColor: 'var(--theme-color)' }}
          >
            {isLoading 
              ? 'Wird geladen...' 
              : isRegistering 
                ? 'Registrieren' 
                : 'Anmelden'
            }
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError('')
            }}
            className="text-sm hover:underline"
            style={{ color: 'var(--theme-color)' }}
          >
            {isRegistering 
              ? 'Bereits registriert? Anmelden' 
              : 'Noch kein Konto? Registrieren'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal 