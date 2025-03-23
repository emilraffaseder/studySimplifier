import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendVerificationCode } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Email sollte als State übergeben werden
  const email = location.state?.email || '';
  
  if (!email) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Ungültige Anfrage</h1>
        <p>E-Mail-Adresse fehlt. Bitte beginne den Registrierungsprozess erneut.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 rounded text-white transition-colors"
          style={{ backgroundColor: 'var(--theme-color)' }}
        >
          Zur Startseite
        </button>
      </div>
    );
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!verificationCode) {
      setError('Bitte gib deinen Bestätigungscode ein');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await verifyEmail(email, verificationCode);
      
      // Erfolgreiche Verifizierung - speichere Token und leite weiter
      if (response.token) {
        localStorage.setItem('token', response.token);
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload, um Auth-Status zu aktualisieren
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Fehler bei der Verifizierung');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    setError('');
    setResending(true);
    
    try {
      const response = await resendVerificationCode(email);
      if (response.success) {
        setError('');
        alert('Neuer Bestätigungscode wurde gesendet. Bitte überprüfe deine E-Mails.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Fehler beim Senden des neuen Codes');
    } finally {
      setResending(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-[#242424] rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">E-Mail bestätigen</h2>
      
      {success ? (
        <div className="text-center">
          <div className="text-green-500 mb-4">
            Deine E-Mail wurde erfolgreich bestätigt!
          </div>
          <p>Du wirst jetzt automatisch weitergeleitet...</p>
        </div>
      ) : (
        <>
          <p className="mb-4">
            Wir haben einen Bestätigungscode an <strong>{email}</strong> gesendet.
            Bitte gib den Code unten ein, um deine E-Mail-Adresse zu verifizieren.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bestätigungscode</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 rounded bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 focus:border-[var(--theme-color)] focus:outline-none"
                placeholder="6-stelliger Code"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-[var(--theme-color)] text-sm hover:underline"
              >
                {resending ? 'Wird gesendet...' : 'Code erneut senden'}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded text-white transition-colors"
                style={{ backgroundColor: 'var(--theme-color)' }}
              >
                {loading ? 'Wird verifiziert...' : 'Bestätigen'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default EmailVerification; 