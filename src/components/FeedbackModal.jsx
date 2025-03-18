import { XMarkIcon } from '@heroicons/react/24/outline'

function FeedbackModal({ onClose }) {
  return (
    <div 
      className="fixed bottom-4 left-4 p-6 rounded-lg text-white max-w-xs"
      style={{ backgroundColor: 'var(--theme-color)' }}
    >
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-300 hover:text-white"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      
      <h3 className="font-bold mb-2">Thanks for using</h3>
      <h2 className="text-2xl font-bold mb-3">Study Simplifier</h2>
      
      <p className="text-sm mb-4">
        We would be happy to recieve your feedback.
      </p>
      
      <div className="flex justify-end">
        <button className="text-white text-2xl">
          ›››
        </button>
      </div>
    </div>
  )
}

export default FeedbackModal 