import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#242424] p-8 rounded-lg w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:border-[#67329E] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:border-[#67329E] focus:outline-none"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#67329E] text-white py-2 rounded-lg hover:bg-[#7b3db8] transition-colors"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal 