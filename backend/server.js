const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Verbindung
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB Verbindungsfehler:', err))

// Routen
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/todos', require('./routes/todos'))

const PORT = process.env.BACKEND_PORT || 5001
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`)) 