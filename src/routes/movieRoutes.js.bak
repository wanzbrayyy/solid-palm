const express = require('express');
const router = express.Router();
const { 
  getHomeData, 
  searchMovies, 
  getVideoDetail,
  createMovie 
} = require('../controllers/movieController');

router.get('/home', getHomeData);
router.get('/search', searchMovies);
router.get('/video/:id', getVideoDetail);
router.post('/video', createMovie);

module.exports = router;