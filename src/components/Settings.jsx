import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useThemeColor } from '../context/ThemeColorContext'
import { useNotifications } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import { 
  BellAlertIcon, 
  EnvelopeIcon, 
  ComputerDesktopIcon, 
  CheckIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Spracheinstellungen
const languages = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' }
]

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { themeColor, changeThemeColor } = useThemeColor()
  const { 
    settings, 
    permissionStatus, 
    loading, 
    error,
    updateSettings,
    requestDesktopPermission
  } = useNotifications()
  const { user, deleteAccount } = useAuth()
  
  const [customColor, setCustomColor] = useState(themeColor)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [language, setLanguage] = useState('de')
  
  // Account löschen Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Predefined color options
  const colorOptions = [
    { name: 'Violet', color: '#67329E' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Teal', color: '#14b8a6' },
    { name: 'Indigo', color: '#6366f1' }
  ]

  // Local notification settings to track changes
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [emailDueTasks, setEmailDueTasks] = useState(true)
  const [emailNewFeatures, setEmailNewFeatures] = useState(true)
  const [desktopEnabled, setDesktopEnabled] = useState(false)
  const [desktopDueTasks, setDesktopDueTasks] = useState(true)

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings && !loading) {
      setEmailEnabled(settings.email?.enabled || false)
      setEmailDueTasks(settings.email?.dueTasks || true)
      setEmailNewFeatures(settings.email?.newFeatures || true)
      setDesktopEnabled(settings.desktop?.enabled || false)
      setDesktopDueTasks(settings.desktop?.dueTasks || true)
    }
  }, [settings, loading])

  // Sprache aus dem localStorage laden
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleColorChange = (color) => {
    setCustomColor(color)
    changeThemeColor(color)
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleSaveNotificationSettings = async () => {
    setSaved(false)
    setSaveError(null)
    
    // If enabling desktop notifications, request permission
    if (desktopEnabled && permissionStatus !== 'granted') {
      const granted = await requestDesktopPermission()
      if (!granted) {
        setSaveError('Desktop-Benachrichtigungserlaubnis wurde abgelehnt.')
        return
      }
    }

    const newSettings = {
      email: {
        enabled: emailEnabled,
        dueTasks: emailDueTasks,
        newFeatures: emailNewFeatures
      },
      desktop: {
        enabled: desktopEnabled,
        dueTasks: desktopDueTasks
      }
    }

    const result = await updateSettings(newSettings)
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setSaveError('Fehler beim Speichern der Einstellungen.')
    }
  }
  
  const handleDeleteAccountClick = () => {
    setDeleteDialogOpen(true)
    setDeletePassword('')
    setDeleteError('')
  }
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }
  
  const handleDeleteConfirm = async () => {
    if (!deletePassword) {
      setDeleteError('Bitte gib dein Passwort ein.')
      return
    }
    
    try {
      setIsDeleting(true)
      await deleteAccount(deletePassword)
      // No need to close dialog or do anything else as successful deletion will log the user out
    } catch (error) {
      setDeleteError(error.response?.data?.msg || 'Fehler beim Löschen des Accounts.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Einstellungen</h1>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Erscheinungsbild</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select 
              value={theme}
              onChange={(e) => toggleTheme()}
              className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Themefarbe</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => handleColorChange(option.color)}
                  className={`w-full h-10 rounded-md flex items-center justify-center transition-all ${
                    customColor === option.color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.name}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-16 border-0 p-0 bg-transparent"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
                placeholder="#67329E"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sprache</label>
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <BellAlertIcon className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">Benachrichtigungen</h2>
        </div>
        
        {loading ? (
          <div className="py-4 text-center">Lade Einstellungen...</div>
        ) : (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
              <div className="flex items-center mb-3">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Email-Benachrichtigungen</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <span>Email-Benachrichtigungen aktivieren</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={emailEnabled}
                      onChange={(e) => setEmailEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
                  </label>
                </div>
                
                {emailEnabled && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span>Fällige Aufgaben</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={emailDueTasks}
                          onChange={(e) => setEmailDueTasks(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between pl-4">
                      <span>Neue Funktionen</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={emailNewFeatures}
                          onChange={(e) => setEmailNewFeatures(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Desktop Notifications */}
            <div>
              <div className="flex items-center mb-3">
                <ComputerDesktopIcon className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Desktop-Benachrichtigungen</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <span>Desktop-Benachrichtigungen aktivieren</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={desktopEnabled}
                      onChange={(e) => setDesktopEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
                  </label>
                </div>
                
                {desktopEnabled && (
                  <>
                    <div className="flex items-center justify-between pl-4">
                      <span>Fällige Aufgaben</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={desktopDueTasks}
                          onChange={(e) => setDesktopDueTasks(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
                      </label>
                    </div>
                    
                    {permissionStatus === 'denied' && (
                      <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                        Benachrichtigungen wurden für diese Website blockiert. Bitte ändern Sie die Einstellungen in Ihrem Browser.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button 
                onClick={handleSaveNotificationSettings}
                className="px-6 py-2 rounded-lg text-white transition-colors flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-color)' }}
                disabled={loading}
              >
                Benachrichtigungseinstellungen speichern
              </button>
              
              {saved && (
                <div className="mt-3 flex items-center text-green-600 dark:text-green-400">
                  <CheckIcon className="h-5 w-5 mr-1" />
                  <span>Einstellungen gespeichert</span>
                </div>
              )}
              
              {saveError && (
                <div className="mt-3 flex items-center text-red-600 dark:text-red-400">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  <span>{saveError}</span>
                </div>
              )}
              
              {error && (
                <div className="mt-3 flex items-center text-red-600 dark:text-red-400">
                  <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <TrashIcon className="h-6 w-6 mr-2 text-red-500" />
          <h2 className="text-xl font-bold text-red-500">Gefahrenzone</h2>
        </div>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Wenn du deinen Account löschst, werden alle deine Daten permanent gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <button 
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-white flex items-center"
          onClick={handleDeleteAccountClick}
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Account löschen
        </button>
        
        {/* Account löschen Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleCloseDeleteDialog}
          PaperProps={{
            style: {
              backgroundColor: theme === 'dark' ? '#1C1C1C' : 'white',
              color: theme === 'dark' ? 'white' : 'black',
              padding: '10px'
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrashIcon className="h-6 w-6 text-red-500" />
            Account löschen
          </DialogTitle>
          <DialogContent>
            {deleteError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setDeleteError('')}
              >
                {deleteError}
              </Alert>
            )}
            <p className="mb-4">
              Bitte bestätige die Löschung deines Accounts, indem du dein Passwort eingibst.
              <br /><br />
              <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden!
            </p>
            <TextField
              autoFocus
              margin="dense"
              label="Passwort"
              type="password"
              fullWidth
              variant="outlined"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input': {
                  color: theme === 'dark' ? 'white' : 'black',
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDeleteDialog} 
              color="primary"
              startIcon={<XCircleIcon className="h-5 w-5" />}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              variant="contained"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} /> : <TrashIcon className="h-5 w-5" />}
            >
              {isDeleting ? 'Wird gelöscht...' : 'Account löschen'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default Settings 