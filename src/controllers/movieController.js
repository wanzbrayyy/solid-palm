const { makeApiRequest } = require('../utils/movieboxClient');
const axios = require('axios');

const formatMovieItem = (item) => ({
    videoId: item.id || item.subjectId,
    title: item.title,
    cover: item.cover?.url || item.stills?.url || 'https://i.ibb.co/6Hwz2p6/placeholder.png',
    videoUrl: null,
    views: item.viewCount ? `${(item.viewCount / 1000).toFixed(1)}K` : '0',
    duration: item.duration || 'N/A',
    type: item.domainType === 1 ? 'movie' : 'series'
});

exports.getHomeData = async (req, res) => {
    try {
        const response = await makeApiRequest('/wefeed-h5-bff/web/home');
        const rawData = response.data?.data || {};

        let trending = [];
        let recommended = [];
        let anime = [];

        if (rawData.modules) {
            rawData.modules.forEach(mod => {
                if (mod.items && mod.items.length > 0) {
                    const formattedItems = mod.items.map(formatMovieItem);
                    if (mod.moduleName === 'Trending' || mod.moduleId === 1) {
                        trending = formattedItems;
                    } else if (mod.moduleName?.includes('Anime') || mod.moduleId === 3) {
                        anime = formattedItems;
                    } else {
                        recommended.push(...formattedItems);
                    }
                }
            });
        }

        if (trending.length === 0) {
            const trendRes = await makeApiRequest('/wefeed-h5-bff/web/subject/trending', {
                params: { page: 0, perPage: 15 }
            });
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
        res.status(500).json({
            success: false,
            message: error.message,
            data: { trending: [], anime: [], recommended: [] }
        });
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
                    size: file.size
                }));

                if (sources.length > 0) {
                    finalVideoUrl = sources[sources.length - 1].videoUrl;
                }
            } catch (err) {
                // Ignore source fetch errors
            }
        }

        const movieData = {
            videoId: subject.id,
            title: subject.title,
            description: subject.intro,
            cover: subject.cover?.url || subject.stills?.url,
            videoUrl: finalVideoUrl,
            sources: sources,
            views: subject.viewCount ? `${(subject.viewCount / 1000).toFixed(1)}K` : 'N/A',
            duration: subject.duration || 'N/A',
            tags: subject.tagList ? subject.tagList.map(t => t.name) : [],
            author: { name: "MovieBox", avatar: "https://i.ibb.co/27ymgy5Z/abmoviev1.jpg" }
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