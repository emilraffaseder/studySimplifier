/**
 * Formatiert ein Datum in ein lesbares Format
 * @param {string|Date} date - Das zu formatierende Datum
 * @param {Object} options - Formatierungsoptionen
 * @returns {string} Das formatierte Datum
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    
    // Standardoptionen für die Formatierung
    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('de-DE', defaultOptions);
  } catch (error) {
    console.error('Fehler beim Formatieren des Datums:', error);
    return '';
  }
};

/**
 * Formatiert einen Zeitstempel in ein lesbares Format mit Datum und Uhrzeit
 * @param {string|Date} timestamp - Der zu formatierende Zeitstempel
 * @returns {string} Der formatierte Zeitstempel
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const dateObj = new Date(timestamp);
    
    const dateOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const date = dateObj.toLocaleDateString('de-DE', dateOptions);
    const time = dateObj.toLocaleTimeString('de-DE', timeOptions);
    
    return `${date}, ${time} Uhr`;
  } catch (error) {
    console.error('Fehler beim Formatieren des Zeitstempels:', error);
    return '';
  }
};

/**
 * Formatiert eine Zahl als Prozentsatz
 * @param {number} value - Der zu formatierende Wert
 * @param {number} decimals - Anzahl der Dezimalstellen
 * @returns {string} Der formatierte Prozentsatz
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  
  try {
    return `${Number(value).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Fehler beim Formatieren des Prozentsatzes:', error);
    return '';
  }
}; 