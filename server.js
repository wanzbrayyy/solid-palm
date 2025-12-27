const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// KONEKSI MONGODB (Sesuai request)
const MONGO_URI = "mongodb+srv://maverickuniverse405:1m8MIgmKfK2QwBNe@cluster0.il8d4jx.mongodb.net/wanz_db?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  username: { type: String, default: 'User Dev' },
  avatar: { type: String, default: '' },
  tier: { type: String, default: 'Free' }, // Free / Pro
  is2FAEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  model: String,
  messages: Array, // Array of { role, text }
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);

const JWT_SECRET = 'wanzofc_super_secret_key_2025';

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ 
      email, 
      password: hashedPassword, 
      username: username || 'User Dev' 
    });
    
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    // Cek 2FA
    if (user.is2FAEnabled) {
      return res.json({ require2FA: true, userId: user._id });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        tier: user.tier,
        avatar: user.avatar,
        is2FAEnabled: user.is2FAEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. VERIFY 2FA (Simple Mockup for Demo)
// Di production, gunakan library 'otplib' untuk validasi kode authenticator asli
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { userId, code } = req.body;
  
  // Hardcoded '123456' untuk simulasi sukses
  if (code === '123456') {
    const user = await User.findById(userId);
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        tier: user.tier,
        avatar: user.avatar,
        is2FAEnabled: true
      }
    });
  }
  
  res.status(400).json({ error: 'Invalid 2FA Code' });
});

// 4. UPDATE PROFILE
app.put('/api/user/profile', async (req, res) => {
  const { token, email, password, avatar, is2FAEnabled, username } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const updateData = { email, avatar, is2FAEnabled, username };

    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true });
    
    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      tier: user.tier,
      avatar: user.avatar,
      is2FAEnabled: user.is2FAEnabled
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// 5. GET CHATS
app.get('/api/chats', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const chats = await Chat.find({ userId: decoded.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 6. SAVE CHAT
app.post('/api/chats', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { id, title, model, messages } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let chat;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      // Update existing
      chat = await Chat.findByIdAndUpdate(
        id, 
        { messages, updatedAt: Date.now() }, 
        { new: true }
      );
    } else {
      // Create new
      chat = new Chat({
        userId: decoded.id,
        title: title || 'New Chat',
        model,
        messages
      });
      await chat.save();
    }
    
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. DELETE CHAT
app.delete('/api/chats/:id', async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server (Jika local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for Vercel