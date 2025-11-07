const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
