require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const path = require('path');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const messageRoutes = require('./routes/messages');

const Message = require('./models/Message');
const User = require('./models/User');
const Room = require('./models/Room');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chat-app';
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB (single call)
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1); });

const app = express();
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_URL, methods: ["GET","POST"] } });

// utility: verify token -> returns user payload or null
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// in-memory online tracking: userId -> Set(socketIds)
const online = {}; // { userId: Set(socketId) }
// socketId -> userId
const socketUser = {};

// socket auth via auth token in handshake.auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  const payload = verifyToken(token);
  if (!payload) return next(new Error('unauthorized'));
  socket.user = payload;
  next();
});

io.on('connection', (socket) => {
  const user = socket.user;
  const userId = user._id;
  socketUser[socket.id] = userId;
  online[userId] = online[userId] || new Set();
  online[userId].add(socket.id);

  console.log('socket connected', socket.id, 'user', user.name);

  // join default global room
  socket.join('global');

  // notify presence
  io.emit('presence:update', { userId, online: true, name: user.name });

  // send initial state (recent messages + online users)
  (async () => {
    try {
      const recent = await Message.find({ room: 'global' }).sort({ ts: -1 }).limit(50).lean();
      const onlineList = Object.keys(online);
      socket.emit('init', { recent: recent.reverse(), online: onlineList });
    } catch (err) {
      console.error('Failed to load recent messages', err);
    }
  })();

  // Room join
  socket.on('room:join', async (roomId, cb) => {
    socket.join(roomId);
    if (cb) cb({ ok: true });
    const joinMsg = {
      room: roomId, from: { userId: 'system', name: 'system' }, content: `${user.name} joined ${roomId}`, type: 'system', ts: Date.now()
    };
    io.to(roomId).emit('system:message', joinMsg);
  });

  // Room leave
  socket.on('room:leave', (roomId, cb) => {
    socket.leave(roomId);
    if (cb) cb({ ok: true });
    io.to(roomId).emit('system:message', { room: roomId, from: { userId: 'system', name: 'system' }, content: `${user.name} left`, type: 'system', ts: Date.now() });
  });

  // send message
  // payload = { room, content, type, toUserId? }
  socket.on('message:send', async (payload, ack) => {
    try {
      const room = payload.room || (payload.toUserId ? [userId, payload.toUserId].sort().join(':') : 'global');
      const msg = await Message.create({
        room,
        from: { userId, name: user.name },
        toUserId: payload.toUserId || null,
        content: payload.content || '',
        type: payload.type || 'text',
        fileMeta: payload.fileMeta || null,
        ts: new Date()
      });

      // emit to room
      if (payload.toUserId) {
        // private: send to all sockets of recipient and the sender
        const toSet = online[payload.toUserId] ? Array.from(online[payload.toUserId]) : [];
        toSet.forEach(sid => io.to(sid).emit('message:new', msg));
        socket.emit('message:new', msg);
      } else {
        io.to(room).emit('message:new', msg);
      }

      // ack with message id
      if (ack) ack({ ok: true, id: msg._id });
    } catch (err) {
      console.error(err);
      if (ack) ack({ ok: false });
    }
  });

  // typing indicator
  socket.on('typing', ({ room, isTyping }) => {
    socket.to(room || 'global').emit('typing', { userId, name: user.name, isTyping });
  });

  // read receipt
  socket.on('message:read', async ({ messageId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      if (!msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
        await msg.save();
        io.to(msg.room).emit('message:read', { messageId, userId });
      }
    } catch (e) {
      console.error(e);
    }
  });

  // reaction
  socket.on('message:react', async ({ messageId, reaction }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      const reactions = msg.reactions || new Map();
      const arr = reactions.get(reaction) || [];
      if (!arr.includes(userId)) {
        arr.push(userId);
        reactions.set(reaction, arr);
      }
      msg.reactions = reactions;
      await msg.save();
      io.to(msg.room).emit('message:react', { messageId, reaction, userId });
    } catch (e) {
      console.error(e);
    }
  });

  // disconnect
  socket.on('disconnect', async () => {
    console.log('disconnect', socket.id);
    const uid = socketUser[socket.id];
    delete socketUser[socket.id];
    if (uid && online[uid]) {
      online[uid].delete(socket.id);
      if (online[uid].size === 0) {
        delete online[uid];
        io.emit('presence:update', { userId: uid, online: false });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
