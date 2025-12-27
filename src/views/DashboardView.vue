<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AOS from 'aos';

const router = useRouter();
const isSidebarOpen = ref(false);
const logs = ref([
    { time: '10:00:01', type: 'INFO', msg: 'Connecting to server...' },
    { time: '10:00:05', type: 'SUCCESS', msg: 'Session restored successfully' },
    { time: '10:00:12', type: 'MSG', msg: 'Pesan masuk dari 62895xxx' },
    { time: '10:01:00', type: 'INFO', msg: 'Auto-reply sent' }
]);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
    router.push('/');
};

onMounted(() => {
    AOS.init();
});
</script>

<template>
    <div class="dashboard-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'active': isSidebarOpen }">
            <div class="sidebar-header p-4">
                <h4 class="fw-bold text-white mb-0"><i class="fas fa-robot me-2"></i>FIONA</h4>
            </div>
            <ul class="list-unstyled p-3">
                <li class="mb-2">
                    <a href="#" class="sidebar-link active"><i class="fas fa-home me-3"></i>Dashboard</a>
                </li>
                <li class="mb-2">
                    <a href="#" class="sidebar-link"><i class="fas fa-qrcode me-3"></i>Scan Pairing</a>
                </li>
                <li class="mb-2">
                    <a href="#" class="sidebar-link"><i class="fas fa-bug me-3"></i>Bug Tools</a>
                </li>
                <li class="mb-2">
                    <a href="#" class="sidebar-link"><i class="fas fa-cog me-3"></i>Pengaturan</a>
                </li>
                <li class="mt-5">
                    <a href="#" @click.prevent="logout" class="sidebar-link text-danger"><i class="fas fa-sign-out-alt me-3"></i>Keluar</a>
                </li>
            </ul>
        </aside>

        <!-- Overlay for Mobile -->
        <div class="sidebar-overlay" :class="{ 'active': isSidebarOpen }" @click="toggleSidebar"></div>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar -->
            <nav class="navbar navbar-light bg-white shadow-sm rounded-4 mb-4 px-3">
                <div class="d-flex align-items-center w-100">
                    <button class="btn border-0 d-lg-none me-2" @click="toggleSidebar">
                        <i class="fas fa-bars fa-lg"></i>
                    </button>
                    <h5 class="mb-0 fw-bold text-dark">Dashboard</h5>
                    <div class="ms-auto d-flex align-items-center gap-3">
                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                            <i class="fas fa-wifi me-1"></i> Online
                        </span>
                        <img src="https://randomuser.me/api/portraits/men/5.jpg" class="rounded-circle border" width="40">
                    </div>
                </div>
            </nav>

            <!-- Stats Row -->
            <div class="row g-4 mb-4">
                <div class="col-md-4">
                    <div class="stat-card bg-primary text-white p-4 rounded-4" data-aos="fade-up">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-white-50 text-uppercase mb-2">Total Pesan</h6>
                                <h2 class="fw-bold mb-0">1,240</h2>
                            </div>
                            <i class="fas fa-comments fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card bg-white text-dark p-4 rounded-4 shadow-sm border" data-aos="fade-up" data-aos-delay="100">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted text-uppercase mb-2">Status Bot</h6>
                                <h2 class="fw-bold mb-0 text-success">Aktif</h2>
                            </div>
                            <i class="fas fa-server fa-2x text-primary opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stat-card bg-white text-dark p-4 rounded-4 shadow-sm border" data-aos="fade-up" data-aos-delay="200">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted text-uppercase mb-2">Masa Aktif</h6>
                                <h2 class="fw-bold mb-0">29 Hari</h2>
                            </div>
                            <i class="fas fa-calendar-alt fa-2x text-warning opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Terminal Log -->
            <div class="row">
                <div class="col-12" data-aos="fade-up" data-aos-delay="300">
                    <div class="card bg-dark text-white rounded-4 border-0 shadow overflow-hidden">
                        <div class="card-header border-bottom border-secondary bg-transparent p-3 d-flex align-items-center">
                            <i class="fas fa-terminal me-2 text-success"></i>
                            <span class="fw-bold small font-monospace">LIVE LOGS</span>
                            <div class="ms-auto d-flex gap-2">
                                <div class="rounded-circle bg-danger" style="width: 10px; height: 10px;"></div>
                                <div class="rounded-circle bg-warning" style="width: 10px; height: 10px;"></div>
                                <div class="rounded-circle bg-success" style="width: 10px; height: 10px;"></div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="terminal-body p-3 font-monospace small" style="height: 300px; overflow-y: auto;">
                                <div v-for="(log, i) in logs" :key="i" class="mb-1">
                                    <span class="text-muted">[{{ log.time }}]</span>
                                    <span :class="log.type === 'INFO' ? 'text-info' : log.type === 'SUCCESS' ? 'text-success' : 'text-warning'" class="mx-2 fw-bold">{{ log.type }}</span>
                                    <span>{{ log.msg }}</span>
                                </div>
                                <div class="typing-cursor mt-2">_</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.dashboard-wrapper {
    display: flex;
    min-height: 100vh;
    background: #f1f2f6;
}

.sidebar {
    width: 280px;
    background: #1e1e2f;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

.sidebar-link {
    display: block;
    padding: 12px 20px;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    border-radius: 10px;
    transition: 0.3s;
    font-weight: 500;
}

.sidebar-link:hover, .sidebar-link.active {
    background: var(--primary);
    color: white;
}

.main-content {
    flex: 1;
    margin-left: 280px;
    padding: 2rem;
    transition: all 0.3s ease;
}

/* Mobile Responsive */
@media (max-width: 991px) {
    .sidebar {
        left: -280px;
    }
    .sidebar.active {
        left: 0;
    }
    .main-content {
        margin-left: 0;
        padding: 1rem;
    }
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 900;
        display: none;
    }
    .sidebar-overlay.active {
        display: block;
    }
}

.typing-cursor {
    animation: blink 1s infinite;
}
@keyframes blink { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
</style>