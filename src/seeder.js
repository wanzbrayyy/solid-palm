const mongoose = require('mongoose');
const Movie = require('./models/movie');
const connectDB = require('./config/db');

const bilibiliData = [
  {
    videoId: "2097863",
    title: "Solo Leveling",
    cover: "https://pic.bstarstatic.com/ogv/c8e80c61d5d60eff4a3a8f2f92fe0629e4c36ab0.png@720w_405h_1e_1c_90q",
    videoUrl: "https://www.bilibili.tv/id/play/2097863",
    views: "45.9M Putar",
    duration: "23:40",
    type: "ogv",
    tags: ["Adaptasi komik", "Aksi"],
    author: {
      name: "Bstation Official",
      avatar: "https://p.bstarstatic.com/fe-static/bstar-web/assets/top_logo.svg"
    },
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
    tags: ["Adaptasi komik", "Berjuang", "Tamat"],
    author: {
      name: "Bstation Official",
      avatar: "https://p.bstarstatic.com/fe-static/bstar-web/assets/top_logo.svg"
    },
    isTrending: true
  },
  {
    videoId: "2246170",
    title: "One Punch Man S3",
    cover: "https://pic.bstarstatic.com/ogv/c3c551816d386eb945647e685f7b7c50a743767a.png@720w_405h_1e_1c_90q",
    videoUrl: "https://www.bilibili.tv/id/play/2246170",
    views: "8.1M Putar",
    duration: "23:50",
    type: "ogv",
    tags: ["Adaptasi komik", "Berjuang", "Diperbarui ke E 35"],
    author: {
      name: "Bstation Official",
      avatar: "https://p.bstarstatic.com/fe-static/bstar-web/assets/top_logo.svg"
    },
    isTrending: true
  },
  {
    videoId: "2211872",
    title: "(Sub ID)Istriku Tiga, Takdirku Gila",
    cover: "https://pic.bstarstatic.com/ogv/a60ed120bff3ca83c7bd0311a345321458cf2190.jpg@720w_405h_1e_1c_90q",
    videoUrl: "https://www.bilibili.tv/id/play/2211872",
    views: "3.4M Putar",
    duration: "15:30",
    type: "ogv",
    tags: ["Kostum", "Boys Channel", "Tamat"],
    author: {
      name: "Bstation Official",
      avatar: "https://p.bstarstatic.com/fe-static/bstar-web/assets/top_logo.svg"
    },
    isTrending: false
  },
  {
    videoId: "4790852412768256",
    title: "DEMON SLAYER - KIMETSU NO YAIBA SEASON 4 EPISODE 8",
    cover: "https://pic.bstarstatic.com/ugc/6d05a29e50ae2ddc9540aecd1c528954.jpg@720w_405h_1e_1c_90q",
    videoUrl: "https://www.bilibili.tv/id/video/4790852412768256",
    views: "19.4K Ditonton",
    duration: "15:27",
    type: "ugc",
    tags: ["Anime", "UGC"],
    author: {
      name: "KelasManga",
      avatar: "https://pic.bstarstatic.com/face/5984ebb631a480b216f0a08437914804e237ca60.jpg@72w_72h_1e_1c_90q"
    },
    isTrending: false
  },
  {
    videoId: "4787418763892224",
    title: "tinggal nunggu demon slayer s4 release 😆😆",
    cover: "https://pic.bstarstatic.com/ugc/6cd9fcccb30264a0cf5493bed8aeeb01.jpg@720w_405h_1e_1c_90q",
    videoUrl: "https://www.bilibili.tv/id/video/4787418763892224",
    views: "967 Ditonton",
    duration: "00:18",
    type: "ugc",
    tags: ["Anime", "Short"],
    author: {
      name: "Yoriichi出る",
      avatar: "https://pic.bstarstatic.com/face/f15c6b8085a93e677c7be8220b44cde833dee213.jpg@72w_72h_1e_1c_90q"
    },
    isTrending: false
  }
];

const importData = async () => {
  try {
    await connectDB();
    
    await Movie.deleteMany(); 
    console.log('Data lama dihapus...');

    await Movie.insertMany(bilibiliData);
    console.log('Data Bilibili berhasil diimport!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();