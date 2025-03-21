import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useTodos } from '../context/TodoContext'

function TodoList() {
  const { todos, categories, addTodo, deleteTodo, toggleTodo, loading, error } = useTodos()
  const [newTodo, setNewTodo] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('default')
  const [priority, setPriority] = useState('medium')

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    // Suche die ausgewählte Kategorie
    const selectedCategory = categories.find(cat => cat.id === category)

    addTodo({
      title: newTodo,
      dueDate: dueDate || undefined,
      category: category,
      color: selectedCategory?.color,
      priority: priority
    })
    setNewTodo('')
    setDueDate('')
    setCategory('default')
    setPriority('medium')
    setShowInput(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Finde die Kategorie anhand der ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Allgemein'
  }

  // Farbe und Text für die Priorität
  const getPriorityDisplay = (priority) => {
    switch(priority) {
      case 'high':
        return { color: '#ef4444', text: 'Hoch' };
      case 'medium':
        return { color: '#f97316', text: 'Mittel' };
      case 'low':
        return { color: '#22c55e', text: 'Niedrig' };
      default:
        return { color: '#f97316', text: 'Mittel' };
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">To-Do-Liste</h2>
      
      {error && (
        <div className="bg-red-600 bg-opacity-20 text-red-100 p-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-2 text-gray-500 dark:text-gray-300">Lädt...</div>
        ) : todos.length > 0 ? (
          todos.map(todo => (
            <div 
              key={todo._id} 
              className="flex items-start justify-between group p-3 rounded-lg transition-all"
              style={{ 
                backgroundColor: todo.completed ? '#33333333' : `${todo.color}22`,
                borderLeft: `4px solid ${todo.color || '#67329E'}`
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                <button 
                  onClick={() => toggleTodo(todo._id)} 
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border ${todo.completed ? 'bg-gray-500 border-gray-600' : 'border-gray-400'} flex items-center justify-center`}
                  style={{ borderColor: todo.color || '#67329E' }}
                >
                  {todo.completed && <CheckIcon className="h-4 w-4 text-white" />}
                </button>
                
                <div className="flex-1">
                  <p className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {todo.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {todo.category && (
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${todo.color || '#67329E'}22`,
                          color: todo.color || '#67329E'
                        }}
                      >
                        {getCategoryName(todo.category)}
                      </span>
                    )}
                    
                    {todo.priority && (
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${getPriorityDisplay(todo.priority).color}22`,
                          color: getPriorityDisplay(todo.priority).color
                        }}
                      >
                        {getPriorityDisplay(todo.priority).text}
                      </span>
                    )}
                    
                    {todo.dueDate && (
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {formatDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteTodo(todo._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-300">
            Keine Aufgaben vorhanden
          </div>
        )}

        {showInput ? (
          <form onSubmit={handleAddTodo} className="space-y-3 p-4 bg-white dark:bg-[#333333] rounded-lg">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Todo-Titel eingeben..."
              className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
              autoFocus
            />
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Fälligkeitsdatum (optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Priorität</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[#67329E] focus:outline-none"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="submit"
                className="bg-[#67329E] dark:bg-[#67329E] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-white"
              >
                Hinzufügen
              </button>
              <button 
                type="button"
                onClick={() => setShowInput(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:opacity-90 transition-opacity"
              >
                Abbrechen
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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