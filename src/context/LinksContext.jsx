import { createContext, useContext, useState, useEffect } from 'react'
import { getLinks, createLink, deleteLink as apiDeleteLink } from '../services/api'
import { useAuth } from './AuthContext'

const LinksContext = createContext()

export function LinksProvider({ children }) {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isLoggedIn } = useAuth()

  // Fetch links from API when user is logged in
  useEffect(() => {
    const fetchLinks = async () => {
      if (!isLoggedIn) {
        setLinks([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getLinks()
        setLinks(data)
      } catch (err) {
        console.error('Error fetching links:', err)
        setError('Fehler beim Laden der Links')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [isLoggedIn])

  const addLink = async (newLink) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      const createdLink = await createLink(newLink)
      setLinks([...links, createdLink])
    } catch (err) {
      console.error('Error adding link:', err)
      setError('Fehler beim Hinzufügen des Links')
    } finally {
      setLoading(false)
    }
  }

  const deleteLink = async (id) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      await apiDeleteLink(id)
      setLinks(links.filter(link => link._id !== id))
    } catch (err) {
      console.error('Error deleting link:', err)
      setError('Fehler beim Löschen des Links')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinksContext.Provider value={{ links, addLink, deleteLink, loading, error }}>
      {children}
    </LinksContext.Provider>
  )
}

export const useLinks = () => useContext(LinksContext) 