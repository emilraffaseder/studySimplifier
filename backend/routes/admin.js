const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Todo = require('../models/Todo');
const Link = require('../models/Link');

// Middleware to check if user is admin (simplified for demo)
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // In einer echten Anwendung würde man prüfen, ob der Benutzer Admin-Rechte hat
    // Hier muss man nur das richtige Admin-Passwort eingeben
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Reset database - DELETE ALL DATA
router.post('/reset-database', auth, async (req, res) => {
  try {
    const { adminPassword } = req.body;
    
    if (!adminPassword) {
      return res.status(400).json({ msg: 'Admin-Passwort ist erforderlich' });
    }
    
    // In einer echten Anwendung würde man das Admin-Passwort mit einem fest hinterlegten Wert vergleichen
    // oder den Admin-Status des Benutzers prüfen
    // Hier verwenden wir ein festgelegtes Passwort für die Demo
    if (adminPassword !== 'admin123') {
      return res.status(403).json({ msg: 'Zugriff verweigert - Falsches Admin-Passwort' });
    }
    
    // Alle Daten löschen
    await User.deleteMany({});
    await Todo.deleteMany({});
    await Link.deleteMany({});
    
    res.json({ 
      success: true, 
      msg: 'Alle Daten wurden erfolgreich gelöscht. Die Datenbank wurde zurückgesetzt.' 
    });
  } catch (err) {
    console.error('Fehler beim Zurücksetzen der Datenbank:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router; 