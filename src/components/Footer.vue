<template>
    <footer class="py-5 bg-white border-top">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h5 class="fw-bold text-uppercase text-dark mb-3"><i class="fas fa-robot me-2 text-primary"></i>fiona</h5>
                    <p class="lowercase-text text-muted small">
                        platform manajemen bot whatsapp terbaik dengan fitur pairing code dan bug tools terlengkap di indonesia.
                    </p>
                </div>
                <div class="col-lg-2 col-6">
                    <h6 class="fw-bold text-uppercase text-dark mb-3">navigasi</h6>
                    <ul class="list-unstyled small lowercase-text">
                        <li><a href="#" class="text-muted text-decoration-none">beranda</a></li>
                        <li><a href="#features" class="text-muted text-decoration-none">fitur</a></li>
                        <li><a href="#pricing" class="text-muted text-decoration-none">harga</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-6">
                    <h6 class="fw-bold text-uppercase text-dark mb-3">legal</h6>
                    <ul class="list-unstyled small lowercase-text">
                        <li><a href="#" class="text-muted text-decoration-none">privasi</a></li>
                        <li><a href="#" class="text-muted text-decoration-none">syarat</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h6 class="fw-bold text-uppercase text-dark mb-3">newsletter</h6>
                    <p class="small lowercase-text text-muted">dapatkan info update terbaru.</p>
                    <div class="input-group">
                        <input type="email" class="form-control rounded-pill rounded-end border-0 bg-light" placeholder="email anda">
                        <button class="btn btn-primary rounded-pill rounded-start px-4"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center small lowercase-text text-muted">
                &copy; {{ new Date().getFullYear() }} fiona, made by wanzofc
            </div>
        </div>
    </footer>
</template>