import ServiceCard from './ServiceCard'
import TodoList from './TodoList'
import { useLinks } from '../context/LinksContext'
import { TrashIcon } from '@heroicons/react/24/outline'

function Dashboard() {
  const { links, deleteLink } = useLinks()

  return (
    <div className="grid grid-cols-3 gap-6">
      <ServiceCard title="Moodle" service="moodle" url="https://moodle.spengergasse.at" />
      <ServiceCard title="Teams" service="teams" url="https://teams.microsoft.com" />
      <TodoList />
      <ServiceCard title="WebUntis" service="webuntis" url="https://neilo.webuntis.com/WebUntis/?school=Spengergasse#/basic/login" />
      <ServiceCard title="EasyMensa" service="easymensa" url="https://spengergasse.easymensa.at/index.php" />
      
      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-4">Deine persönlichen Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {links.length > 0 ? (
            links.map(link => (
              <div 
                key={link.id} 
                className="bg-gray-100 dark:bg-[#242424] p-6 rounded-lg group relative"
              >
                <button
                  onClick={() => deleteLink(link.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-lg font-medium mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {link.url}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    {link.category}
                  </span>
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
    </div>
  )
}

export default Dashboard 