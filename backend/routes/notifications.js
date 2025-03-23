const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Update notification settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { email, desktop } = req.body;
    
    console.log('Updating notification settings:', req.body);
    console.log('User ID:', req.user.id);
    
    // Finde den Benutzer und validiere nicht
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }

    // Benutzerdaten vorbereiten zum Aktualisieren
    const updateData = {};

    // Update email notification settings if provided
    if (email) {
      if (!user.notifications) {
        user.notifications = {};
      }
      if (!user.notifications.email) {
        user.notifications.email = {};
      }
      
      if (email.enabled !== undefined) user.notifications.email.enabled = email.enabled;
      if (email.dueTasks !== undefined) user.notifications.email.dueTasks = email.dueTasks;
      if (email.newFeatures !== undefined) user.notifications.email.newFeatures = email.newFeatures;
    }

    // Update desktop notification settings if provided
    if (desktop) {
      if (!user.notifications) {
        user.notifications = {};
      }
      if (!user.notifications.desktop) {
        user.notifications.desktop = {};
      }
      
      if (desktop.enabled !== undefined) user.notifications.desktop.enabled = desktop.enabled;
      if (desktop.dueTasks !== undefined) user.notifications.desktop.dueTasks = desktop.dueTasks;
    }

    // Aktualisieren mit findByIdAndUpdate, um Validierung zu umgehen
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { notifications: user.notifications },
      { new: true, runValidators: false }
    );
    
    res.json({
      success: true,
      notifications: updatedUser.notifications
    });
  } catch (err) {
    console.error('Error updating notification settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get current notification settings
router.get('/settings', auth, async (req, res) => {
  try {
    console.log('Getting notification settings for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('notifications');
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }

    // Initialize notifications if they don't exist
    if (!user.notifications) {
      // Aktualisieren mit findByIdAndUpdate, um Validierung zu umgehen
      const defaultSettings = {
        email: { enabled: false, dueTasks: true, newFeatures: true },
        desktop: { enabled: false, dueTasks: true }
      };
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { notifications: defaultSettings },
        { new: true, runValidators: false }
      );
      
      return res.json(updatedUser.notifications);
    }

    res.json(user.notifications);
  } catch (err) {
    console.error('Error fetching notification settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Manually trigger task notifications (admin only)
router.post('/check-tasks', auth, async (req, res) => {
  try {
    // In a real app, you'd check if the user is an admin
    // For now, we'll just allow any authenticated user to trigger this for testing
    const result = await notificationService.checkAndSendTaskNotifications();
    res.json(result);
  } catch (err) {
    console.error('Error triggering task notifications:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send new feature notifications (admin only)
router.post('/new-feature', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ msg: 'Titel und Beschreibung sind erforderlich' });
    }
    
    // In a real app, you'd check if the user is an admin
    // For now, we'll just allow any authenticated user to trigger this for testing
    const result = await notificationService.sendNewFeatureNotifications(title, description);
    res.json(result);
  } catch (err) {
    console.error('Error sending new feature notifications:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test route to check if notifications routes are working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Notifications routes are working' });
});

// Test email notification
router.post('/test-email', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ msg: 'Passwort ist erforderlich' });
    }
    
    // Finde den Benutzer und verifiziere das Passwort
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }
    
    // In einer realen App würden Sie hier das Passwort mit bcrypt vergleichen
    // Da wir das Passwort nicht gespeichert haben, ist dies ein vereinfachter Test
    // Im Produktionscode sollten Sie immer bcrypt.compare verwenden
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Falsches Passwort' });
    }
    
    // Sende eine Test-Email
    const emailService = require('../services/emailService');
    await emailService.sendEmail({
      to: user.email,
      subject: 'Test Benachrichtigung von Study Simplifier',
      text: `Hallo ${user.firstName}, 

Dies ist eine Test-Benachrichtigung, um zu überprüfen, ob die E-Mail-Benachrichtigungen funktionieren.

Viele Grüße,
Dein Study Simplifier Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #67329E; color: white; padding: 20px; text-align: center;">
            <img src="cid:logo" alt="Study Simplifier Logo" style="max-width: 150px; margin-bottom: 10px;">
            <h1>Test Benachrichtigung</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Hallo ${user.firstName},</p>
            <p>Dies ist eine <strong>Test-Benachrichtigung</strong>, um zu überprüfen, ob die E-Mail-Benachrichtigungen funktionieren.</p>
            <p>Viele Grüße,<br>Dein Study Simplifier Team</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: '../public/icons/LogoStudySimplifier.png',
          cid: 'logo'
        }
      ]
    });
    
    res.json({ success: true, message: 'Test-Email wurde gesendet' });
  } catch (err) {
    console.error('Error sending test email:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test desktop notification (nur auf Client-Seite relevant, aber wir verifizieren das Passwort)
router.post('/test-desktop', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ msg: 'Passwort ist erforderlich' });
    }
    
    // Finde den Benutzer und verifiziere das Passwort
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }
    
    // Verifiziere das Passwort
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Falsches Passwort' });
    }
    
    // Bestätige Erfolg, die eigentliche Desktop-Benachrichtigung wird client-seitig gesendet
    res.json({ 
      success: true, 
      message: 'Passwort verifiziert, Desktop-Benachrichtigung kann angezeigt werden' 
    });
  } catch (err) {
    console.error('Error verifying password for desktop notification:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 