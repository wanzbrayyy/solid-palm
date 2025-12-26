<template>
    <section id="pricing" class="py-5 bg-white">
        <div class="container py-5">
            <div class="text-center mb-5" data-aos="fade-up">
                <h6 class="section-title">paket berlangganan</h6>
                <h2 class="fw-bold text-dark text-uppercase display-6">pilih sesuai kebutuhan</h2>
                <p class="lowercase-text">mulai gratis, upgrade untuk kekuatan penuh</p>
            </div>
            <div class="row justify-content-center g-4 align-items-center">
                <div class="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                    <div class="pricing-card p-4 text-center">
                        <h4 class="fw-bold text-uppercase mb-3">starter</h4>
                        <h2 class="display-4 fw-bold text-dark mb-0">rp 0</h2>
                        <span class="text-muted lowercase-text">selamanya</span>
                        <hr class="my-4">
                        <ul class="list-unstyled text-start mx-auto" style="max-width: 200px;">
                            <li class="mb-3 lowercase-text"><i class="fas fa-check text-primary me-2"></i> 2 sesi bot</li>
                            <li class="mb-3 lowercase-text"><i class="fas fa-check text-primary me-2"></i> fitur dasar</li>
                            <li class="mb-3 lowercase-text"><i class="fas fa-check text-primary me-2"></i> mode publik</li>
                            <li class="mb-3 lowercase-text text-muted text-decoration-line-through"><i class="fas fa-times me-2"></i> menu bug</li>
                        </ul>
                        <a href="/register" class="btn btn-outline-primary rounded-pill w-100 text-uppercase fw-bold">daftar gratis</a>
                    </div>
                </div>
                <div class="col-lg-4" data-aos="zoom-in">
                    <div class="pricing-card p-5 text-center bg-gradient-primary text-white position-relative" style="transform: scale(1.05); z-index: 2;">
                        <div class="position-absolute top-0 start-50 translate-middle badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold shadow">paling laris</div>
                        <h4 class="fw-bold text-uppercase mb-3">premium</h4>
                        <h2 class="display-4 fw-bold mb-0">rp 5rb</h2>
                        <span class="text-white-50 lowercase-text">sekali bayar</span>
                        <hr class="my-4 border-white">
                        <ul class="list-unstyled text-start mx-auto" style="max-width: 200px;">
                            <li class="mb-3 lowercase-text"><i class="fas fa-check-circle me-2"></i> 10 sesi bot</li>
                            <li class="mb-3 lowercase-text"><i class="fas fa-check-circle me-2"></i> buka menu bug</li>
                            <li class="mb-3 lowercase-text"><i class="fas fa-check-circle me-2"></i> prioritas server</li>
                            <li class="mb-3 lowercase-text"><i class="fas fa-check-circle me-2"></i> akses fitur baru</li>
                        </ul>
                        <button class="btn btn-light rounded-pill w-100 text-uppercase fw-bold text-primary shadow">upgrade sekarang</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.pricing-card {
    border-radius: 20px;
    overflow: hidden;
    background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: 0.3s;
    border: 1px solid #f1f1f1;
}
.pricing-card:hover {
    transform: scale(1.03);
    border-color: var(--primary);
}
</style>