wanzofc-film/
│
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/         # Konfigurasi DB, Environment variables
│   │   ├── controllers/    # Logika request/response (Otak aplikasi)
│   │   ├── middleware/     # Auth, Error handling, Logging
│   │   ├── models/         # Schema Database (MongoDB/SQL)
│   │   ├── routes/         # Definisi URL API (GET, POST, dll)
│   │   ├── services/       # Business Logic (Pemisah dari controller agar rapi)
│   │   ├── utils/          # Fungsi bantuan (Helper)
│   │   └── app.js          # Entry point aplikasi backend
│   ├── .env                # File rahasia (API Key, DB URL)
│   └── package.json
│
├── aurel/                  # Frontend (Aurelia Framework)
│   ├── src/
│   │   ├── assets/         # Gambar, CSS global, Font
│   │   ├── components/     # Komponen kecil yang bisa dipakai ulang (Header, Footer, Card)
│   │   ├── resources/      # Custom elements/attributes Aurelia
│   │   ├── services/       # File untuk connect ke Backend (API Service)
│   │   ├── views/          # Halaman Utama (Pages)
│   │   │   ├── home/       # Folder Halaman Home
│   │   │   │   ├── home.html
│   │   │   │   └── home.js
│   │   │   ├── search/     # Folder Halaman Search
│   │   │   │   ├── search.html
│   │   │   │   └── search.js
│   │   │   └── video/      # Folder Halaman Video Player
│   │   │   │   ├── video-detail.html
│   │   │   │   └── video-detail.js
│   │   ├── app.html        # Root Template
│   │   ├── app.js          # Root Router configuration
│   │   └── main.js         # Entry point Aurelia
│   ├── webpack.config.js   # Konfigurasi bundler (Aurelia biasanya pakai Webpack/Diten)
│   └── package.json
│
└── README.md