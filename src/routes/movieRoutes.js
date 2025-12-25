const express = require('express');
const router = express.Router();
const {
    getHomeData,
    searchMovies,
    getVideoDetail,
    proxyDownload
} = require('../controllers/movieController');

router.get('/home', getHomeData);

router.get('/search', searchMovies);

router.get('/video/:id', getVideoDetail);

router.get('/download/*', proxyDownload);

module.exports = router;