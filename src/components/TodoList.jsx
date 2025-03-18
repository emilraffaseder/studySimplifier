import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

function TodoList() {
  const [todos, setTodos] = useState(() => {
    // Lade gespeicherte Todos beim ersten Render
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : [
      {
        id: 1,
        title: 'PRE-Abgabe: Lastenheft',
        dueDate: '2024-11-11'
      }
    ]
  })
  const [newTodo, setNewTodo] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [dueDate, setDueDate] = useState('')

  // Speichere Todos wenn sie sich ändern
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: newTodo,
        dueDate: dueDate
      }
    ])
    setNewTodo('')
    setDueDate('')
    setShowInput(false)
  }

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-gray-100 dark:bg-[#67329E] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">To-Do-Liste</h2>
      
      <div className="space-y-4">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-start justify-between group">
            <div>
              <p className="font-medium">{todo.title}</p>
              {todo.dueDate && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Fällig am: {formatDate(todo.dueDate)}
                </p>
              )}
            </div>
            <button 
              onClick={() => handleDelete(todo.id)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}

        {showInput ? (
          <form onSubmit={handleAddTodo} className="space-y-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Todo-Titel eingeben..."
              className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
              autoFocus
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
            />
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-[#67329E] dark:bg-white dark:text-[#67329E] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-white"
              >
                Hinzufügen
              </button>
              <button 
                type="button"
                onClick={() => setShowInput(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-90 transition-opacity"
              >
                Abbrechen
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Füge ein To-Do hinzu...</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default TodoList 