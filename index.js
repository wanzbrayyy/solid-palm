const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');

const app = express();

// --- PERBAIKAN 1: NAIKKAN LIMIT PAYLOAD (Untuk fix Error 413) ---
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
  origin: '*', // Izinkan akses dari mana saja (bisa diperketat nanti)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const MONGO_URI = "mongodb+srv://maverickuniverse405:1m8MIgmKfK2QwBNe@cluster0.il8d4jx.mongodb.net/wanz_db?appName=Cluster0";

// Koneksi Database dengan Error Handling Lebih Baik
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- SCHEMAS (Tetap Sama) ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, default: 'User Dev' },
  avatar: { type: String, default: '' }, // Base64 string bisa panjang
  tier: { type: String, default: 'Free' },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  model: String,
  messages: Array,
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);

const JWT_SECRET = 'wanzofc_super_secret_key_2025';

// --- ROUTES ---

// Root Route (Untuk Cek Status Server)
app.get('/api', (req, res) => {
  res.json({ status: 'Server is running', time: new Date() });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // Cek user dulu
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username: username || 'User Dev' });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
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
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- PERBAIKAN 2: SETUP 2FA (Fix Error 500) ---
app.post('/api/auth/setup-2fa', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate Secret
    const secret = authenticator.generateSecret();
    
    // Update User dengan Secret (Belum enable true)
    user.twoFactorSecret = secret;
    await user.save();

    // Generate QR
    const otpauth = authenticator.keyuri(user.email, 'Wanzofc AI', secret);
    const imageUrl = await qrcode.toDataURL(otpauth);

    res.json({ qrCode: imageUrl, secret: secret });
  } catch (err) {
    console.error("Setup 2FA Error:", err); // Log error ke console Vercel
    res.status(500).json({ error: 'Internal Server Error during 2FA Setup' });
  }
});

// VERIFY 2FA SETUP
app.post('/api/auth/verify-2fa-setup', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = authenticator.check(code, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP Code' });

    user.is2FAEnabled = true;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VERIFY 2FA LOGIN
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = authenticator.check(code, user.twoFactorSecret);
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP Code' });

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

// UPDATE PROFILE
app.put('/api/user/profile', async (req, res) => {
  const { token, email, password, avatar, username, is2FAEnabled } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const updateData = { email, username };
    
    // Hanya update avatar jika dikirim (untuk hemat bandwidth)
    if (avatar) updateData.avatar = avatar;
    
    // Handle toggle 2FA manual (jika user mematikan)
    if (typeof is2FAEnabled === 'boolean') updateData.is2FAEnabled = is2FAEnabled;

    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true });
    
    res.json({
      id: user._id, email: user.email, username: user.username,
      tier: user.tier, avatar: user.avatar, is2FAEnabled: user.is2FAEnabled
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(401).json({ error: 'Unauthorized or Invalid Data' });
  }
});

// CRUD CHATS
app.get('/api/chats', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const chats = await Chat.find({ userId: decoded.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) { res.status(401).json({ error: 'Invalid Token' }); }
});

app.post('/api/chats', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { id, title, model, messages } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let chat;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      chat = await Chat.findByIdAndUpdate(id, { messages, updatedAt: Date.now() }, { new: true });
    } else {
      chat = new Chat({ userId: decoded.id, title: title || 'New Chat', model, messages });
      await chat.save();
    }
    res.json(chat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/chats/:id', async (req, res) => {
  try { await Chat.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// IMPORTANT FOR VERCEL
module.exports = app;