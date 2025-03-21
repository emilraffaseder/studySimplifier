import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function NotFoundPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-8">
        <div className="text-9xl font-bold mb-4" style={{ color: 'var(--theme-color)' }}>404</div>
        <svg 
          className="w-64 h-64 mx-auto mb-8" 
          viewBox="0 0 512 512" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M394 161c-1.28-13.37-6.9-25.93-16-35.47-9.1-9.55-21.42-15.42-34.67-16.53-13.2-1.1-26.33 2.85-36.87 11.23-10.5 8.4-17.8 20.5-20.46 34.33-2.58 13.5.1 27.58 7.6 39.25 7.5 11.7 18.9 20.35 32 24.13 13.1 3.78 27.1 2.67 39.3-3.04 12.2-5.7 22.03-15.63 27.63-27.9 2.8-6.12 4.56-12.7 5-19.2.12-2.24.2-4.5.2-6.8h-3.72z" 
            fill="none" 
            stroke="var(--theme-color)" 
            strokeWidth="12"
          />
          <path 
            d="M308 185c0-18.2-14.8-33-33-33s-33 14.8-33 33 14.8 33 33 33 33-14.8 33-33z" 
            fill="none" 
            stroke="var(--theme-color)" 
            strokeWidth="12"
          />
          <path 
            d="M118 161c1.28-13.37 6.9-25.93 16-35.47 9.1-9.55 21.42-15.42 34.67-16.53 13.2-1.1 26.33 2.85 36.87 11.23 10.5 8.4 17.8 20.5 20.46 34.33 2.58 13.5-.1 27.58-7.6 39.25-7.5 11.7-18.9 20.35-32 24.13-13.1 3.78-27.1 2.67-39.3-3.04-12.2-5.7-22.03-15.63-27.63-27.9-2.8-6.12-4.56-12.7-5-19.2-.12-2.24-.2-4.5-.2-6.8h3.72z" 
            fill="none" 
            stroke="var(--theme-color)" 
            strokeWidth="12"
          />
          <path 
            d="M204 185c0-18.2 14.8-33 33-33s33 14.8 33 33-14.8 33-33 33-33-14.8-33-33z" 
            fill="none" 
            stroke="var(--theme-color)" 
            strokeWidth="12"
          />
          <path 
            d="M157 280s28.9 27 98.5 27c69.5 0 98.5-27 98.5-27" 
            stroke="var(--theme-color)" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
          <path 
            d="M256 112c79.5 0 144 64.5 144 144s-64.5 144-144 144S112 335.5 112 256s64.5-144 144-144z" 
            stroke="var(--theme-color)" 
            strokeWidth="12"
          />
        </svg>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Seite nicht gefunden</h1>
      
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Die Seite, die du suchst, existiert leider nicht oder wurde verschoben.
      </p>
      
      <button
        onClick={handleGoBack}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-transform transform hover:scale-105"
        style={{ backgroundColor: 'var(--theme-color)' }}
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Zurück zur Startseite
      </button>
    </div>
  );
}

export default NotFoundPage; 