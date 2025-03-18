import { createContext, useContext, useState, useEffect } from 'react'

const ThemeColorContext = createContext()

export function ThemeColorProvider({ children }) {
  const [themeColor, setThemeColor] = useState('#67329E') // Default: Violet

  // Load saved theme color from localStorage on initial render
  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor')
    if (savedColor) {
      setThemeColor(savedColor)
      applyThemeColor(savedColor)
    }
  }, [])

  const changeThemeColor = (color) => {
    setThemeColor(color)
    localStorage.setItem('themeColor', color)
    applyThemeColor(color)
  }

  const applyThemeColor = (color) => {
    // Update CSS variables for the theme color
    document.documentElement.style.setProperty('--theme-color', color)
    
    // Create variations of the theme color for different opacities
    document.documentElement.style.setProperty('--theme-color-light', `${color}22`)
    document.documentElement.style.setProperty('--theme-color-medium', `${color}66`)
    document.documentElement.style.setProperty('--theme-color-dark', `${color}99`)
  }

  return (
    <ThemeColorContext.Provider value={{ themeColor, changeThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  )
}

export const useThemeColor = () => useContext(ThemeColorContext) 