const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    text: true
  },
  cover: {
    type: String, 
    required: true
  },
  videoUrl: {
    type: String, // Ini akan menyimpan URL Bilibili (//www.bilibili.tv...)
    required: true
  },
  duration: String,
  views: String,
  type: {
    type: String,
    enum: ['ogv', 'ugc'],
    default: 'ugc'
  },
  tags: [String],
  author: {
    name: String,
    avatar: String
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);