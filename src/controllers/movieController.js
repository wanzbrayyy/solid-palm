
const Movie = require('../models/movie');

// ... (Kode getHomeData, searchMovies, getVideoDetail biarkan sama) ...
// LANGSUNG SAJA TAMBAHKAN INI DI BAWAH CONTROLLER YANG SUDAH ADA

exports.getHomeData = async (req, res) => {
  try {
    const trending = await Movie.find({ isTrending: true }).limit(10);
    const anime = await Movie.find({ type: 'ogv' }).limit(10);
    const ugc = await Movie.find({ type: 'ugc' }).limit(10);

    res.status(200).json({
      success: true,
      data: { trending, anime, recommended: ugc }
    });
  } catch (error) {
    console.error("Home Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await Movie.find({ title: { $regex: q, $options: 'i' } });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVideoDetail = async (req, res) => {
  try {
    const movie = await Movie.findOne({ videoId: req.params.id });
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- TAMBAHAN KHUSUS UNTUK MEMPERBAIKI DATA DI VERCEL ---
exports.seedDatabase = async (req, res) => {
  try {
    const data = [
      {
        videoId: "2097863",
        title: "Solo Leveling",
        cover: "https://pic.bstarstatic.com/ogv/c8e80c61d5d60eff4a3a8f2f92fe0629e4c36ab0.png@720w_405h_1e_1c_90q",
        videoUrl: "https://www.bilibili.tv/id/play/2097863",
        views: "45.9M Putar",
        duration: "23:40",
        type: "ogv",
        tags: ["Aksi"],
        isTrending: true
      },
      {
        videoId: "34475",
        title: "Haikyu!!",
        cover: "https://pic.bstarstatic.com/ogv/c8e80c61d5d60eff4a3a8f2f92fe0629e4c36ab0.png@720w_405h_1e_1c_90q",
        videoUrl: "https://www.bilibili.tv/id/play/34475",
        views: "122.7M Putar",
        duration: "24:00",
        type: "ogv",
        isTrending: true
      },
      {
        videoId: "4790852412768256",
        title: "DEMON SLAYER S4",
        cover: "https://pic.bstarstatic.com/ugc/6d05a29e50ae2ddc9540aecd1c528954.jpg@720w_405h_1e_1c_90q",
        videoUrl: "https://www.bilibili.tv/id/video/4790852412768256",
        views: "19K",
        duration: "15:27",
        type: "ugc",
        isTrending: false
      }
    ];

    await Movie.deleteMany({});
    await Movie.insertMany(data);

    res.json({ success: true, message: "Database berhasil diisi ulang!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};