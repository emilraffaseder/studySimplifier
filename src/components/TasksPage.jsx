import { useState } from 'react'
import { PlusIcon, TrashIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTodos } from '../context/TodoContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

function TasksPage() {
  const { todos, categories, addTodo, toggleTodo, deleteTodo, addCategory, updateCategory, deleteCategory, loading, error } = useTodos()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [newTask, setNewTask] = useState({ 
    title: '', 
    dueDate: '',
    category: 'default',
    color: '',
    priority: 'medium'
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ 
    id: '', 
    name: '', 
    color: '#67329E' 
  })
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryError, setCategoryError] = useState('')

  // Predefined colors for categories
  const predefinedColors = [
    '#67329E', // violet (theme)
    '#3b82f6', // blue
    '#22c55e', // green
    '#f97316', // orange
    '#ef4444', // red
    '#eab308', // yellow
    '#ec4899', // pink
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#14b8a6', // teal
  ]

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
      color: '',
      priority: 'medium'
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
  
  // Gets priority display information
  const getPriorityDisplay = (priority) => {
    switch(priority) {
      case 'high':
        return { color: '#ef4444', text: t('todo.priorityHigh'), icon: true };
      case 'medium':
        return { color: '#f97316', text: t('todo.priorityMedium'), icon: false };
      case 'low':
        return { color: '#22c55e', text: t('todo.priorityLow'), icon: false };
      default:
        return { color: '#f97316', text: t('todo.priorityMedium'), icon: false };
    }
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
  const modalBgClass = theme === 'light' ? 'bg-white' : 'bg-[#1C1C1C]'
  const overlayClass = theme === 'light' ? 'bg-black/50' : 'bg-black/70'

  // Handle opening the category modal
  const handleAddCategory = () => {
    setNewCategory({ id: '', name: '', color: '#67329E' })
    setEditingCategory(null)
    setCategoryError('')
    setShowCategoryModal(true)
  }

  // Handle editing a category
  const handleEditCategory = (category) => {
    setNewCategory({ ...category })
    setEditingCategory(category.id)
    setCategoryError('')
    setShowCategoryModal(true)
  }

  // Handle submitting a new or edited category
  const handleCategorySubmit = (e) => {
    e.preventDefault()
    setCategoryError('')

    // Validate category name
    if (!newCategory.name.trim()) {
      setCategoryError(t('category.nameRequired'))
      return
    }

    // Create ID from name if it's a new category
    const categoryId = editingCategory || newCategory.name.toLowerCase().replace(/\s+/g, '-')

    // Check if category with this ID already exists (for new categories)
    if (!editingCategory && categories.some(cat => cat.id === categoryId)) {
      setCategoryError(t('category.duplicateName'))
      return
    }

    if (editingCategory) {
      // Update existing category
      updateCategory(editingCategory, {
        name: newCategory.name,
        color: newCategory.color
      })
    } else {
      // Add new category
      addCategory({
        id: categoryId,
        name: newCategory.name,
        color: newCategory.color
      })
    }

    // Close modal and reset form
    setShowCategoryModal(false)
    setNewCategory({ id: '', name: '', color: '#67329E' })
    setEditingCategory(null)
  }

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    const isDeleted = deleteCategory(id)
    if (isDeleted) {
      // If the currently selected category in the task form is deleted,
      // reset it to default
      if (newTask.category === id) {
        setNewTask({ ...newTask, category: 'default' })
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">{t('tasks.title')}</h1>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation Form */}
        <div className={`${cardBgClass} ${textClass} p-6 rounded-lg shadow-md`}>
          <h2 className="text-xl font-semibold mb-4">{t('todo.createTask')}</h2>
          
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className={`block ${textMutedClass} mb-2`}>{t('todo.taskTitle')}</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
                required
              />
            </div>
            
            <div>
              <label className={`block ${textMutedClass} mb-2`}>{t('todo.dueDate')}</label>
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
              <div className="flex justify-between items-center mb-2">
                <label className={`block ${textMutedClass}`}>{t('todo.category')}</label>
                <button 
                  type="button"
                  onClick={handleAddCategory}
                  className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-400"
                >
                  <PlusIcon className="h-3 w-3" />
                  {t('category.new')}
                </button>
              </div>
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
            
            <div>
              <label className={`block ${textMutedClass} mb-2`}>{t('todo.priority')}</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
              >
                <option value="low">{t('todo.priorityLow')}</option>
                <option value="medium">{t('todo.priorityMedium')}</option>
                <option value="high">{t('todo.priorityHigh')}</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full text-white p-2 rounded flex items-center justify-center"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('todo.addTask')}
            </button>
          </form>

          {/* Category Management */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{t('category.categories')}</h3>
              <button 
                type="button"
                onClick={handleAddCategory}
                className="text-xs px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 flex items-center"
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                {t('app.add')}
              </button>
            </div>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categories.map(category => (
                <div 
                  key={category.id} 
                  className={`flex items-center justify-between p-2 rounded ${theme === 'light' ? 'bg-gray-100' : 'bg-[#2A2A2A]'}`}
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    {category.id !== 'default' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                            <span className="truncate flex items-center">
                              {task.priority === 'high' && <ExclamationCircleIcon className="h-3 w-3 mr-1 text-white" />}
                              {task.title}
                            </span>
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
        <h2 className="text-xl font-semibold mb-4">{t('tasks.taskList')}</h2>
        
        {loading ? (
          <div className="text-center py-4">{t('app.loading')}</div>
        ) : todos.length > 0 ? (
          <div className="space-y-2">
            {todos.sort((a, b) => {
              // First sort by priority (high to low)
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
              if (priorityDiff !== 0) return priorityDiff;
              
              // Then sort by date
              return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
            }).map(task => {
              const priorityInfo = getPriorityDisplay(task.priority);
              return (
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
                      <h3 className={`font-medium flex items-center ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.priority === 'high' && 
                          <ExclamationCircleIcon className="h-4 w-4 mr-1 text-red-500" />
                        }
                        {task.title}
                      </h3>
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        {task.dueDate && (
                          <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                            {new Date(task.dueDate).toLocaleDateString('de-DE')}
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: task.color || 'var(--theme-color)', color: 'white' }}>
                          {getCategoryName(task.category)}
                        </span>
                        {task.priority && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded flex items-center"
                            style={{ 
                              backgroundColor: priorityInfo.color,
                              color: 'white'
                            }}
                          >
                            {priorityInfo.text}
                          </span>
                        )}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            {t('tasks.noTasks')}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`absolute inset-0 ${overlayClass}`} onClick={() => setShowCategoryModal(false)}></div>
          <div className={`${modalBgClass} w-full max-w-md rounded-lg p-6 shadow-xl z-10`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? t('category.edit') : t('category.create')}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {categoryError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {categoryError}
              </div>
            )}

            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className={`block ${textMutedClass} mb-2`}>{t('category.name')}</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className={`w-full p-2 rounded ${inputBgClass} border ${borderClass} ${textClass}`}
                  placeholder={t('category.enterName')}
                />
              </div>

              <div className="mb-4">
                <label className={`block ${textMutedClass} mb-2`}>{t('category.color')}</label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${newCategory.color === color ? 'border-gray-700 dark:border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory({...newCategory, color})}
                    ></button>
                  ))}
                </div>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className={`mr-2 px-4 py-2 rounded ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600'} ${textClass}`}
                >
                  {t('app.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                >
                  {editingCategory ? t('app.save') : t('app.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksPage 