import ServiceCard from './ServiceCard'
import TodoList from './TodoList'
import { useLinks } from '../context/LinksContext'
import { useAuth } from '../context/AuthContext'
import { TrashIcon, PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

function Dashboard() {
  const { links, deleteLink } = useLinks()
  const { isLoggedIn, user } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)
  const [layout, setLayout] = useState([
    { id: 'services', title: 'Services' },
    { id: 'todos', title: 'Aufgaben' },
    { id: 'links', title: 'Persönliche Links' }
  ])

  // Laden des Layouts aus dem localStorage
  useEffect(() => {
    if (isLoggedIn && user) {
      const savedLayout = localStorage.getItem(`dashboard_layout_${user.id}`)
      if (savedLayout) {
        try {
          setLayout(JSON.parse(savedLayout))
        } catch (error) {
          console.error('Fehler beim Laden des Layouts:', error)
        }
      }
    }
  }, [isLoggedIn, user])

  // Speichern des Layouts im localStorage
  useEffect(() => {
    if (isLoggedIn && user && layout.length > 0) {
      localStorage.setItem(`dashboard_layout_${user.id}`, JSON.stringify(layout))
    }
  }, [layout, isLoggedIn, user])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(layout)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setLayout(items)
  }

  // Rendering der verschiedenen Abschnitte basierend auf ihrer ID
  const renderSection = (section) => {
    switch (section.id) {
      case 'services':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <ServiceCard title="Moodle" service="moodle" url="https://moodle.spengergasse.at" />
              <ServiceCard title="Teams" service="teams" url="https://teams.microsoft.com" />
              <ServiceCard title="WebUntis" service="webuntis" url="https://neilo.webuntis.com/WebUntis/?school=Spengergasse#/basic/login" />
              <ServiceCard title="EasyMensa" service="easymensa" url="https://spengergasse.easymensa.at/index.php" />
            </div>
          </div>
        )
      case 'todos':
        return isLoggedIn ? (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Aufgaben</h2>
            <TodoList />
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Aufgaben</h2>
            <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-medium mb-2">TODO-Liste</h3>
              <p className="text-center text-gray-400 mb-4">
                Bitte melden Sie sich an, um die TODO-Liste zu nutzen.
              </p>
              <div className="px-4 py-2 rounded text-white" style={{ backgroundColor: 'var(--theme-color)' }}>
                Anmeldung erforderlich
              </div>
            </div>
          </div>
        )
      case 'links':
        return isLoggedIn ? (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Deine persönlichen Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {links.length > 0 ? (
                links.map(link => (
                  <div 
                    key={link._id} 
                    className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg group relative overflow-hidden"
                  >
                    <button
                      onClick={() => deleteLink(link._id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block relative z-10"
                    >
                      {link.image && (
                        <div className="absolute inset-0 -m-6">
                          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                          <img 
                            src={link.image} 
                            alt={link.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className={link.image ? "relative pt-16" : ""}>
                        <h3 className={`text-lg font-medium mb-2 ${link.image ? 'text-white' : ''}`}>
                          {link.title}
                        </h3>
                        <p className={`text-sm ${link.image ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'} truncate`}>
                          {link.url}
                        </p>
                        <span className={`inline-block mt-2 text-xs px-2 py-1 ${link.image ? 'bg-gray-800 text-white' : 'bg-gray-200 dark:bg-gray-700'} rounded`}>
                          {link.category}
                        </span>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                  Keine persönlichen Links vorhanden. 
                  Füge welche hinzu über den "Links hinzufügen" Button!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Persönliche Links</h2>
            <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-medium mb-2">Persönliche Links</h3>
              <p className="text-center text-gray-400 mb-4">
                Bitte melden Sie sich an, um Ihre persönliche Link-Sammlung zu nutzen.
              </p>
              <div className="px-4 py-2 rounded text-white" style={{ backgroundColor: 'var(--theme-color)' }}>
                Anmeldung erforderlich
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      {isLoggedIn && (
        <div className="flex justify-end mb-4">
          {isEditMode ? (
            <button
              onClick={() => setIsEditMode(false)}
              className="flex items-center gap-2 px-4 py-2 rounded text-white"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              <CheckIcon className="h-5 w-5" />
              Fertig
            </button>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 rounded text-white"
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              <PencilSquareIcon className="h-5 w-5" />
              Dashboard anpassen
            </button>
          )}
        </div>
      )}

      {isLoggedIn && isEditMode ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4 px-4 py-2 max-w-7xl mx-auto w-full"
              >
                {layout.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`rounded-lg ${snapshot.isDragging ? 'opacity-70' : ''}`}
                      >
                        <div className="bg-gray-100 dark:bg-[#343434] rounded-lg overflow-hidden shadow-md">
                          <div 
                            {...provided.dragHandleProps}
                            className="py-2 px-4 bg-gray-200 dark:bg-[#242424] flex items-center justify-between cursor-move"
                          >
                            <span className="text-sm font-medium">{section.title}</span>
                            <span className="text-gray-500 text-xs flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                              Zum Verschieben ziehen
                            </span>
                          </div>
                          <div className="p-4">
                            {renderSection(section)}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex flex-col space-y-6 px-4 py-2 max-w-7xl mx-auto w-full">
          {isLoggedIn ? (
            layout.map((section) => (
              <div key={section.id} className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg shadow-md">
                {renderSection(section)}
              </div>
            ))
          ) : (
            <>
              {/* Hauptdienste Reihe für nicht eingeloggte Benutzer */}
              <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <ServiceCard title="Moodle" service="moodle" url="https://moodle.spengergasse.at" />
                  <ServiceCard title="Teams" service="teams" url="https://teams.microsoft.com" />
                  <ServiceCard title="WebUntis" service="webuntis" url="https://neilo.webuntis.com/WebUntis/?school=Spengergasse#/basic/login" />
                  <ServiceCard title="EasyMensa" service="easymensa" url="https://spengergasse.easymensa.at/index.php" />
                </div>
              </div>
              
              {/* Todo Liste und persönliche Links für nicht eingeloggte Benutzer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg flex flex-col items-center justify-center h-full shadow-md">
                    <h3 className="text-xl font-medium mb-2">TODO-Liste</h3>
                    <p className="text-center text-gray-400 mb-4">
                      Bitte melden Sie sich an, um die TODO-Liste zu nutzen.
                    </p>
                    <div className="px-4 py-2 rounded text-white" style={{ backgroundColor: 'var(--theme-color)' }}>
                      Anmeldung erforderlich
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg flex flex-col items-center justify-center h-full shadow-md">
                    <h3 className="text-xl font-medium mb-2">Persönliche Links</h3>
                    <p className="text-center text-gray-400 mb-4">
                      Bitte melden Sie sich an, um Ihre persönliche Link-Sammlung zu nutzen.
                    </p>
                    <div className="px-4 py-2 rounded text-white" style={{ backgroundColor: 'var(--theme-color)' }}>
                      Anmeldung erforderlich
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard 