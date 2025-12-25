const { makeApiRequest } = require('../utils/movieboxClient');
const axios = require('axios');

// HELPER BARU: Membersihkan data dan menghilangkan "N/A"
const formatMovieItem = (item) => {
    const movie = item.subject || item;
    const views = movie.viewCount || movie.imdbRatingCount || 0;
    
    // Konversi durasi dari detik ke format "jam menit" jika tersedia
    let durationString = 'N/A';
    if (movie.duration && movie.duration > 0) {
        const totalMinutes = Math.floor(movie.duration / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            durationString = `${hours}h ${minutes}m`;
        } else {
            durationString = `${minutes}m`;
        }
    }

    return {
        videoId: movie.subjectId || movie.id,
        title: movie.title || 'Untitled',
        cover: movie.cover?.url || movie.stills?.url || 'https://i.ibb.co/6Hwz2p6/placeholder.png',
        views: views > 1000 ? `${(views / 1000).toFixed(1)}K` : String(views),
        duration: durationString,
        type: movie.subjectType === 1 ? 'Movie' : 'Series'
    };
};

// CONTROLLER BARU: Lebih Cerdas dan Dinamis
exports.getHomeData = async (req, res) => {
    try {
        const response = await makeApiRequest('/wefeed-h5-bff/web/home');
        const rawData = response.data?.data || {};

        const homeSections = [];

        // 1. Ambil Banner sebagai "Trending"
        if (rawData.operatingList) {
            const bannerModule = rawData.operatingList.find(op => op.type === "BANNER");
            if (bannerModule?.banner?.items) {
                homeSections.push({
                    title: "Sedang Populer",
                    items: bannerModule.banner.items.map(formatMovieItem)
                });
            }
        }

        // 2. Ekstrak Semua Modul dari "homeList"
        if (rawData.homeList && rawData.homeList.length > 0) {
            rawData.homeList.forEach(module => {
                // Pastikan modul punya nama dan punya film di dalamnya
                if (module.title && module.subjects && module.subjects.length > 0) {
                    homeSections.push({
                        title: module.title,
                        items: module.subjects.map(formatMovieItem)
                    });
                }
            });
        }
        
        // 3. Fallback: Jika tidak ada modul sama sekali, panggil API Trending manual
        if (homeSections.length < 2) {
            const trendRes = await makeApiRequest('/wefeed-h5-bff/web/subject/trending', { 
                params: { page: 0, perPage: 20 } 
            });
            if (trendRes.data?.data?.subjectList) {
                homeSections.push({
                    title: "Baru Ditambahkan",
                    items: trendRes.data.data.subjectList.map(formatMovieItem)
                });
            }
        }
        
        // Response format baru yang lebih dinamis
        res.json({
            success: true,
            // 'data' sekarang berisi array of sections, bukan object statis
            data: homeSections 
        });

    } catch (error) {
        console.error('Home Critical Error:', error.message);
        res.status(500).json({
            success: false,
            message: "Gagal memuat data dari semua server.",
            data: [] // Return array kosong
        });
    }
};

// Controller lain (Search, Detail, Proxy) tetap sama karena sudah cukup baik

exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.q || req.params.query;
        if (!query) return res.json({ success: true, data: [] });

        const payload = {
            keyword: query,
            page: 1,
            perPage: 24,
            subjectType: 0
        };

        const response = await makeApiRequest('/wefeed-h5-bff/web/subject/search', {
            method: 'POST',
            data: payload
        });

        const items = response.data?.data?.items || [];
        res.json({
            success: true,
            data: items.map(formatMovieItem)
        });

    } catch (error) {
        res.status(500).json({ success: false, data: [] });
    }
};

exports.getVideoDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const infoResponse = await makeApiRequest('/wefeed-h5-bff/web/subject/detail', {
            params: { subjectId: id }
        });
        const subject = infoResponse.data?.data?.subject;

        if (!subject) throw new Error("Video not found");

        const detailPath = subject.detailPath;
        let sources = [];
        let finalVideoUrl = null;

        if (detailPath) {
            const refererUrl = `https://fmoviesunblocked.net/spa/videoPlayPage/movies/${detailPath}?id=${id}&type=/movie/detail`;
            try {
                const sourceResponse = await makeApiRequest('/wefeed-h5-bff/web/subject/download', {
                    params: { subjectId: id, se: 0, ep: 0 },
                    headers: { 'Referer': refererUrl, 'Origin': 'https://fmoviesunblocked.net' }
                });

                const downloads = sourceResponse.data?.data?.downloads || [];
                sources = downloads.map(file => ({
                    quality: file.resolution || 'Original',
                    videoUrl: `${req.protocol}://${req.get('host')}/api/download/${encodeURIComponent(file.url)}`,
                    size: file.size ? `${(file.size / 1024 / 1024).toFixed(0)} MB` : ''
                }));

                if (sources.length > 0) {
                    finalVideoUrl = sources[sources.length - 1].videoUrl;
                }
            } catch (err) {
                // Ignore source error
            }
        }

        const movieData = {
            videoId: subject.id,
            title: subject.title,
            description: subject.intro || 'No description available.',
            cover: subject.cover?.url || subject.stills?.url,
            videoUrl: finalVideoUrl,
            sources: sources,
            views: subject.viewCount ? `${(subject.viewCount / 1000).toFixed(1)}K` : '0',
            duration: subject.duration || '',
            tags: subject.tagList ? subject.tagList.map(t => t.name) : [],
            author: { name: "Wanzofc", avatar: "https://i.ibb.co/27ymgy5Z/abmoviev1.jpg" }
        };

        res.json({ success: true, data: movieData });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.proxyDownload = async (req, res) => {
    try {
        const targetUrl = decodeURIComponent(req.params[0]);
        if (!targetUrl) return res.status(400).send("Invalid URL");

        const headers = {
            'User-Agent': 'okhttp/4.12.0',
            'Referer': 'https://fmoviesunblocked.net/',
        };
        if (req.headers.range) {
            headers['Range'] = req.headers.range;
        }

        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'stream',
            headers: headers
        });

        const head = {
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length'],
            'Accept-Ranges': 'bytes'
        };
        
        if (response.status === 206) {
            head['Content-Range'] = response.headers['content-range'];
            res.writeHead(206, head);
        } else {
            res.writeHead(200, head);
        }

        response.data.pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Stream Error");
    }
};