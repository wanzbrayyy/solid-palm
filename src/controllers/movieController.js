const { makeApiRequest, HOST_URL } = require('../utils/movieboxClient');
const axios = require('axios'); 
const formatMovieItem = (item) => ({
    videoId: item.id || item.subjectId,
    title: item.title,
    cover: item.cover?.url || item.stills?.url,
    videoUrl: null, // Detail page yang akan ambil ini
    views: item.viewCount ? `${(item.viewCount / 1000).toFixed(1)}K` : 'N/A',
    duration: 'N/A', // Moviebox list tidak selalu ada durasi
    type: item.domainType === 1 ? 'movie' : 'series',
    isTrending: false
});

exports.getHomeData = async (req, res) => {
    try {
        // Ambil data Home dari MovieBox
        const response = await makeApiRequest(`${HOST_URL}/wefeed-h5-bff/web/home`);
        const rawData = response.data?.data || {};

        // Mapping data MovieBox ke format Frontend kita (Trending, Anime, Recommended)
        // Kita ambil beberapa section dari response MovieBox
        
        let trending = [];
        let recommended = [];
        let anime = [];

        // Iterasi modul home MovieBox
        if (rawData.modules) {
            rawData.modules.forEach(mod => {
                if (mod.items && mod.items.length > 0) {
                    const formattedItems = mod.items.map(formatMovieItem);
                    
                    if (mod.moduleName === 'Trending' || mod.moduleId === 1) {
                        trending = formattedItems;
                    } else if (mod.moduleName?.includes('Anime') || mod.moduleId === 3) {
                        anime = formattedItems;
                    } else {
                        recommended = [...recommended, ...formattedItems];
                    }
                }
            });
        }

        // Fallback jika trending kosong, ambil API trending khusus
        if (trending.length === 0) {
            const trendRes = await makeApiRequest(`${HOST_URL}/wefeed-h5-bff/web/subject/trending`, { params: { page: 0, perPage: 10 } });
            if (trendRes.data?.data?.items) {
                trending = trendRes.data.data.items.map(formatMovieItem);
            }
        }

        res.json({
            success: true,
            data: {
                trending: trending.slice(0, 10),
                anime: anime.slice(0, 10),
                recommended: recommended.slice(0, 20)
            }
        });

    } catch (error) {
        console.error('Home Error:', error.message);
        res.json({ success: false, data: { trending: [], anime: [], recommended: [] } });
    }
};

exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.q || req.params.query;
        if (!query) return res.json({ success: true, data: [] });

        const payload = {
            keyword: query,
            page: 1,
            perPage: 24,
            subjectType: 0 // ALL
        };

        const response = await makeApiRequest(`${HOST_URL}/wefeed-h5-bff/web/subject/search`, {
            method: 'POST',
            data: payload
        });

        const items = response.data?.data?.items || [];
        const formattedResults = items.map(formatMovieItem);

        res.json({
            success: true,
            data: formattedResults
        });

    } catch (error) {
        console.error('Search Error:', error.message);
        res.json({ success: false, data: [] });
    }
};

exports.getVideoDetail = async (req, res) => {
    try {
        const { id } = req.params; // movieId
        
        // 1. Get Detail Info
        const infoResponse = await makeApiRequest(`${HOST_URL}/wefeed-h5-bff/web/subject/detail`, {
            method: 'GET',
            params: { subjectId: id }
        });
        const subject = infoResponse.data?.data?.subject;

        if (!subject) throw new Error("Video not found");

        // 2. Get Sources (Resolusi)
        // Default Season 0 Episode 0 untuk Movie
        const detailPath = subject.detailPath;
        let sources = [];
        let finalVideoUrl = null;

        if (detailPath) {
            const refererUrl = `https://fmoviesunblocked.net/spa/videoPlayPage/movies/${detailPath}?id=${id}&type=/movie/detail`;
            
            try {
                const sourceResponse = await makeApiRequest(`${HOST_URL}/wefeed-h5-bff/web/subject/download`, {
                    method: 'GET',
                    params: { subjectId: id, se: 0, ep: 0 },
                    headers: {
                        'Referer': refererUrl,
                        'Origin': 'https://fmoviesunblocked.net'
                    }
                });

                const downloads = sourceResponse.data?.data?.downloads || [];
                
                // Map sources dan buat PROXY URL
                sources = downloads.map(file => ({
                    quality: file.resolution || 'Original',
                    // Disini kita buat URL Proxy ke server kita sendiri
                    videoUrl: `${req.protocol}://${req.get('host')}/api/download/${encodeURIComponent(file.url)}`,
                    size: file.size
                }));

                // Ambil kualitas terbaik (terakhir di array biasanya)
                if (sources.length > 0) {
                    finalVideoUrl = sources[sources.length - 1].videoUrl;
                }

            } catch (err) {
                console.log("Source Error:", err.message);
            }
        }

        // Format data untuk Frontend Aurelia
        const movieData = {
            videoId: subject.id,
            title: subject.title,
            description: subject.intro,
            cover: subject.cover?.url || subject.stills?.url,
            videoUrl: finalVideoUrl, // URL Proxy yang aman
            sources: sources,
            views: subject.viewCount ? `${(subject.viewCount / 1000).toFixed(1)}K` : 'N/A',
            duration: subject.duration || 'N/A',
            tags: subject.tagList ? subject.tagList.map(t => t.name) : [],
            author: {
                name: "MovieBox API",
                avatar: "https://i.ibb.co/27ymgy5Z/abmoviev1.jpg"
            }
        };

        res.json({
            success: true,
            data: movieData,
            related: [] // Bisa ditambahkan logic related jika perlu
        });

    } catch (error) {
        console.error('Detail Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// CONTROLLER KHUSUS: Proxy Video Streaming
// Ini untuk mem-bypass blokir CDN (403 Forbidden)
exports.proxyDownload = async (req, res) => {
    try {
        // Decode URL asli dari parameter
        const targetUrl = decodeURIComponent(req.params[0]);
        
        if (!targetUrl) return res.status(400).send("Invalid URL");

        // Header Khusus untuk Bypass
        const headers = {
            'User-Agent': 'okhttp/4.12.0',
            'Referer': 'https://fmoviesunblocked.net/',
            'Origin': 'https://fmoviesunblocked.net',
            'Accept': '*/*',
            'Accept-Encoding': 'identity' // Penting untuk streaming
        };

        if (req.headers.range) {
            headers['Range'] = req.headers.range;
        }

        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'stream',
            headers: headers,
            timeout: 30000
        });

        // Forward headers dari CDN ke Client
        const head = {
            'Content-Type': response.headers['content-type'],
            'Cache-Control': 'public, max-age=3600',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*'
        };

        if (response.status === 206) {
            head['Content-Range'] = response.headers['content-range'];
            head['Content-Length'] = response.headers['content-length'];
            res.writeHead(206, head);
        } else {
            head['Content-Length'] = response.headers['content-length'];
            res.writeHead(200, head);
        }

        // Pipe stream (Hemat RAM)
        response.data.pipe(res);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        if (!res.headersSent) res.status(500).send("Stream Error");
    }
};