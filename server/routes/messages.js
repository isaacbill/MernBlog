const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Pagination endpoint
// GET /messages?room=global&before=<iso>&limit=50
router.get('/', auth, async (req, res) => {
  try {
    const room = req.query.room || 'global';
    const before = req.query.before ? new Date(req.query.before) : new Date();
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const msgs = await Message.find({ room, ts: { $lt: before } }).sort({ ts: -1 }).limit(limit).lean();
    res.json({ messages: msgs.reverse() }); // return ascending
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
