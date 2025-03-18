const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token')
  
  if (!token) {
    console.log('Auth middleware: No token provided')
    return res.status(401).json({ msg: 'Kein Token, Zugriff verweigert' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    console.log('Auth middleware: Token verified for user', req.user.id)
    next()
  } catch (err) {
    console.error('Auth middleware: Invalid token', err.message)
    res.status(401).json({ msg: 'Token ist ungültig' })
  }
} 