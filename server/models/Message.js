const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // room name or combined userId pair for private messages
  from: {
    userId: String,
    name: String
  },
  toUserId: { type: String }, // optional for private messages
  content: { type: String },
  type: { type: String, default: 'text' }, // text | file
  fileMeta: { url: String, originalName: String },
  ts: { type: Date, default: Date.now },
  readBy: [{ type: String }], // userIds who read
  reactions: { type: Map, of: [String] } // reaction -> [userIds]
}, { timestamps: true });

MessageSchema.index({ room: 1, ts: -1 });

module.exports = mongoose.model('Message', MessageSchema);
