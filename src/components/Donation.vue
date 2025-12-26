<template>
    <section class="py-5 bg-light">
        <div class="container text-center">
            <div class="row justify-content-center">
                <div class="col-lg-8" data-aos="fade-up">
                    <div class="card border-0 shadow-sm p-5 rounded-4 text-center">
                        <i class="fas fa-heart text-danger fa-3x mb-3"></i>
                        <h3 class="fw-bold text-uppercase text-dark">dukung pengembangan</h3>
                        <p class="lowercase-text text-muted mb-4">
                            aplikasi ini dikembangkan dengan cinta. anda bisa memberikan dukungan donasi berapapun untuk membantu biaya server.
                        </p>
                        <button class="btn btn-warning text-white rounded-pill px-5 py-3 fw-bold text-uppercase shadow-sm" data-bs-toggle="modal" data-bs-target="#donateModal">
                            <i class="fas fa-coffee me-2"></i> traktir kopi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="modal fade" id="donateModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-0 bg-warning bg-opacity-10">
                    <h5 class="modal-title fw-bold text-uppercase text-dark">donasi sukarela</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form>
                    <div class="modal-body p-4">
                        <div class="alert alert-info border-0 rounded-3 small lowercase-text">
                            <i class="fas fa-info-circle me-2"></i>biaya admin rp 400 per transaksi.
                        </div>
                        <label class="fw-bold small text-muted text-uppercase mb-2">nominal (rp)</label>
                        <input type="number" class="form-control form-control-lg bg-light border-0 fw-bold" placeholder="10000" min="1000">
                    </div>
                    <div class="modal-footer border-0 pt-0 px-4 pb-4">
                        <button type="submit" class="btn btn-primary w-100 rounded-pill text-uppercase fw-bold">lanjut pembayaran</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>