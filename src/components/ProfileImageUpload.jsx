import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PhotoIcon, LinkIcon } from '@heroicons/react/24/outline';

function ProfileImageUpload() {
  const { user, updateProfileImage } = useAuth();
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageSourceType, setImageSourceType] = useState('file'); // 'file' oder 'url'
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prüfe Dateityp
    if (!file.type.match('image.*')) {
      setError('Bitte wähle ein Bild aus (JPG, PNG, etc.)');
      return;
    }

    // Prüfe Dateigröße (max. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Das Bild ist zu groß. Maximale Größe: 2MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setUploadSuccess(false);

    // Erzeuge eine Vorschau
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung basierend auf dem Quelltyp
    if (imageSourceType === 'file' && !selectedFile) {
      setError('Bitte wähle ein Bild aus');
      return;
    }
    
    if (imageSourceType === 'url' && !imageUrl.trim()) {
      setError('Bitte gib eine Bild-URL ein');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      if (imageSourceType === 'file') {
        // Konvertiere Datei zu base64 String
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result;
            
            // Überprüfen der Größe (grobe Berechnung, eine base64-Zeichenkette ist ca. 1.33x größer als die Originaldaten)
            const approximateSize = base64Data.length * 0.75; // Ungefähre Größe in Bytes
            if (approximateSize > 1.5 * 1024 * 1024) { // 1.5MB Limit
              setError('Das Bild ist zu groß. Bitte wähle ein kleineres Bild aus (max. 1.5MB)');
              setIsUploading(false);
              return;
            }
            
            const response = await updateProfileImage(base64Data);
            if (response && response.success) {
              setSelectedFile(null);
              setPreviewUrl('');
              setUploadSuccess(true);
            } else {
              throw new Error(response?.msg || 'Fehler beim Aktualisieren des Profilbildes');
            }
          } catch (err) {
            console.error('Fehler beim Aktualisieren des Profilbildes:', err);
            setError('Fehler beim Aktualisieren des Profilbildes: ' + (err.response?.data?.msg || err.message || 'Unbekannter Fehler'));
          } finally {
            setIsUploading(false);
          }
        };
      } else {
        // URL direkt verwenden
        try {
          if (!imageUrl.startsWith('http')) {
            setError('Die URL muss mit http:// oder https:// beginnen');
            setIsUploading(false);
            return;
          }
          
          const response = await updateProfileImage(imageUrl);
          if (response && response.success) {
            setImageUrl('');
            setUploadSuccess(true);
          } else {
            throw new Error(response?.msg || 'Fehler beim Aktualisieren des Profilbildes');
          }
        } catch (err) {
          console.error('Fehler beim Aktualisieren des Profilbildes:', err);
          setError('Fehler beim Aktualisieren des Profilbildes: ' + (err.response?.data?.msg || err.message || 'Unbekannter Fehler'));
        } finally {
          setIsUploading(false);
        }
      }
    } catch (err) {
      console.error('Fehler:', err);
      setError('Ein Fehler ist aufgetreten: ' + (err.message || 'Unbekannter Fehler'));
      setIsUploading(false);
    }
  };

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-[#343434]';
  const textClass = theme === 'light' ? 'text-gray-800' : 'text-white';
  const textMutedClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const textLightClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const buttonBgClass = theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600';
  const inputBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-[#1C1C1C]';
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-700';
  
  const activeButtonClass = 'bg-[#67329E] text-white';

  return (
    <div className={`${bgClass} p-6 rounded-lg shadow-md mb-6`}>
      <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Profilbild ändern</h2>
      
      <div className="flex items-center mb-6">
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="Aktuelles Profilbild" 
            className="w-24 h-24 rounded-full object-cover border-2"
            style={{ borderColor: 'var(--theme-color)' }}
          />
        ) : (
          <div className={`w-24 h-24 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'} flex items-center justify-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div className="ml-4">
          <p className={`text-sm ${textMutedClass} mb-1`}>
            {user?.profileImage ? 'Aktuelles Profilbild' : 'Kein Profilbild ausgewählt'}
          </p>
          {user?.profileImage && (
            <button
              onClick={() => updateProfileImage('')}
              className="text-xs text-red-400 hover:text-red-300"
              disabled={isUploading}
            >
              Profilbild entfernen
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs für Bildquelle */}
        <div className="flex gap-2 mb-4">
          <button 
            type="button"
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1 ${imageSourceType === 'file' ? activeButtonClass : buttonBgClass}`} 
            onClick={() => setImageSourceType('file')}
          >
            <PhotoIcon className="h-4 w-4" />
            Lokales Bild
          </button>
          <button 
            type="button"
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1 ${imageSourceType === 'url' ? activeButtonClass : buttonBgClass}`}
            onClick={() => setImageSourceType('url')}
          >
            <LinkIcon className="h-4 w-4" />
            Bild-URL
          </button>
        </div>

        {imageSourceType === 'file' ? (
          // Lokales Bild Upload
          <>
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Bildvorschau" 
                  className={`h-40 rounded-lg object-cover border-2 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'}`} 
                />
              </div>
            )}

            <div className="mb-4">
              <label className={`block text-sm font-medium ${textMutedClass} mb-2`}>
                Bild auswählen
              </label>
              
              <div className="flex items-center">
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
                  className={`px-4 py-2 ${buttonBgClass} ${textClass} rounded-md mr-3`}
                >
                  Durchsuchen...
                </button>
                
                <span className={`text-sm ${textLightClass}`}>
                  {selectedFile ? selectedFile.name : 'Keine Datei ausgewählt'}
                </span>
              </div>
              
              <p className={`mt-1 text-xs ${textLightClass}`}>
                JPG, PNG oder GIF (max. 2MB)
              </p>
            </div>
          </>
        ) : (
          // URL Eingabe
          <div className="mb-4">
            <label className={`block text-sm font-medium ${textMutedClass} mb-2`}>
              Bild-URL eingeben
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} focus:border-[#67329E] focus:outline-none ${textClass}`}
              placeholder="https://example.com/image.jpg"
            />
            
            <p className={`mt-1 text-xs ${textLightClass}`}>
              Gib die URL eines öffentlich zugänglichen Bildes ein
            </p>
            
            {imageUrl && (
              <div className="mt-3 rounded-lg overflow-hidden h-40 relative">
                <img 
                  src={imageUrl} 
                  alt="URL Vorschau" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Bild+nicht+verfügbar';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {uploadSuccess && <p className="text-green-400 text-sm mb-4">Profilbild erfolgreich aktualisiert!</p>}

        <button
          type="submit"
          disabled={isUploading || (imageSourceType === 'file' && !selectedFile) || (imageSourceType === 'url' && !imageUrl)}
          className="px-4 py-2 text-white rounded-md hover:opacity-90 disabled:bg-gray-600 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--theme-color)' }}
        >
          {isUploading ? 'Wird hochgeladen...' : 'Profilbild aktualisieren'}
        </button>
      </form>
    </div>
  );
}

export default ProfileImageUpload; 