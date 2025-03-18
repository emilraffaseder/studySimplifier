import { HomeIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'

function Sidebar({ isLoggedIn }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-gray-50 dark:bg-[#1C1C1C] p-6 border-r border-gray-200 dark:border-gray-800">
      <div className="mb-8">
        <img 
          src="/icons/LogoStudySimplifier.png" 
          alt="Study Simplifier" 
          className="h-8 object-contain"
        />
      </div>
      
      <nav className="space-y-2">
        <Link 
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
            location.pathname === '/' 
              ? 'bg-[#67329E] text-white' 
              : 'text-gray-400 hover:bg-gray-800'
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        {isLoggedIn && (
          <>
            <Link 
              to="/account"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                location.pathname === '/account'
                  ? 'bg-[#67329E] text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              <span>Account</span>
            </Link>
            
            <Link 
              to="/settings"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                location.pathname === '/settings'
                  ? 'bg-[#67329E] text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Einstellungen</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar 