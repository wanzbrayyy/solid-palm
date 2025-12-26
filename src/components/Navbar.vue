<template>
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold text-dark text-uppercase" href="#">
                <i class="fas fa-robot me-2 text-primary"></i>FIONA
            </a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="fas fa-bars"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center gap-3">
                    <li class="nav-item"><a class="nav-link lowercase-text fw-bold text-dark" href="#features">fitur</a></li>
                    <li class="nav-item"><a class="nav-link lowercase-text fw-bold text-dark" href="#pricing">harga</a></li>
                    <li class="nav-item"><a class="btn btn-outline-primary rounded-pill px-4 lowercase-text fw-bold" href="/login">masuk</a></li>
                    <li class="nav-item"><a class="btn btn-custom lowercase-text" href="/register">daftar sekarang</a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
}
</style>