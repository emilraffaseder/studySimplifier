const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: false
      },
      dueTasks: {
        type: Boolean,
        default: true
      },
      newFeatures: {
        type: Boolean,
        default: true
      }
    },
    desktop: {
      enabled: {
        type: Boolean,
        default: false
      },
      dueTasks: {
        type: Boolean,
        default: true
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  }
})

// Passwort hashen vor dem Speichern
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

module.exports = mongoose.model('User', userSchema) 