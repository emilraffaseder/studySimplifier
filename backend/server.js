const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  })
  next()
})

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}))

// Middleware
app.use(express.json({ limit: '10mb' }))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: err.message || 'Server Error' })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err)
    process.exit(1)
  })

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/links', require('./routes/links'))
app.use('/api/todos', require('./routes/todos'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/admin', require('./routes/admin'))

// Check for due tasks once when server starts
const notificationService = require('./services/notificationService')
setTimeout(() => {
  notificationService.checkAndSendTaskNotifications()
    .then(result => console.log('Initial task notification check:', result))
    .catch(err => console.error('Error on initial task check:', err))
}, 5000) // Wait 5 seconds after server start

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

/*
Required .env variables for email:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
*/ 