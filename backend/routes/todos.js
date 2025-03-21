const router = require('express').Router()
const Todo = require('../models/Todo')
const auth = require('../middleware/auth')

// Alle Todos des Benutzers abrufen
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ dueDate: 1 })
    res.json(todos)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// Neues Todo erstellen
router.post('/', auth, async (req, res) => {
  const { title, dueDate, category, color, priority } = req.body

  try {
    const newTodo = new Todo({
      title,
      dueDate,
      category,
      color,
      priority,
      user: req.user.id
    })

    const todo = await newTodo.save()
    res.json(todo)
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// Todo löschen
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({ msg: 'Todo nicht gefunden' })
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Nicht autorisiert' })
    }

    await todo.deleteOne()
    res.json({ msg: 'Todo entfernt' })
  } catch (err) {
    res.status(500).send('Server Error')
  }
})

// Todo aktualisieren
router.put('/:id', auth, async (req, res) => {
  const { completed, title, dueDate, category, color, priority } = req.body
  
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({ msg: 'Todo nicht gefunden' })
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Nicht autorisiert' })
    }

    // Aktualisiere die Felder, die im Request enthalten sind
    if (completed !== undefined) todo.completed = completed
    if (title) todo.title = title
    if (dueDate !== undefined) todo.dueDate = dueDate
    if (category) todo.category = category
    if (color) todo.color = color
    if (priority) todo.priority = priority

    await todo.save()
    res.json(todo)
  } catch (err) {
    console.error('Error updating todo:', err)
    res.status(500).send('Server Error')
  }
})

module.exports = router 