import { createContext, useContext, useState, useEffect } from 'react'

const LinksContext = createContext()

export function LinksProvider({ children }) {
  const [links, setLinks] = useState(() => {
    const savedLinks = localStorage.getItem('links')
    return savedLinks ? JSON.parse(savedLinks) : []
  })

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links))
  }, [links])

  const addLink = (newLink) => {
    setLinks([...links, newLink])
  }

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id))
  }

  return (
    <LinksContext.Provider value={{ links, addLink, deleteLink }}>
      {children}
    </LinksContext.Provider>
  )
}

export const useLinks = () => useContext(LinksContext) 