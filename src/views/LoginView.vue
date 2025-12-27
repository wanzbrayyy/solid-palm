<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AOS from 'aos';

const route = useRoute();
const router = useRouter();
const sessionId = route.params.id || '';

const form = ref({
    phone: '',
    password: ''
});

const showPassword = ref(false);

const handleLogin = () => {
    if(form.value.phone && form.value.password) {
        router.push('/dashboard');
    } else {
        alert('Mohon isi nomor dan kata sandi!');
    }
};

onMounted(() => {
    AOS.init({ duration: 800, once: true });
});
</script>

<template>
    <div class="auth-wrapper">
        <div class="auth-blob"></div>
        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <div class="col-md-5 col-lg-4" data-aos="zoom-in">
                    <div class="card border-0 shadow-lg rounded-4 p-4 glass-card">
                        <div class="text-center mb-4">
                            <div class="icon-box mx-auto mb-3">
                                <i class="fas fa-robot"></i>
                            </div>
                            <h4 class="fw-bold text-uppercase">selamat datang</h4>
                            <p class="text-muted small lowercase-text">masuk untuk mengelola bot anda</p>
                            
                            <div v-if="sessionId" class="alert alert-primary py-2 small fw-bold">
                                <i class="fas fa-link me-2"></i>Sesi ID: {{ sessionId }}
                            </div>
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted mb-1">NOMOR WHATSAPP</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-0 rounded-start-pill ps-3">
                                        <i class="fas fa-phone text-muted"></i>
                                    </span>
                                    <input v-model="form.phone" type="number" class="form-control bg-light border-0 rounded-end-pill py-2" placeholder="628xxx" required>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold text-muted mb-1">KATA SANDI</label>
                                <div class="position-relative">
                                    <input 
                                        v-model="form.password" 
                                        :type="showPassword ? 'text' : 'password'" 
                                        class="form-control rounded-pill bg-light border-0 py-2 pe-5 ps-3" 
                                        placeholder="Masukkan kata sandi"
                                        required
                                    >
                                    <button 
                                        type="button" 
                                        @click="showPassword = !showPassword"
                                        class="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                                        style="z-index: 5;"
                                    >
                                        <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-custom w-100 mb-3 text-uppercase shadow-sm">masuk panel</button>
                        </form>

                        <div class="text-center small">
                            <span class="text-muted">Belum punya akun?</span>
                            <a href="#" @click.prevent="router.push('/register/' + sessionId)" class="text-primary fw-bold text-decoration-none ms-1">Daftar</a>
                        </div>
                    </div>
                    <div class="text-center mt-4">
                         <a href="#" @click.prevent="router.push('/')" class="text-muted small text-decoration-none hover-link">
                            <i class="fas fa-arrow-left me-1"></i> Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-wrapper {
    background: #f8f9fa;
    position: relative;
    overflow: hidden;
}
.auth-blob {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    background: var(--primary);
    filter: blur(80px);
    opacity: 0.1;
    border-radius: 50%;
}
.glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}
.icon-box {
    width: 60px;
    height: 60px;
    background: rgba(78, 84, 200, 0.1);
    color: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}
.hover-link:hover {
    color: var(--primary) !important;
}
input:focus {
    box-shadow: none;
    background-color: #f1f3f5 !important;
}
/* Hilangkan spin button di input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>