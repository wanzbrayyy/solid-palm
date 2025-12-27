const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const app = express();

// --- 1. CONFIGURATION ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Update CORS: Izinkan semua header eksplisit
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Title', 'HTTP-Referer'],
  credentials: true
}));

// Handle Preflight Request Manual (Penting untuk Vercel)
app.options('*', cors());

// --- 2. DB CONNECTION ---
const MONGO_URI = "mongodb+srv://maverickuniverse405:1m8MIgmKfK2QwBNe@cluster0.il8d4jx.mongodb.net/wanz_db?appName=Cluster0";
const JWT_SECRET = 'wanzofc_super_secret_key_2025';

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  }
};

// --- 3. SCHEMAS ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, default: 'User Dev' },
  avatar: { type: String, default: '' },
  tier: { type: String, default: 'Free' },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  createdAt: { type: Date, default: Date.now }
}));

const Chat = mongoose.models.Chat || mongoose.model('Chat', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  model: String,
  messages: Array,
  updatedAt: { type: Date, default: Date.now }
}));

// --- 4. MIDDLEWARE AUTH (DEBUG MODE) ---
const authenticateToken = (req, res, next) => {
  // Ambil header dengan case-insensitive
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  // LOGGING UTAMA: Cek ini di Vercel Logs nanti
  console.log(`[AUTH CHECK] Method: ${req.method} Path: ${req.path}`);
  console.log(`[AUTH CHECK] Header: ${authHeader ? 'Present' : 'MISSING'}`);

  if (!authHeader) {
    return res.status(401).json({ error: 'No Authorization Header' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Token format invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(`[AUTH ERROR] Verification failed: ${err.message}`);
      return res.status(401).json({ error: 'Token invalid or expired' });
    }
    req.user = user;
    next();
  });
};

// --- 5. ROUTES ---

app.get('/', (req, res) => res.send('Wanzofc API Ready'));
app.get('/api', (req, res) => res.json({ status: 'OK' }));

// AUTH
app.post('/api/auth/register', async (req, res) => {
  await connectDB();
  try {
    const { email, password, username } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username: username || 'User Dev' });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ error: 'Invalid credentials' });
    }
    if (user.is2FAEnabled) return res.json({ require2FA: true, userId: user._id });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, tier: user.tier, avatar: user.avatar, is2FAEnabled: user.is2FAEnabled } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2FA
app.post('/api/auth/setup-2fa', async (req, res) => {
  await connectDB();
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID missing' });
  try {
    const user = await User.findById(userId);
    const secret = authenticator.generateSecret();
    user.twoFactorSecret = secret;
    await user.save();
    const imageUrl = await qrcode.toDataURL(authenticator.keyuri(user.email, 'Wanzofc AI', secret));
    res.json({ qrCode: imageUrl, secret });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/verify-2fa-setup', async (req, res) => {
  await connectDB();
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!authenticator.check(code, user.twoFactorSecret)) return res.status(400).json({ error: 'Invalid Code' });
    user.is2FAEnabled = true;
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/verify-2fa', async (req, res) => {
  await connectDB();
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!authenticator.check(code, user.twoFactorSecret)) return res.status(400).json({ error: 'Invalid Code' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username, tier: user.tier, avatar: user.avatar, is2FAEnabled: true } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PROTECTED ROUTES
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  await connectDB();
  try {
    const { email, password, avatar, username, is2FAEnabled } = req.body;
    const updateData = { email, username };
    if (avatar) updateData.avatar = avatar;
    if (typeof is2FAEnabled === 'boolean') updateData.is2FAEnabled = is2FAEnabled;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/chats', authenticateToken, async (req, res) => {
  await connectDB();
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/chats', authenticateToken, async (req, res) => {
  await connectDB();
  try {
    const { id, title, model, messages } = req.body;
    let chat;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      chat = await Chat.findOneAndUpdate({ _id: id, userId: req.user.id }, { messages, updatedAt: Date.now() }, { new: true });
    }
    if (!chat) {
      chat = new Chat({ userId: req.user.id, title: title || 'New Chat', model, messages });
      await chat.save();
    }
    res.json(chat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chats/:id', authenticateToken, async (req, res) => {
  await connectDB();
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = app;