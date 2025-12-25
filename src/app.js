const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
connectDB();
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Routing
app.use('/api', movieRoutes);

// 4. Root Endpoint (Untuk Cek Server Hidup/Mati)
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Server Wanzofc Film Berjalan!',
    timestamp: new Date()
  });
});

// 5. Error Handling Terakhir
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan di server',
    error: err.message 
  });
});

// 6. Export untuk Vercel & Listen untuk Local
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;