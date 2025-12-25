const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import fungsi connect baru
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// PENTING: Middleware agar Vercel tidak memblokir request Frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// PENTING: Panggil koneksi DB di setiap request (karena ini Serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ success: false, error: "Database Connection Failed" });
  }
});

app.use('/api', movieRoutes);

app.get('/', (req, res) => {
  res.json({ status: "Online", message: "Wanzofc Server Ready" });
});

// Export app (Wajib untuk Vercel)
module.exports = app;

// Listen (Hanya untuk local)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}