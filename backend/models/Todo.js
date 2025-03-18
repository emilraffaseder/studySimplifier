const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Todo', todoSchema) 