const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// 1. Konfigurasi CORS (PENTING)
// Izinkan akses dari mana saja, termasuk range headers untuk video streaming
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Range', 'Content-Length']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Routing Utama
app.use('/api', movieRoutes);

// 3. Root Endpoint Sederhana
app.get('/', (req, res) => {
  res.json({ 
    status: 'Online', 
    message: 'Wanzofc Film API (MovieBox Version) is Running' 
  });
});

// 4. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: err.message 
  });
});

// 5. Server Listener
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;