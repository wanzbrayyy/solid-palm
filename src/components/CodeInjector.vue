<template>
    <section class="py-5 bg-light overflow-hidden">
        <div class="container py-5">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right">
                    <h6 class="section-title">segera hadir</h6>
                    <h2 class="fw-bold text-dark text-uppercase mb-4">custom script injector</h2>
                    <p class="lowercase-text lead mb-4">
                        anda developer? atau ingin fitur unik? nantinya anda bisa menyuntikkan kode javascript langsung ke sesi bot anda tanpa perlu restart server utama.
                    </p>
                    <div class="d-flex align-items-start gap-3 mb-3">
                        <i class="fas fa-check-circle text-success mt-1"></i>
                        <div>
                            <h6 class="fw-bold text-uppercase mb-0">tambah case sendiri</h6>
                            <p class="lowercase-text small text-muted">contoh: buat fitur download tiktok khusus bot anda.</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-start gap-3">
                        <i class="fas fa-check-circle text-success mt-1"></i>
                        <div>
                            <h6 class="fw-bold text-uppercase mb-0">isolasi aman</h6>
                            <p class="lowercase-text small text-muted">kode anda berjalan di lingkungan aman per sesi.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                    <div class="code-window">
                        <div class="d-flex gap-2 mb-3">
                            <div class="rounded-circle bg-danger" style="width: 12px; height: 12px;"></div>
                            <div class="rounded-circle bg-warning" style="width: 12px; height: 12px;"></div>
                            <div class="rounded-circle bg-success" style="width: 12px; height: 12px;"></div>
                        </div>
                        <pre><code class="language-javascript text-white">
// Contoh Injector (Coming Soon)
module.exports = async (fiona, m) => {
    switch(command) {
        case 'myfeature':
            await fiona.sendMessage(m.chat, { 
                text: 'Halo! Ini fitur custom saya' 
            });
            break;
    }
}
                        </code></pre>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.code-window {
    background: #1e1e1e;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}
</style>