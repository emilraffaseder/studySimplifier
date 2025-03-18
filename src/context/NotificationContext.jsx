import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getNotificationSettings, updateNotificationSettings } from '../services/api';

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
        showTaskDueNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 