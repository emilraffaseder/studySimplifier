import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

function AddLinkModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('default')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    onAdd({
      id: Date.now(),
      title,
      url,
      category
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#242424] p-8 rounded-lg w-96 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Link hinzufügen</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 rounded bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none text-gray-900 dark:text-white"
            >
              <option value="default">Allgemein</option>
              <option value="study">Studium</option>
              <option value="work">Arbeit</option>
              <option value="personal">Persönlich</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-[#67329E] text-white py-2 rounded-lg hover:bg-[#7b3db8] transition-colors"
            >
              Hinzufügen
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLinkModal 