import { createContext, useContext, useState, useEffect } from 'react'
import { getTodos, createTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from '../services/api'
import { useAuth } from './AuthContext'

const TodoContext = createContext()

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([
    { id: 'default', name: 'Allgemein', color: '#67329E' },
    { id: 'study', name: 'Studium', color: '#3b82f6' },
    { id: 'work', name: 'Arbeit', color: '#22c55e' },
    { id: 'personal', name: 'Persönlich', color: '#f97316' }
  ])
  const { isLoggedIn } = useAuth()

  // Fetch todos from API when user is logged in
  useEffect(() => {
    const fetchTodos = async () => {
      if (!isLoggedIn) {
        setTodos([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getTodos()
        setTodos(data)
      } catch (err) {
        console.error('Error fetching todos:', err)
        setError('Fehler beim Laden der Aufgaben')
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [isLoggedIn])

  const addTodo = async (newTodo) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      // Suche die Kategorie und setze die Farbe, wenn keine Farbe angegeben ist
      if (newTodo.category && !newTodo.color) {
        const category = categories.find(cat => cat.id === newTodo.category)
        if (category) {
          newTodo.color = category.color
        }
      }

      const createdTodo = await createTodo(newTodo)
      setTodos([...todos, createdTodo])
    } catch (err) {
      console.error('Error adding todo:', err)
      setError('Fehler beim Hinzufügen der Aufgabe')
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      const todo = todos.find(todo => todo._id === id)
      if (!todo) return

      const updatedTodo = await apiUpdateTodo(id, { 
        completed: !todo.completed 
      })
      
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ))
    } catch (err) {
      console.error('Error updating todo:', err)
      setError('Fehler beim Aktualisieren der Aufgabe')
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id, updatedFields) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      
      // Wenn eine Kategorie ohne Farbe angegeben ist, setze die Farbe automatisch
      if (updatedFields.category && !updatedFields.color) {
        const category = categories.find(cat => cat.id === updatedFields.category)
        if (category) {
          updatedFields.color = category.color
        }
      }
      
      const updatedTodo = await apiUpdateTodo(id, updatedFields)
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ))
    } catch (err) {
      console.error('Error updating todo:', err)
      setError('Fehler beim Aktualisieren der Aufgabe')
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id) => {
    if (!isLoggedIn) return

    try {
      setLoading(true)
      await apiDeleteTodo(id)
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (err) {
      console.error('Error deleting todo:', err)
      setError('Fehler beim Löschen der Aufgabe')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = (newCategory) => {
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id, updatedData) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, ...updatedData } : category
    ))
  }

  const deleteCategory = (id) => {
    // Prüfe, ob es sich um eine Standard-Kategorie handelt
    const isDefaultCategory = ['default', 'study', 'work', 'personal'].includes(id)
    if (isDefaultCategory) {
      setError('Standard-Kategorien können nicht gelöscht werden')
      return false
    }
    
    setCategories(categories.filter(category => category.id !== id))
    return true
  }

  return (
    <TodoContext.Provider value={{ 
      todos, 
      categories,
      addTodo, 
      toggleTodo,
      updateTodo, 
      deleteTodo,
      addCategory,
      updateCategory,
      deleteCategory, 
      loading, 
      error 
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodos = () => useContext(TodoContext) 