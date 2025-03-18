import { UserCircleIcon } from '@heroicons/react/24/outline'

function Account() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account</h1>
      
      <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-white dark:bg-[#1C1C1C] rounded-full">
            <UserCircleIcon className="h-16 w-16 text-gray-400" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
                placeholder="Max Mustermann"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
                placeholder="max@example.com"
              />
            </div>
            
            <button className="bg-[#67329E] px-4 py-2 rounded-lg hover:bg-[#7b3db8] transition-colors text-white">
              Speichern
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-[#242424] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Passwort ändern</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Aktuelles Passwort</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:border-[#67329E] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Neues Passwort</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:border-[#67329E] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Passwort bestätigen</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#1C1C1C] border border-gray-700 focus:border-[#67329E] focus:outline-none"
            />
          </div>
          
          <button className="bg-[#67329E] px-4 py-2 rounded-lg hover:bg-[#7b3db8] transition-colors">
            Passwort ändern
          </button>
        </div>
      </div>
    </div>
  )
}

export default Account 