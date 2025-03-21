import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function FeedbackModal({ onClose }) {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save feedback to localStorage
    const feedback = {
      rating,
      comment,
      date: new Date().toISOString()
    }
    
    try {
      // Get existing feedback data
      const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]')
      existingFeedback.push(feedback)
      localStorage.setItem('feedback', JSON.stringify(existingFeedback))
      
      // Mark as submitted in localStorage to prevent showing again for a week
      localStorage.setItem('lastFeedbackPrompt', new Date().toISOString())
      
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error saving feedback:', error)
    }
  }

  return (
    <div 
      className="fixed bottom-4 left-4 p-6 rounded-lg text-white max-w-xs shadow-lg"
      style={{ backgroundColor: 'var(--theme-color)' }}
    >
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-300 hover:text-white"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      
      {submitted ? (
        <div className="text-center py-4">
          <h3 className="font-bold text-lg mb-2">{t('feedback.thankYou')}</h3>
          <p>{t('feedback.submitted')}</p>
        </div>
      ) : !showForm ? (
        <>
          <h3 className="font-bold mb-2">{t('feedback.thanks')}</h3>
          <h2 className="text-2xl font-bold mb-3">{t('feedback.title')}</h2>
          
          <p className="text-sm mb-4">
            {t('feedback.message')}
          </p>
          
          <div className="flex justify-end">
            <button 
              className="text-white px-4 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              onClick={() => setShowForm(true)}
            >
              {t('feedback.giveFeedback')}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold mb-4">{t('feedback.giveFeedback')}</h3>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm">{t('feedback.rating')}</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${rating >= star ? 'text-yellow-300' : 'text-white text-opacity-30'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm">{t('feedback.comment')}</label>
            <textarea
              className="w-full p-2 rounded bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('feedback.commentPlaceholder')}
            ></textarea>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              className="text-white text-opacity-70 hover:text-opacity-100"
              onClick={() => setShowForm(false)}
            >
              {t('app.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-white text-purple-700 rounded-lg hover:bg-opacity-90"
              disabled={rating === 0}
            >
              {t('feedback.submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default FeedbackModal 