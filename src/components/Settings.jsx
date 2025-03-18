import { useTheme } from '../context/ThemeContext'

function Settings() {
  const { theme, toggleTheme } = useTheme()

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
            <label className="block text-sm font-medium mb-2">Sprache</label>
            <select className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Benachrichtigungen</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email-Benachrichtigungen</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Desktop-Benachrichtigungen</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#67329E]"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-red-500">Gefahrenzone</h2>
        <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-white">
          Account löschen
        </button>
      </div>
    </div>
  )
}

export default Settings 