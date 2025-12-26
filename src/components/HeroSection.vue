<script setup>
import { onMounted, ref } from 'vue';
import Typed from 'typed.js';
import VanillaTilt from 'vanilla-tilt';

const typedElement = ref(null);
const mockupRef = ref(null);

onMounted(() => {
    new Typed(typedElement.value, {
        strings: ['SECARA OTOMATIS', 'TANPA BANNED', 'DENGAN MUDAH', 'JARAK JAUH'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true
    });

    if (mockupRef.value) {
        VanillaTilt.init(mockupRef.value, {
            max: 15, speed: 400, glare: true, "max-glare": 0.2
        });
    }
});
</script>

<template>
    <section class="hero-section">
        <div class="hero-blob" style="width: 500px; height: 500px; top: -100px; right: -100px;"></div>
        <div class="hero-blob" style="width: 300px; height: 300px; bottom: 50px; left: -50px; background: var(--secondary);"></div>

        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill text-uppercase fw-bold mb-3">
                        <i class="fas fa-bolt me-1"></i> panel bot v2.0 stabil
                    </span>
                    <h1 class="display-3 fw-bold text-dark mb-3 text-uppercase" style="line-height: 1.1;">
                        kelola bot whatsapp <br>
                        <span class="text-gradient" ref="typedElement"></span>
                    </h1>
                    <p class="lead lowercase-text mb-5">
                        solusi bot whatsapp berbasis cloud tanpa scan qr. fitur lengkap mulai dari auto reply, broadcast, hingga bug tools canggih. aktif 24 jam nonstop.
                    </p>
                    <div class="d-flex gap-3">
                        <a href="/register" class="btn btn-custom text-uppercase">mulai gratis</a>
                        <a href="#demo" class="btn btn-light rounded-pill px-4 py-2 shadow-sm text-uppercase d-flex align-items-center gap-2">
                            <i class="fas fa-play text-primary"></i> lihat demo
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 text-center" data-aos="zoom-in">
                    <div class="mockup-container" ref="mockupRef">
                        <img src="https://files.catbox.moe/r30gb3.jpg?w=1380" alt="Dashboard Preview" class="img-fluid mockup-img w-100">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    padding-top: 80px;
    background: radial-gradient(circle at top right, rgba(143, 148, 251, 0.1) 0%, rgba(255,255,255,0) 50%);
}
.hero-blob {
    position: absolute;
    background: var(--primary);
    filter: blur(80px);
    opacity: 0.1;
    border-radius: 50%;
    z-index: -1;
}
.mockup-container {
    position: relative;
    z-index: 2;
    transform-style: preserve-3d;
}
.mockup-img {
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0,0,0,0.2);
    border: 8px solid white;
}
</style>