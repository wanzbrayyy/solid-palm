const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Range'],
    exposedHeaders: ['Content-Range', 'Content-Length']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', movieRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'Online',
        message: 'Wanzofc Film API (MovieBox Version) is Running'
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;