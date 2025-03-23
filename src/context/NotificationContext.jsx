import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getNotificationSettings, 
  updateNotificationSettings, 
  testEmailNotification,
  testDesktopNotification
} from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const [settings, setSettings] = useState({
    email: { enabled: false, dueTasks: true, newFeatures: true },
    desktop: { enabled: false, dueTasks: true }
  });
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for notification permission when component mounts
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Fetch notification settings when user logs in
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchNotificationSettings();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const fetchNotificationSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching notification settings:', err);
      setError('Benachrichtigungseinstellungen konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      setError(null);
      const { notifications } = await updateNotificationSettings(newSettings);
      setSettings(notifications);
      return { success: true };
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Benachrichtigungseinstellungen konnten nicht aktualisiert werden');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const requestDesktopPermission = async () => {
    if (!('Notification' in window)) {
      setError('Dieser Browser unterstützt keine Desktop-Benachrichtigungen');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermissionStatus('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === 'granted';
    }

    // If permission is already denied
    setPermissionStatus('denied');
    return false;
  };

  const showDesktopNotification = (title, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('Desktop notifications not available or permission not granted');
      return;
    }

    const defaultOptions = {
      icon: '/icons/LogoStudySimplifier.png',
      badge: '/icons/LogoStudySimplifier.png',
      tag: 'study-simplifier-notification',
      requireInteraction: true,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };

    return notification;
  };

  // Example function to show task due notification
  const showTaskDueNotification = (task) => {
    if (!settings.desktop.enabled || !settings.desktop.dueTasks) {
      return;
    }

    const dueDate = new Date(task.dueDate).toLocaleDateString();
    
    return showDesktopNotification(`Aufgabe fällig: ${task.title}`, {
      body: `Deine Aufgabe ist am ${dueDate} fällig.`,
      data: { taskId: task._id },
      onClick: () => window.location.href = '/tasks'
    });
  };

  // Test-Funktionen für Benachrichtigungen
  const sendTestEmailNotification = async (password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await testEmailNotification(password);
      return { success: true, message: result.message };
    } catch (err) {
      console.error('Error sending test email notification:', err);
      setError(err.response?.data?.msg || 'Test-Email konnte nicht gesendet werden');
      return { success: false, error: err.response?.data?.msg || err.message };
    } finally {
      setLoading(false);
    }
  };

  const sendTestDesktopNotification = async (password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Verifiziere das Passwort über API
      const result = await testDesktopNotification(password);
      
      // Wenn Passwort verifiziert, zeige lokale Benachrichtigung an
      if (result.success) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
          setError('Desktop-Benachrichtigungen sind nicht aktiviert oder erlaubt');
          return { 
            success: false, 
            error: 'Desktop-Benachrichtigungen sind nicht aktiviert oder erlaubt'
          };
        }
        
        showDesktopNotification('Test Benachrichtigung', {
          body: 'Dies ist eine Test-Benachrichtigung. Desktop-Benachrichtigungen funktionieren!',
          requireInteraction: true
        });
        
        return { success: true, message: 'Desktop-Benachrichtigung wurde angezeigt' };
      }
      
      return result;
    } catch (err) {
      console.error('Error sending test desktop notification:', err);
      setError(err.response?.data?.msg || 'Test-Benachrichtigung konnte nicht angezeigt werden');
      return { success: false, error: err.response?.data?.msg || err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        settings,
        permissionStatus,
        loading,
        error,
        updateSettings,
        requestDesktopPermission,
        showDesktopNotification,
        showTaskDueNotification,
        sendTestEmailNotification,
        sendTestDesktopNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 