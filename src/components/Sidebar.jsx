import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserIcon, Cog6ToothIcon, CalendarIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

function Sidebar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { isLoggedIn, user } = useAuth()
  const { theme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState('Dashboard')

  // Set page title based on current route
  useEffect(() => {
    if (location.pathname === '/') {
      setPageTitle('Dashboard')
    } else if (location.pathname === '/tasks') {
      setPageTitle('Aufgaben')
    } else if (location.pathname === '/account') {
      setPageTitle('Account')
    } else if (location.pathname === '/settings') {
      setPageTitle('Einstellungen')
    }
  }, [location.pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const menuItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5 mr-3" />
    },
    ...(isLoggedIn ? [
      {
        path: '/tasks',
        name: 'Aufgaben',
        icon: <CalendarIcon className="h-5 w-5 mr-3" />
      },
      {
        path: '/account',
        name: 'Account',
        icon: <UserIcon className="h-5 w-5 mr-3" />
      },
      {
        path: '/settings',
        name: 'Einstellungen',
        icon: <Cog6ToothIcon className="h-5 w-5 mr-3" />
      }
    ] : [])
  ]

  const sidebarBgClass = theme === 'light' ? 'bg-gray-100' : 'bg-[#242424]'
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white'
  const textMutedClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400'
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-700'
  const hoverBgClass = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#333333]'
  
  // Logo inversion for light mode
  const logoStyle = theme === 'light' ? { filter: 'invert(1)' } : {}

  return (
    <>
      {/* Mobile header */}
      <div className={`md:hidden flex items-center justify-between ${sidebarBgClass} p-4 border-b ${borderClass}`}>
        <div className="flex items-center">
          <img 
            src="/icons/LogoStudySimplifier.png"
            alt="Study Simplifier Logo"
            className="h-8 mr-3"
            style={logoStyle}
          />
          <div>
            <p className={`text-sm ${textMutedClass}`}>
              {pageTitle}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${textMutedClass} hover:${textClass}`}
        >
          {isMobileMenuOpen ? 
            <XMarkIcon className="h-6 w-6" /> : 
            <Bars3Icon className="h-6 w-6" />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${sidebarBgClass} p-4 border-b ${borderClass}`}>
          <div className="flex flex-col items-center mb-6">
            {isLoggedIn && (
              <>
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-2"
                    style={{ borderColor: 'var(--theme-color)' }}
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'} flex items-center justify-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    <UserIcon className="w-12 h-12" />
                  </div>
                )}
                {user && (
                  <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {user.firstName} {user.lastName}
                  </p>
                )}
              </>
            )}
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center py-3 px-4 rounded-lg
                  ${isActive(item.path) ? 'text-white' : `${textMutedClass} ${hoverBgClass}`}
                `}
                style={{ backgroundColor: isActive(item.path) ? 'var(--theme-color)' : '' }}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden md:flex w-64 ${sidebarBgClass} h-screen flex-col`}>
        <div className="p-6 flex flex-col items-center">
          <img 
            src="/icons/LogoStudySimplifier.png"
            alt="Study Simplifier Logo"
            className="h-16 mb-2"
            style={logoStyle}
          />
          <p className={`text-sm ${textMutedClass} mt-1 mb-4`}>
            Learn Simple.
          </p>
          
          {isLoggedIn && (
            <div className="flex flex-col items-center mt-2 mb-4">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2"
                  style={{ borderColor: 'var(--theme-color)' }}
                />
              ) : (
                <div className={`w-20 h-20 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'} flex items-center justify-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              {user && (
                <p className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {user.firstName} {user.lastName}
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="mt-4 px-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center py-3 px-4 rounded-lg mb-2
                ${isActive(item.path) ? 'text-white' : `${textMutedClass} ${hoverBgClass}`}
              `}
              style={{ backgroundColor: isActive(item.path) ? 'var(--theme-color)' : '' }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t ${borderClass} mt-auto`}>
          <div className={`text-xs text-center ${textMutedClass}`}>
            &copy; 2025 Study Simplifier
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 