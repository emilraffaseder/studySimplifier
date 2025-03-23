const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
const emailService = require('../services/emailService')
const crypto = require('crypto')

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Ungültige Anmeldedaten' })
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(400).json({ 
        msg: 'Bitte bestätige zuerst deine E-Mail-Adresse',
        needsVerification: true,
        email: user.email
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Ungültige Anmeldedaten' })
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImage: user.profileImage
          }
        })
      }
    )
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).send('Server Error')
  }
})

// Benutzer registrieren
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    // Basic validation
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      return res.status(400).json({ msg: 'Bitte alle Felder ausfüllen' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwörter stimmen nicht überein' })
    }

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: 'Diese E-Mail-Adresse wird bereits verwendet' })
    }

    // Create verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpires = new Date()
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 1) // 1 hour expiration

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      verified: false,
      verificationCode,
      verificationCodeExpires
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save user
    await user.save()

    // Send verification email
    await emailService.sendVerificationEmail(user)

    // Return success without token (user needs to verify first)
    res.json({ 
      success: true, 
      msg: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails für den Bestätigungscode.'
    })
  } catch (err) {
    console.error('Error in registration:', err)
    res.status(500).json({ error: err.message })
  }
})

// Email verification route
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body

    // Validate inputs
    if (!email || !code) {
      return res.status(400).json({ msg: 'Bitte E-Mail und Bestätigungscode angeben' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Benutzer nicht gefunden' })
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({ msg: 'E-Mail bereits bestätigt' })
    }

    // Check verification code
    if (user.verificationCode !== code) {
      return res.status(400).json({ msg: 'Falscher Bestätigungscode' })
    }

    // Check if code expired
    if (new Date() > new Date(user.verificationCodeExpires)) {
      return res.status(400).json({ msg: 'Bestätigungscode abgelaufen' })
    }

    // Update user
    user.verified = true
    user.verificationCode = null
    user.verificationCodeExpires = null
    await user.save()

    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err
        res.json({ token, user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          verified: user.verified
        }})
      }
    )
  } catch (err) {
    console.error('Error verifying email:', err)
    res.status(500).json({ error: err.message })
  }
})

// Resend verification code
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body

    // Validate inputs
    if (!email) {
      return res.status(400).json({ msg: 'Bitte E-Mail angeben' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Benutzer nicht gefunden' })
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({ msg: 'E-Mail bereits bestätigt' })
    }

    // Create new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpires = new Date()
    verificationCodeExpires.setHours(verificationCodeExpires.getHours() + 1) // 1 hour expiration

    // Update user
    user.verificationCode = verificationCode
    user.verificationCodeExpires = verificationCodeExpires
    await user.save()

    // Send verification email
    await emailService.sendVerificationEmail(user)

    // Return success
    res.json({ 
      success: true, 
      msg: 'Neuer Bestätigungscode wurde gesendet. Bitte überprüfe deine E-Mails.'
    })
  } catch (err) {
    console.error('Error resending verification code:', err)
    res.status(500).json({ error: err.message })
  }
})

// Aktualisieren des Profilbilds
router.put('/profile-image', auth, async (req, res) => {
  try {
    const { profileImage } = req.body;
    
    // Entfernen der Validierung, die eine Profilbild-URL erfordert
    // if (!profileImage) {
    //   return res.status(400).json({ msg: 'Profilbild URL ist erforderlich' });
    // }

    console.log('Profilbild Update für Benutzer:', req.user.id);
    console.log('Profilbild Wert:', profileImage ? 'Vorhanden' : 'Leer');
    
    // Sicherstellung, dass es keine zu großen Bilder gibt
    if (profileImage && profileImage.length > 2000000) { // Ungefähr 2MB
      return res.status(400).json({ 
        msg: 'Profilbild ist zu groß. Maximum ist 2MB.' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }

    user.profileImage = profileImage || ''; // Leere Zeichenkette wenn keine URL vorhanden
    await user.save();

    res.json({ 
      success: true, 
      profileImage: user.profileImage 
    });
  } catch (err) {
    console.error('Update profile image error:', err);
    res.status(500).json({ 
      msg: 'Fehler beim Aktualisieren des Profilbilds', 
      error: err.message 
    });
  }
});

// Benutzerprofile aktualisieren
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: 'Bitte alle Felder ausfüllen' });
    }
    
    // Benutzer finden
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }
    
    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Passwort ist nicht korrekt' });
    }
    
    // Überprüfen, ob die neue E-Mail bereits von einem anderen Benutzer verwendet wird
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Ein Benutzer mit dieser E-Mail existiert bereits' });
      }
    }
    
    // Profil aktualisieren
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    
    await user.save();
    
    res.json({ 
      success: true, 
      msg: 'Profil erfolgreich aktualisiert',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ 
      msg: 'Fehler beim Aktualisieren des Profils', 
      error: err.message 
    });
  }
});

// Get aktueller Benutzer
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Passwort ändern
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    console.log('Passwort-Änderungsversuch für Benutzer:', req.user.id);
    
    // Validierung
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'Bitte alle Felder ausfüllen' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'Neue Passwörter stimmen nicht überein' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Das neue Passwort muss mindestens 6 Zeichen lang sein' });
    }
    
    // Benutzer finden
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Benutzer nicht gefunden bei Passwortänderung:', req.user.id);
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }
    
    // Aktuelles Passwort überprüfen
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Falsches aktuelles Passwort bei Passwortänderung:', req.user.id);
      return res.status(400).json({ msg: 'Aktuelles Passwort ist nicht korrekt' });
    }
    
    // Neues Passwort setzen und hashen
    user.password = newPassword;
    await user.save();
    
    console.log('Passwort erfolgreich geändert für:', req.user.id);
    res.json({ success: true, msg: 'Passwort erfolgreich geändert' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      msg: 'Fehler beim Ändern des Passworts',
      error: err.message 
    });
  }
});

// Account löschen
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ msg: 'Passwort ist erforderlich' });
    }
    
    // Benutzer finden
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Benutzer nicht gefunden' });
    }
    
    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Passwort ist nicht korrekt' });
    }
    
    // Alle Benutzer-Todos löschen
    const Todo = require('../models/Todo');
    await Todo.deleteMany({ user: req.user.id });
    
    // Alle Benutzer-Links löschen
    const Link = require('../models/Link');
    await Link.deleteMany({ user: req.user.id });
    
    // Benutzer löschen
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ success: true, msg: 'Account wurde erfolgreich gelöscht' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router 