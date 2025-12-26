<script setup>
import { onMounted } from 'vue';
import VanillaTilt from 'vanilla-tilt';

const features = [
    { icon: 'fas fa-link', title: 'pairing code md', desc: 'koneksi mudah tanpa kamera hp kedua. cukup masukkan nomor, dapatkan kode, dan tempel di whatsapp anda.' },
    { icon: 'fas fa-bug', title: 'menu bug & war', desc: 'akses eksklusif ke fitur bug seperti crash, lag, catalog bug, dan bulldozer attack untuk pengujian keamanan.' },
    { icon: 'fas fa-server', title: 'cloud server 24/7', desc: 'bot berjalan di server kami. hp mati, kuota habis, bot tetap on melayani pesan masuk.' },
    { icon: 'fas fa-code', title: 'custom injector', desc: 'fitur revolusioner. tambahkan script custom anda sendiri ke dalam sesi bot langsung dari dashboard.' },
    { icon: 'fas fa-wallet', title: 'donasi otomatis', desc: 'sistem pembayaran qris terintegrasi. upgrade akun atau donasi saldo diproses secara instan.' },
    { icon: 'fas fa-shield-alt', title: 'anti banned', desc: 'dilengkapi algoritma pintar untuk meminimalisir resiko banned saat melakukan broadcast massal.' }
];

onMounted(() => {
    VanillaTilt.init(document.querySelectorAll(".feature-card"), {
        max: 5, speed: 300
    });
});
</script>

<template>
    <section id="features" class="py-5 bg-white">
        <div class="container py-5">
            <div class="text-center mb-5" data-aos="fade-up">
                <h6 class="section-title">fitur unggulan</h6>
                <h2 class="fw-bold text-dark text-uppercase display-6">teknologi bot mutakhir</h2>
                <p class="lowercase-text">semua yang anda butuhkan untuk otomatisasi whatsapp</p>
            </div>
            <div class="row g-4">
                <div v-for="(f, i) in features" :key="i" class="col-md-4" data-aos="fade-up" :data-aos-delay="i * 100">
                    <div class="feature-card hvr-float">
                        <div class="icon-box"><i :class="f.icon"></i></div>
                        <h5 class="fw-bold text-uppercase mb-3">{{ f.title }}</h5>
                        <p class="lowercase-text mb-0">{{ f.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.feature-card {
    background: var(--white);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    border: 1px solid rgba(0,0,0,0.03);
    height: 100%;
}
.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(78, 84, 200, 0.15);
    border-color: var(--primary);
}
.icon-box {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    background: rgba(78, 84, 200, 0.1);
    color: var(--primary);
}
</style>