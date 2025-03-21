import React, { createContext, useContext, useState, useEffect } from 'react';

// Verfügbare Sprachen
export const LANGUAGES = {
  de: { code: 'de', name: 'Deutsch' },
  en: { code: 'en', name: 'English' }
};

// Übersetzungen
const translations = {
  de: {
    // Allgemein
    'app.title': 'Study Simplifier',
    'app.loading': 'Wird geladen...',
    'app.save': 'Speichern',
    'app.cancel': 'Abbrechen',
    'app.delete': 'Löschen',
    'app.edit': 'Bearbeiten',
    'app.add': 'Hinzufügen',
    'app.close': 'Schließen',
    'app.confirm': 'Bestätigen',
    'app.login': 'Anmelden',
    'app.register': 'Registrieren',
    'app.yes': 'Ja',
    'app.no': 'Nein',
    'app.search': 'Suchen',
    'app.required': 'Erforderlich',
    'app.optional': 'Optional',
    'app.done': 'Fertig',
    'app.error': 'Fehler',
    'app.success': 'Erfolg',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Aufgaben',
    'nav.settings': 'Einstellungen',
    'nav.account': 'Account',
    'nav.logout': 'Abmelden',
    'nav.login': 'Anmelden',
    
    // Dashboard
    'dashboard.editDashboard': 'Dashboard anpassen',
    'dashboard.done': 'Fertig',
    'dashboard.services': 'Services',
    'dashboard.tasks': 'Aufgaben',
    'dashboard.personalLinks': 'Persönliche Links',
    'dashboard.moveUp': 'Nach oben verschieben',
    'dashboard.moveDown': 'Nach unten verschieben',
    'dashboard.dragToMove': 'Zum Verschieben ziehen',
    'dashboard.pleaseLogin': 'Bitte melden Sie sich an, um diese Funktion zu nutzen.',
    'dashboard.loginRequired': 'Anmeldung erforderlich',
    'dashboard.noLinks': 'Keine persönlichen Links vorhanden.',
    'dashboard.addLinksHint': 'Füge welche hinzu über den "Links hinzufügen" Button!',
    
    // TodoList
    'todo.title': 'Aufgaben',
    'todo.add': 'Aufgabe hinzufügen',
    'todo.edit': 'Aufgabe bearbeiten',
    'todo.delete': 'Aufgabe löschen',
    'todo.taskTitle': 'Titel',
    'todo.dueDate': 'Fälligkeitsdatum',
    'todo.category': 'Kategorie',
    'todo.priority': 'Priorität',
    'todo.priorityHigh': 'Hoch',
    'todo.priorityMedium': 'Mittel',
    'todo.priorityLow': 'Niedrig',
    'todo.addTask': 'Aufgabe hinzufügen',
    'todo.noTasks': 'Keine Aufgaben vorhanden',
    'todo.completed': 'Erledigt',
    'todo.taskList': 'Aufgabenliste',
    'todo.createTask': 'Neue Aufgabe erstellen',
    'todo.categories.general': 'Allgemein',
    'todo.categories.study': 'Studium',
    'todo.categories.work': 'Arbeit',
    'todo.categories.personal': 'Persönlich',

    // Kategorien
    'category.new': 'Neue Kategorie',
    'category.edit': 'Kategorie bearbeiten',
    'category.create': 'Kategorie erstellen',
    'category.update': 'Aktualisieren',
    'category.delete': 'Kategorie löschen',
    'category.name': 'Name',
    'category.color': 'Farbe',
    'category.nameRequired': 'Ein Kategoriename ist erforderlich',
    'category.duplicateName': 'Eine Kategorie mit diesem Namen existiert bereits',
    'category.cantDelete': 'Die Kategorie "Allgemein" kann nicht gelöscht werden',
    'category.enterName': 'Kategoriename eingeben',
    'category.categories': 'Kategorien',
    'category.predefinedColors': 'Vordefinierte Farben',
    
    // Links
    'links.personalLinks': 'Persönliche Links',
    'links.add': 'Link hinzufügen',
    'links.edit': 'Link bearbeiten',
    'links.delete': 'Link löschen',
    'links.title': 'Titel',
    'links.url': 'URL',
    'links.category': 'Kategorie',
    'links.image': 'Bild',
    'links.noLinks': 'Keine persönlichen Links vorhanden',
    'links.addLinks': 'Links hinzufügen',
    
    // Einstellungen
    'settings.appearance': 'Erscheinungsbild',
    'settings.theme': 'Theme',
    'settings.themeColor': 'Themefarbe',
    'settings.language': 'Sprache',
    'settings.notifications': 'Benachrichtigungen',
    'settings.emailNotifications': 'Email-Benachrichtigungen',
    'settings.desktopNotifications': 'Desktop-Benachrichtigungen',
    'settings.enable': 'Aktivieren',
    'settings.dueTasks': 'Fällige Aufgaben',
    'settings.newFeatures': 'Neue Funktionen',
    'settings.saveNotifications': 'Benachrichtigungseinstellungen speichern',
    'settings.settingsSaved': 'Einstellungen gespeichert',
    'settings.settingsError': 'Fehler beim Speichern der Einstellungen',
    'settings.dangerZone': 'Gefahrenzone',
    'settings.deleteAccount': 'Account löschen',
    'settings.deleteWarning': 'Wenn du deinen Account löschst, werden alle deine Daten permanent gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.',
    'settings.confirmDelete': 'Bitte bestätige die Löschung deines Accounts, indem du dein Passwort eingibst.',
    'settings.attention': 'Achtung: Diese Aktion kann nicht rückgängig gemacht werden!',
    'settings.enterPassword': 'Passwort',
    'settings.deleting': 'Wird gelöscht...',
    'settings.lightMode': 'Heller Modus',
    'settings.darkMode': 'Dunkler Modus',
    'settings.systemMode': 'Systemeinstellung',
    
    // Aufgaben (Seite)
    'tasks.title': 'Aufgaben',
    'tasks.add': 'Neue Aufgabe',
    'tasks.due': 'Fällig',
    'tasks.completed': 'Erledigt',
    'tasks.priority': 'Priorität',
    'tasks.description': 'Beschreibung',
    'tasks.noTasks': 'Keine Aufgaben vorhanden',
    'tasks.loading': 'Aufgaben werden geladen...',
    'tasks.calendar': 'Kalender',
    'tasks.taskList': 'Aufgabenliste',
    'tasks.error': 'Fehler beim Laden der Aufgaben',
    'tasks.months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    'tasks.weekdays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    
    // Login/Register
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.firstName': 'Vorname',
    'auth.lastName': 'Nachname',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    'auth.createAccount': 'Konto erstellen',
    'auth.loginError': 'Fehler bei der Anmeldung',
    'auth.registerError': 'Fehler bei der Registrierung',
    
    // Account
    'account.personalInfo': 'Persönliche Informationen',
    'account.name': 'Name',
    'account.email': 'E-Mail',
    'account.password': 'Passwort',
    'account.changePassword': 'Passwort ändern',
    'account.currentPassword': 'Aktuelles Passwort',
    'account.newPassword': 'Neues Passwort',
    'account.confirmPassword': 'Passwort bestätigen',
    'account.profileImage': 'Profilbild',
    'account.updatePassword': 'Passwort aktualisieren',
    'account.passwordUpdated': 'Passwort erfolgreich aktualisiert',
    'account.passwordError': 'Fehler beim Aktualisieren des Passworts',
    'account.changeProfileImage': 'Profilbild ändern',
    'account.currentImage': 'Aktuelles Profilbild',
    'account.noImage': 'Kein Profilbild ausgewählt',
    'account.removeImage': 'Profilbild entfernen',
    'account.uploadImage': 'Bild hochladen',
    'account.localImage': 'Lokales Bild',
    'account.imageUrl': 'Bild-URL',
    'account.selectImage': 'Bild auswählen',
    'account.browse': 'Durchsuchen...',
    'account.noFileSelected': 'Keine Datei ausgewählt',
    'account.enterImageUrl': 'Bild-URL eingeben',
    'account.updateProfile': 'Profil aktualisieren',
    'account.updateSuccess': 'Profil erfolgreich aktualisiert',
    'account.updateError': 'Fehler beim Aktualisieren des Profils',
    
    // NotFound
    'notFound.title': 'Seite nicht gefunden',
    'notFound.message': 'Die Seite, die du suchst, existiert leider nicht oder wurde verschoben.',
    'notFound.returnHome': 'Zurück zur Startseite',
    
    // Feedback
    'feedback.thanks': 'Danke für die Nutzung von',
    'feedback.title': 'Study Simplifier',
    'feedback.message': 'Wir würden uns über dein Feedback freuen.',
    'feedback.giveFeedback': 'Feedback geben',
    'feedback.rating': 'Bewertung',
    'feedback.comment': 'Kommentar',
    'feedback.commentPlaceholder': 'Was gefällt dir? Was können wir verbessern?',
    'feedback.submit': 'Absenden',
    'feedback.thankYou': 'Vielen Dank!',
    'feedback.submitted': 'Dein Feedback wurde erfolgreich übermittelt.'
  },
  en: {
    // General
    'app.title': 'Study Simplifier',
    'app.loading': 'Loading...',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.add': 'Add',
    'app.close': 'Close',
    'app.confirm': 'Confirm',
    'app.login': 'Login',
    'app.register': 'Register',
    'app.yes': 'Yes',
    'app.no': 'No',
    'app.search': 'Search',
    'app.required': 'Required',
    'app.optional': 'Optional',
    'app.done': 'Done',
    'app.error': 'Error',
    'app.success': 'Success',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.tasks': 'Tasks',
    'nav.settings': 'Settings',
    'nav.account': 'Account',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Dashboard
    'dashboard.editDashboard': 'Customize Dashboard',
    'dashboard.done': 'Done',
    'dashboard.services': 'Services',
    'dashboard.tasks': 'Tasks',
    'dashboard.personalLinks': 'Personal Links',
    'dashboard.moveUp': 'Move up',
    'dashboard.moveDown': 'Move down',
    'dashboard.dragToMove': 'Drag to move',
    'dashboard.pleaseLogin': 'Please log in to use this feature.',
    'dashboard.loginRequired': 'Login required',
    'dashboard.noLinks': 'No personal links available.',
    'dashboard.addLinksHint': 'Add some using the "Add Links" button!',
    
    // TodoList
    'todo.title': 'Tasks',
    'todo.add': 'Add Task',
    'todo.edit': 'Edit Task',
    'todo.delete': 'Delete Task',
    'todo.taskTitle': 'Title',
    'todo.dueDate': 'Due Date',
    'todo.category': 'Category',
    'todo.priority': 'Priority',
    'todo.priorityHigh': 'High',
    'todo.priorityMedium': 'Medium',
    'todo.priorityLow': 'Low',
    'todo.addTask': 'Add Task',
    'todo.noTasks': 'No tasks available',
    'todo.completed': 'Completed',
    'todo.taskList': 'Task List',
    'todo.createTask': 'Create New Task',
    'todo.categories.general': 'General',
    'todo.categories.study': 'Study',
    'todo.categories.work': 'Work',
    'todo.categories.personal': 'Personal',

    // Categories
    'category.new': 'New Category',
    'category.edit': 'Edit Category',
    'category.create': 'Create Category',
    'category.update': 'Update',
    'category.delete': 'Delete Category',
    'category.name': 'Name',
    'category.color': 'Color',
    'category.nameRequired': 'A category name is required',
    'category.duplicateName': 'A category with this name already exists',
    'category.cantDelete': 'The "General" category cannot be deleted',
    'category.enterName': 'Enter category name',
    'category.categories': 'Categories',
    'category.predefinedColors': 'Predefined Colors',
    
    // Links
    'links.personalLinks': 'Personal Links',
    'links.add': 'Add Link',
    'links.edit': 'Edit Link',
    'links.delete': 'Delete Link',
    'links.title': 'Title',
    'links.url': 'URL',
    'links.category': 'Category',
    'links.image': 'Image',
    'links.noLinks': 'No personal links available',
    'links.addLinks': 'Add Links',
    
    // Settings
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.themeColor': 'Theme Color',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.emailNotifications': 'Email Notifications',
    'settings.desktopNotifications': 'Desktop Notifications',
    'settings.enable': 'Enable',
    'settings.dueTasks': 'Due Tasks',
    'settings.newFeatures': 'New Features',
    'settings.saveNotifications': 'Save Notification Settings',
    'settings.settingsSaved': 'Settings saved',
    'settings.settingsError': 'Error saving settings',
    'settings.dangerZone': 'Danger Zone',
    'settings.deleteAccount': 'Delete Account',
    'settings.deleteWarning': 'If you delete your account, all your data will be permanently deleted. This action cannot be undone.',
    'settings.confirmDelete': 'Please confirm the deletion of your account by entering your password.',
    'settings.attention': 'Attention: This action cannot be undone!',
    'settings.enterPassword': 'Password',
    'settings.deleting': 'Deleting...',
    'settings.lightMode': 'Light Mode',
    'settings.darkMode': 'Dark Mode',
    'settings.systemMode': 'System Setting',
    
    // Tasks (Page)
    'tasks.title': 'Tasks',
    'tasks.add': 'New Task',
    'tasks.due': 'Due',
    'tasks.completed': 'Completed',
    'tasks.priority': 'Priority',
    'tasks.description': 'Description',
    'tasks.noTasks': 'No tasks available',
    'tasks.loading': 'Loading tasks...',
    'tasks.calendar': 'Calendar',
    'tasks.taskList': 'Task List',
    'tasks.error': 'Error loading tasks',
    'tasks.months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'tasks.weekdays': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    
    // Login/Register
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    'auth.loginError': 'Login Error',
    'auth.registerError': 'Registration Error',
    
    // Account
    'account.personalInfo': 'Personal Information',
    'account.name': 'Name',
    'account.email': 'Email',
    'account.password': 'Password',
    'account.changePassword': 'Change Password',
    'account.currentPassword': 'Current Password',
    'account.newPassword': 'New Password',
    'account.confirmPassword': 'Confirm Password',
    'account.profileImage': 'Profile Image',
    'account.updatePassword': 'Update Password',
    'account.passwordUpdated': 'Password successfully updated',
    'account.passwordError': 'Error updating password',
    'account.changeProfileImage': 'Change Profile Image',
    'account.currentImage': 'Current Profile Image',
    'account.noImage': 'No profile image selected',
    'account.removeImage': 'Remove profile image',
    'account.uploadImage': 'Upload Image',
    'account.localImage': 'Local Image',
    'account.imageUrl': 'Image URL',
    'account.selectImage': 'Select Image',
    'account.browse': 'Browse...',
    'account.noFileSelected': 'No file selected',
    'account.enterImageUrl': 'Enter image URL',
    'account.updateProfile': 'Update Profile',
    'account.updateSuccess': 'Profile successfully updated',
    'account.updateError': 'Error updating profile',
    
    // NotFound
    'notFound.title': 'Page Not Found',
    'notFound.message': 'The page you are looking for does not exist or has been moved.',
    'notFound.returnHome': 'Return to Home',
    
    // Feedback
    'feedback.thanks': 'Thanks for using',
    'feedback.title': 'Study Simplifier',
    'feedback.message': 'We would be happy to receive your feedback.',
    'feedback.giveFeedback': 'Give Feedback',
    'feedback.rating': 'Rating',
    'feedback.comment': 'Comment',
    'feedback.commentPlaceholder': 'What do you like? What can we improve?',
    'feedback.submit': 'Submit',
    'feedback.thankYou': 'Thank you!',
    'feedback.submitted': 'Your feedback has been successfully submitted.'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('de');
  
  // Sprache aus dem localStorage laden
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  // Ändern der Sprache
  const changeLanguage = (languageCode) => {
    if (LANGUAGES[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('language', languageCode);
    }
  };
  
  // Übersetzungstext abrufen
  const t = (key, replacements = {}) => {
    const translation = translations[currentLanguage]?.[key] || key;
    
    // Ersetzen von Variablen in der Übersetzung (z.B. {{name}})
    let result = translation;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    }
    
    return result;
  };
  
  const value = {
    language: currentLanguage,
    languages: LANGUAGES,
    changeLanguage,
    t
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 