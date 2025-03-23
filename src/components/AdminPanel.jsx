import { useState } from 'react';
import { resetDatabase } from '../services/api';

function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleResetDatabase = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await resetDatabase(adminPassword);
      setResult(response);
      setAdminPassword(''); // Passwort löschen nach erfolgreichem Reset
    } catch (err) {
      console.error('Fehler beim Zurücksetzen der Datenbank:', err);
      setError(err.response?.data?.msg || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#242424] p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin-Panel</h2>
      
      <div className="bg-red-100 dark:bg-red-900 p-4 mb-6 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Warnung: Gefährliche Aktionen</h3>
        <p className="text-red-700 dark:text-red-300">
          Die folgenden Aktionen können nicht rückgängig gemacht werden und können zu Datenverlust führen. 
          Verwende diese Funktionen nur, wenn du dir absolut sicher bist.
        </p>
      </div>
      
      <form onSubmit={handleResetDatabase} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Admin-Passwort</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:outline-none"
            style={{ borderColor: 'var(--theme-color)' }}
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-2 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-2 rounded">
            {result.msg}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          {isLoading ? 'Wird zurückgesetzt...' : 'Datenbank zurücksetzen'}
        </button>
      </form>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Das Admin-Passwort für diese Demo-Version ist: <code>admin123</code>
      </p>
    </div>
  );
}

export default AdminPanel; 