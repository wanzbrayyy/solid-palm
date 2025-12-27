<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AOS from 'aos';

const route = useRoute();
const router = useRouter();
const sessionId = route.params.id || '';

const form = ref({
    username: '',
    phone: '',
    password: ''
});

const showPassword = ref(false);

const handleRegister = () => {
    if(form.value.username && form.value.phone && form.value.password) {
        // Simulasi register berhasil
        router.push('/login');
    } else {
        alert('Mohon lengkapi semua data!');
    }
};

onMounted(() => {
    AOS.init({ duration: 800, once: true });
});
</script>

<template>
    <div class="auth-wrapper">
        <div class="auth-blob" style="left: -100px; bottom: -100px; background: var(--secondary);"></div>
        <div class="container">
            <div class="row justify-content-center align-items-center min-vh-100">
                <div class="col-md-5 col-lg-4" data-aos="fade-up">
                    <div class="card border-0 shadow-lg rounded-4 p-4 glass-card">
                        <div class="text-center mb-4">
                            <h4 class="fw-bold text-uppercase">buat akun baru</h4>
                            <p class="text-muted small lowercase-text">mulai perjalanan bot anda</p>
                             <div v-if="sessionId" class="badge bg-success bg-opacity-10 text-success py-2 px-3 rounded-pill mb-2">
                                <i class="fas fa-check-circle me-1"></i>Refferal: {{ sessionId }}
                            </div>
                        </div>

                        <form @submit.prevent="handleRegister">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted mb-1">USERNAME</label>
                                <input v-model="form.username" type="text" class="form-control rounded-pill bg-light border-0 py-2 ps-3" placeholder="fionabot" required>
                            </div>
                            
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
                                        placeholder="Buat kata sandi aman"
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

                            <button type="submit" class="btn btn-custom w-100 mb-3 text-uppercase shadow-sm">daftar sekarang</button>
                        </form>

                        <div class="text-center small">
                            <span class="text-muted">Sudah punya akun?</span>
                            <a href="#" @click.prevent="router.push('/login/' + sessionId)" class="text-primary fw-bold text-decoration-none ms-1">Masuk</a>
                        </div>
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
    width: 500px;
    height: 500px;
    filter: blur(80px);
    opacity: 0.1;
    border-radius: 50%;
}
.glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}
input:focus {
    box-shadow: none;
    background-color: #f1f3f5 !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>