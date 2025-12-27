const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const app = express();

// 1. LIMIT BODY PARSER (Mencegah Error 413)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. CORS (Izinkan Authorization Header untuk Fix 401)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Title', 'HTTP-Referer']
}));

const MONGO_URI = "mongodb+srv://maverickuniverse405:1m8MIgmKfK2QwBNe@cluster0.il8d4jx.mongodb.net/wanz_db?appName=Cluster0";
const JWT_SECRET = 'wanzofc_super_secret_key_2025';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, default: 'User Dev' },
  avatar: { type: String, default: '' },
  tier: { type: String, default: 'Free' },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  model: String,
  messages: Array,
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);

// --- MIDDLEWARE AUTH (FIX ERROR 401) ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Format harus: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("❌ Auth Failed: No Token Provided");
    return res.status(401).json({ error: 'Access denied. No token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: '...' }
    next();
  } catch (err) {
    console.log("❌ Auth Failed: Invalid Token");
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// --- ROUTES ---

app.get('/api', (req, res) => res.json({ status: 'Server Running' }));

// AUTH: REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username: username || 'User Dev' });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH: LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    if (user.is2FAEnabled) {
      return res.json({ require2FA: true, userId: user._id });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id, email: user.email, username: user.username,
        tier: user.tier, avatar: user.avatar, is2FAEnabled: user.is2FAEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH: SETUP 2FA (FIX ERROR 400)
app.post('/api/auth/setup-2fa', async (req, res) => {
  const { userId } = req.body;
  
  // Debug Log
  console.log("2FA Setup Request Body:", req.body);

  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing in request body' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found in DB' });

    const secret = authenticator.generateSecret();
    user.twoFactorSecret = secret;
    await user.save();

    const otpauth = authenticator.keyuri(user.email, 'Wanzofc AI', secret);
    const imageUrl = await qrcode.toDataURL(otpauth);

    res.json({ qrCode: imageUrl, secret: secret });
  } catch (err) {
    console.error("2FA Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// AUTH: VERIFY 2FA SETUP
app.post('/api/auth/verify-2fa-setup', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    const isValid = authenticator.check(code, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ error: 'Invalid Code' });

    user.is2FAEnabled = true;
    await user.save();
    
    // Kirim token baru supaya user langsung login
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { ...user._doc, is2FAEnabled: true } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUTH: VERIFY 2FA LOGIN
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    const isValid = authenticator.check(code, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ error: 'Invalid Code' });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user._id, email: user.email, username: user.username,
        tier: user.tier, avatar: user.avatar, is2FAEnabled: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USER: PROFILE (Pakai Middleware)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { email, password, avatar, username, is2FAEnabled } = req.body;
  try {
    const updateData = { email, username };
    if (avatar) updateData.avatar = avatar;
    if (typeof is2FAEnabled === 'boolean') updateData.is2FAEnabled = is2FAEnabled;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json({
      id: user._id, email: user.email, username: user.username,
      tier: user.tier, avatar: user.avatar, is2FAEnabled: user.is2FAEnabled
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHATS: GET (Pakai Middleware)
app.get('/api/chats', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHATS: SAVE (Pakai Middleware)
app.post('/api/chats', authenticateToken, async (req, res) => {
  const { id, title, model, messages } = req.body;
  try {
    let chat;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      chat = await Chat.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { messages, updatedAt: Date.now() }, 
        { new: true }
      );
    } 
    
    if (!chat) {
      chat = new Chat({ userId: req.user.id, title: title || 'New Chat', model, messages });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error("Save Chat Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// CHATS: DELETE
app.delete('/api/chats/:id', authenticateToken, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;