import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import AddLinkModal from './AddLinkModal'
import { useLinks } from '../context/LinksContext'

function AddLinkButton() {
  const [showModal, setShowModal] = useState(false)
  const { addLink } = useLinks()

  const handleAddLink = (newLink) => {
    addLink(newLink)
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors"
        style={{ backgroundColor: 'var(--theme-color)' }}
      >
        <PlusIcon className="h-5 w-5" />
        Links hinzufügen
      </button>

      {showModal && (
        <AddLinkModal 
          onClose={() => setShowModal(false)}
          onAdd={handleAddLink}
        />
      )}
    </>
  )
}

export default AddLinkButton 