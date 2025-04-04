const router = require('express').Router()
const Link = require('../models/Link')
const auth = require('../middleware/auth')

// Alle Links des Benutzers abrufen
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(links)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// Neuen Link erstellen
router.post('/', auth, async (req, res) => {
  const { title, url, category, image } = req.body

  try {
    const newLink = new Link({
      title,
      url,
      category,
      image: image || '',
      user: req.user.id
    })

    const link = await newLink.save()
    res.json(link)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// Link aktualisieren
router.put('/:id', auth, async (req, res) => {
  const { title, url, category, image } = req.body

  try {
    let link = await Link.findById(req.params.id)
    
    if (!link) {
      return res.status(404).json({ msg: 'Link nicht gefunden' })
    }

    // Überprüfen ob der Link dem Benutzer gehört
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Nicht autorisiert' })
    }

    // Link-Felder aktualisieren
    link.title = title || link.title
    link.url = url || link.url
    link.category = category || link.category
    link.image = image !== undefined ? image : link.image

    link = await link.save()
    res.json(link)
  } catch (err) {
    console.error('Error updating link:', err)
    res.status(500).send('Server Error')
  }
})

// Link löschen
router.delete('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)
    if (!link) {
      return res.status(404).json({ msg: 'Link nicht gefunden' })
    }

    // Überprüfen ob der Link dem Benutzer gehört
    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Nicht autorisiert' })
    }

    await link.remove()
    res.json({ msg: 'Link entfernt' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

module.exports = router 