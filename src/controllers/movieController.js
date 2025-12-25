const Movie = require('../models/movie');

exports.getHomeData = async (req, res) => {
  try {
    const trending = await Movie.find({ isTrending: true })
      .select('videoId title cover views duration type')
      .limit(10);

    const anime = await Movie.find({ type: 'ogv' })
      .sort({ createdAt: -1 })
      .limit(12);

    const ugc = await Movie.find({ type: 'ugc' })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        trending,
        anime,
        recommended: ugc
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
    }

    const results = await Movie.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).limit(50);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVideoDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({ videoId: id });

    if (!movie) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const related = await Movie.find({ 
      type: movie.type, 
      videoId: { $ne: id } 
    }).limit(10);

    res.status(200).json({
      success: true,
      data: movie,
      related
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      data: newMovie
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};