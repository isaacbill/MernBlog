const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isPrivate: { type: Boolean, default: false },
  members: [{ type: String }] // userIds for private rooms
});

module.exports = mongoose.model('Room', RoomSchema);
