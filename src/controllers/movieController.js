const { makeApiRequest } = require('../utils/movieboxClient');
const axios = require('axios');

const formatMovieItem = (item) => {
    if (!item) return null;
    const movie = item.subject || item;
    const views = movie.viewCount || movie.imdbRatingCount || 0;
    
    let durationString = '';
    if (movie.duration && movie.duration > 0) {
        const totalMinutes = Math.floor(movie.duration / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        durationString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
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

exports.getHomeData = async (req, res) => {
    try {
        const response = await makeApiRequest('/wefeed-h5-bff/web/home');
        const rawData = response.data?.data || {};
        const homeSections = [];

        if (rawData.operatingList) {
            rawData.operatingList.forEach(module => {
                const hasBanner = module.type === "BANNER" && module.banner?.items?.length > 0;
                const hasSubjects = module.type === "SUBJECTS_MOVIE" && module.subjects?.length > 0;
                if (hasBanner) {
                    homeSections.push({ title: "Populer Minggu Ini", items: module.banner.items.map(formatMovieItem).filter(Boolean) });
                } else if (hasSubjects) {
                    homeSections.push({ title: module.title, items: module.subjects.map(formatMovieItem).filter(Boolean) });
                }
            });
        }
        
        if (homeSections.length < 2) {
             const trendRes = await makeApiRequest('/wefeed-h5-bff/web/subject/trending', { params: { page: 0, perPage: 20 } });
            if (trendRes.data?.data?.subjectList) {
                homeSections.push({ title: "Lagi Trending", items: trendRes.data.data.subjectList.map(formatMovieItem).filter(Boolean) });
            }
        }
        
        res.json({ success: true, data: homeSections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: [] });
    }
};

exports.searchMovies = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ success: true, data: [] });

        const response = await makeApiRequest('/wefeed-h5-bff/web/subject/search', {
            method: 'POST',
            data: { keyword: query, page: 1, perPage: 30, subjectType: 0 }
        });

        const items = response.data?.data?.items || [];
        res.json({ success: true, data: items.map(formatMovieItem).filter(Boolean) });

    } catch (error) {
        res.status(500).json({ success: false, data: [] });
    }
};

exports.getVideoDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const season = parseInt(req.query.season, 10);
        const episode = parseInt(req.query.episode, 10);

        const infoResponse = await makeApiRequest('/wefeed-h5-bff/web/subject/detail', { params: { subjectId: id } });
        const subject = infoResponse.data?.data?.subject;

        if (!subject) throw new Error("Video not found");
        
        const isSeries = subject.subjectType === 2;
        let activeSeason = isNaN(season) ? 0 : season;
        let activeEpisode = isNaN(episode) ? 0 : episode;
        
        if(isSeries && (isNaN(season) || isNaN(episode)) && subject.episodeGroups?.[0]?.episodeList?.[0]){
            activeSeason = subject.episodeGroups[0].season;
            activeEpisode = subject.episodeGroups[0].episodeList[0].episode;
        } else if (!isSeries) {
            activeSeason = 0;
            activeEpisode = 0;
        }

        let sources = [];
        if (subject.detailPath) {
            const refererUrl = `https://fmoviesunblocked.net/spa/videoPlayPage/movies/${subject.detailPath}?id=${id}&type=/movie/detail`;
            try {
                const sourceResponse = await makeApiRequest('/wefeed-h5-bff/web/subject/download', {
                    params: { subjectId: id, se: activeSeason, ep: activeEpisode },
                    headers: { 'Referer': refererUrl, 'Origin': 'https://fmoviesunblocked.net' }
                });
                const downloads = sourceResponse.data?.data?.downloads || [];
                sources = downloads.map(file => ({
                    quality: file.resolution || 'SD',
                    videoUrl: `${req.protocol}://${req.get('host')}/api/download/${encodeURIComponent(file.url)}`,
                    size: file.size ? `${(file.size / 1024 / 1024).toFixed(0)} MB` : ''
                })).sort((a, b) => parseInt(b.quality) - parseInt(a.quality));
            } catch (err) {
                 // Tetap lanjutkan meskipun source gagal, agar info film tetap tampil
            }
        }
        
        const movieData = {
            videoId: subject.id,
            title: subject.title,
            description: subject.description || 'No description available.',
            cover: subject.cover?.url || subject.stills?.url,
            videoUrl: sources.length > 0 ? sources[0].videoUrl : null,
            sources: sources,
            views: subject.imdbRatingCount ? `${(subject.imdbRatingCount / 1000).toFixed(1)}K` : '0',
            duration: subject.duration ? `${Math.floor(subject.duration / 60)} min` : '',
            tags: subject.tagList?.map(t => t.name) || [],
            author: { name: "Wanzofc Film", avatar: "https://i.ibb.co/27ymgy5Z/abmoviev1.jpg" },
            type: isSeries ? 'Series' : 'Movie',
            episodeGroups: subject.episodeGroups || [],
            activeSeason: activeSeason,
            activeEpisode: activeEpisode,
        };

        const related = infoResponse.data?.data?.recommendList?.map(formatMovieItem).filter(Boolean) || [];
        res.json({ success: true, data: movieData, related });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.proxyDownload = async (req, res) => {
    try {
        const targetUrl = decodeURIComponent(req.params[0]);
        if (!targetUrl) return res.status(400).send("Invalid URL");

        const response = await axios({
            method: 'GET',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'okhttp/4.12.0',
                'Referer': 'https://fmoviesunblocked.net/',
                'Range': req.headers.range
            }
        });
        
        res.writeHead(response.status, response.headers);
        response.data.pipe(res);
    } catch (error) {
        if (!res.headersSent) res.status(500).send("Stream Error");
    }
};