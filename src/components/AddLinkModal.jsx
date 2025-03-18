import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

function AddLinkModal({ onClose, onAdd }) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('default')
  const [image, setImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [imageSourceType, setImageSourceType] = useState('url') // 'url' oder 'local'
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) return

    // Verwende entweder die URL oder das lokale Bild als base64
    const finalImage = imageSourceType === 'url' ? image : previewUrl

    onAdd({
      title,
      url,
      category,
      image: finalImage
    })
    onClose()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Prüfe Dateityp
    if (!file.type.match('image.*')) {
      setError('Bitte wähle ein Bild aus (JPG, PNG, etc.)')
      return
    }

    // Prüfe Dateigröße (max. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Das Bild ist zu groß. Maximale Größe: 2MB')
      return
    }

    setSelectedFile(file)
    setError('')

    // Erzeuge eine Vorschau
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const buttonClass = theme === 'light' 
    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
    : 'bg-gray-700 text-white hover:bg-gray-600'
  
  const activeButtonClass = 'bg-[#67329E] text-white'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#242424] p-8 rounded-lg w-96 relative max-h-[90vh] overflow-y-auto">
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
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">Bild</label>
            
            {/* Tabs für Bildquelle */}
            <div className="flex gap-2 mb-2">
              <button 
                type="button"
                className={`px-3 py-1 text-sm rounded-md transition-colors ${imageSourceType === 'url' ? activeButtonClass : buttonClass}`} 
                onClick={() => setImageSourceType('url')}
              >
                Bild-URL
              </button>
              <button 
                type="button"
                className={`px-3 py-1 text-sm rounded-md transition-colors ${imageSourceType === 'local' ? activeButtonClass : buttonClass}`}
                onClick={() => setImageSourceType('local')}
              >
                Lokales Bild
              </button>
            </div>

            {imageSourceType === 'url' ? (
              // URL-Eingabe
              <div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 rounded bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none text-gray-900 dark:text-white"
                  placeholder="https://example.com/bild.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Füge eine URL zu einem Bild hinzu, um deinen Link visuell hervorzuheben
                </p>
                
                {/* Vorschau für URL-Bild */}
                {image && (
                  <div className="mt-3 rounded-lg overflow-hidden h-32 relative">
                    <img 
                      src={image} 
                      alt="Link Vorschau" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x150?text=Bild+nicht+verfügbar';
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              // Datei-Upload
              <div>
                <div className="flex items-center mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${buttonClass} transition-colors`}
                  >
                    <PhotoIcon className="h-5 w-5" />
                    Bild auswählen
                  </button>
                  
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    {selectedFile ? selectedFile.name : 'Kein Bild ausgewählt'}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG oder GIF (max. 2MB)
                </p>
                
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                
                {/* Vorschau für lokales Bild */}
                {previewUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden h-32 relative">
                    <img 
                      src={previewUrl} 
                      alt="Link Vorschau" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
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
              className="flex-1 text-white py-2 rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              Hinzufügen
            </button>
            <button 
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 rounded-lg transition-colors ${buttonClass}`}
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