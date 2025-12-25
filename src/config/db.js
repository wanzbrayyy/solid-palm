const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    // Utamakan env var dari Vercel, kalau tidak ada baru pakai string hardcode
    const uri = process.env.MONGO_URI || 'mongodb+srv://maverickuniverse405:1m8MIgmKfK2QwBNe@cluster0.il8d4jx.mongodb.net/wanzofc-tech?appName=Cluster0';
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error DB: ${error.message}`);
    // Jangan process.exit(1) di serverless, nanti crash loop
  }
};

module.exports = connectDB;