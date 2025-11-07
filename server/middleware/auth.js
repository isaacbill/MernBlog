const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    // optional: refresh lastSeen
    await User.findOneAndUpdate({ _id: payload._id }, { lastSeen: new Date() }).catch(()=>{});
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
