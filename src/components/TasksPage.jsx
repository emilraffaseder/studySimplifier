import { useState } from 'react'
import { PlusIcon, TrashIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTodos } from '../context/TodoContext'
import { useTheme } from '../context/ThemeContext'

function TasksPage() {
  const { todos, categories, addTodo, toggleTodo, deleteTodo, loading, error } = useTodos()
  const { theme } = useTheme()
  const [newTask, setNewTask] = useState({ 
    title: '', 
    dueDate: '',
    category: 'default',
    color: ''
  })
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    // Get first day of month and total days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', empty: true })
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateString = date.toISOString().split('T')[0]
      
      // Get tasks for this day
      const dayTasks = todos.filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
        return taskDate === dateString
      })
      
      days.push({ 
        day: i, 
        date: dateString,
        tasks: dayTasks,
        isToday: dateString === today
      })
    }
    
    return days
  }

  // Handle creating new task
  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    
    // Find category color if not provided
    if (newTask.category && !newTask.color) {
      const selectedCategory = categories.find(cat => cat.id === newTask.category)
      if (selectedCategory) {
        newTask.color = selectedCategory.color
      }
    }
    
    await addTodo(newTask)
    setNewTask({ 
      title: '', 
      dueDate: '',
      category: 'default',
      color: ''
    })
  }

  // Navigation for months
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  // Gets category name from ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Allgemein'
  }
  
  const calendarDays = generateCalendarDays()
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  const currentMonthName = monthNames[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  // Style classes based on theme
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-[#242424]'
  const inputBgClass = theme === 'light' ? 'bg-gray-100' : 'bg-[#1C1C1C]'
  const borderClass = theme === 'light' ? 'border-gray-300' : 'border-gray-700'
  const textClass = theme === 'light' ? 'text-gray-800' : 'text-white'
  const textMutedClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300'
  const calendarCellClass = theme === 'light' ? 'bg-gray-50' : 'bg-[#1C1C1C]'

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Aufgaben</h1>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation Form */}
        <div className={`${cardBgClass} ${textClass} p-6 rounded-lg shadow-md`}>
          <h2 className="text-xl font-semibold mb-4">Neue Aufgabe erstellen</h2>
          
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className={`block ${textMutedClass} mb-2`}>Titel</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
                required
              />
            </div>
            
            <div>
              <label className={`block ${textMutedClass} mb-2`}>Fälligkeitsdatum</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
                min={today}
                required
              />
            </div>
            
            <div>
              <label className={`block ${textMutedClass} mb-2`}>Kategorie</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full text-white p-2 rounded flex items-center justify-center"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Aufgabe hinzufügen
            </button>
          </form>
        </div>
        
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className={`${cardBgClass} ${textClass} p-6 rounded-lg shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={prevMonth}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold">
                {currentMonthName} {currentYear}
              </h2>
              
              <button 
                onClick={nextMonth}
                className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Weekday headers */}
              {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day, index) => (
                <div key={index} className={`text-center font-medium py-2 ${textClass}`}>
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`
                    min-h-24 border ${borderClass} rounded p-1
                    ${day.empty ? 'bg-transparent' : calendarCellClass}
                    ${day.isToday ? 'border-2' : ''}
                  `}
                  style={{ borderColor: day.isToday ? 'var(--theme-color)' : '' }}
                >
                  {!day.empty && (
                    <>
                      <div className="text-right text-sm mb-1">{day.day}</div>
                      <div className="space-y-1">
                        {day.tasks?.map(task => (
                          <div 
                            key={task._id} 
                            className="text-xs p-1 rounded truncate flex items-center justify-between"
                            style={{ 
                              backgroundColor: task.completed ? (theme === 'light' ? '#E5E5E5' : '#33333399') : `${task.color || 'var(--theme-color)'}99`,
                              color: 'white'
                            }}
                          >
                            <span className="truncate">{task.title}</span>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => toggleTodo(task._id)}
                                className="text-white hover:text-green-300"
                              >
                                <CheckIcon className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => deleteTodo(task._id)}
                                className="text-white hover:text-red-300"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className={`mt-8 ${cardBgClass} ${textClass} p-6 rounded-lg shadow-md`}>
        <h2 className="text-xl font-semibold mb-4">Aufgabenliste</h2>
        
        {loading ? (
          <div className="text-center py-4">Lädt...</div>
        ) : todos.length > 0 ? (
          <div className="space-y-2">
            {todos.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31')).map(task => (
              <div 
                key={task._id} 
                className="p-4 rounded-lg flex items-center justify-between"
                style={{ 
                  backgroundColor: task.completed 
                    ? (theme === 'light' ? '#F3F4F6' : '#33333370') 
                    : `${task.color || 'var(--theme-color)'}15`,
                  borderLeft: `4px solid ${task.color || 'var(--theme-color)'}`
                }}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTodo(task._id)}
                    className="h-5 w-5 rounded-full border flex items-center justify-center mr-3"
                    style={{ 
                      borderColor: task.color || 'var(--theme-color)',
                      backgroundColor: task.completed ? task.color || 'var(--theme-color)' : 'transparent'
                    }}
                  >
                    {task.completed && <CheckIcon className="h-3 w-3 text-white" />}
                  </button>
                  
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center text-sm">
                      {task.dueDate && (
                        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm mr-3`}>
                          {new Date(task.dueDate).toLocaleDateString('de-DE')}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: task.color || 'var(--theme-color)', color: 'white' }}>
                        {getCategoryName(task.category)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(task._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Keine Aufgaben vorhanden. Erstellen Sie Ihre erste Aufgabe!
          </div>
        )}
      </div>
    </div>
  )
}

export default TasksPage 