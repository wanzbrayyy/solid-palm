<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isToggled = ref(false);

const toggleSidebar = () => {
    isToggled.value = !isToggled.value;
};

// Mock User Data (Global untuk layout)
const user = ref({
    username: 'Maverick',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    isPremium: false
});

const handleLogout = () => {
    // Logic logout disini
    router.push('/login');
};
</script>

<template>
    <div id="wrapper" :class="{ 'toggled': isToggled }">
        <div class="sidebar-backdrop" @click="toggleSidebar"></div>
        
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <div class="sidebar-heading">
                <span><i class="fas fa-robot me-2"></i>FIONA</span>
                <button class="btn btn-link text-danger d-md-none text-decoration-none" @click="toggleSidebar">
                    <i class="fas fa-times fa-lg"></i>
                </button>
            </div>
            <div class="list-group list-group-flush">
                <a href="#" @click.prevent="router.push('/dashboard')" class="list-group-item list-group-item-action" :class="{ active: route.path === '/dashboard' }">
                    <i class="fas fa-tachometer-alt me-3"></i>Dashboard
                </a>
                <a href="#" @click.prevent="router.push('/profile')" class="list-group-item list-group-item-action" :class="{ active: route.path === '/profile' }">
                    <i class="fas fa-user me-3"></i>Profile
                </a>
                <a href="#" @click.prevent="router.push('/settings')" class="list-group-item list-group-item-action" :class="{ active: route.path === '/settings' }">
                    <i class="fas fa-cog me-3"></i>Settings
                </a>
                <a href="https://t.me/maverick_dar" target="_blank" class="list-group-item list-group-item-action">
                    <i class="fas fa-headset me-3"></i>Support
                </a>
            </div>
            <div class="sidebar-footer">
                <button @click="handleLogout" class="btn btn-outline-danger w-100 rounded-pill">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                </button>
            </div>
        </div>

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top px-4 py-3 shadow-sm">
                <div class="d-flex align-items-center w-100">
                    <button class="btn btn-light border shadow-sm me-3" @click="toggleSidebar">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h5 class="mb-0 fw-bold text-secondary d-none d-md-block">Control Panel</h5>
                    <div class="ms-auto d-flex align-items-center">
                        <button class="btn btn-warning text-white rounded-pill px-3 me-3 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#donateModal">
                            <i class="fas fa-donate me-2"></i>Donasi
                        </button>
                        <div class="text-end me-3 d-none d-sm-block">
                            <span class="d-block fw-bold text-dark">{{ user.username }}</span>
                            <span v-if="user.isPremium" class="badge bg-warning text-dark rounded-pill"><i class="fas fa-crown me-1"></i>Premium</span>
                            <span v-else class="badge bg-secondary rounded-pill">Free Plan</span>
                        </div>
                        <img :src="user.profilePic" class="rounded-circle border" width="45" height="45" style="object-fit: cover;">
                    </div>
                </div>
            </nav>

            <div class="container-fluid p-4">
                <!-- Slot untuk Konten Halaman (Dashboard/Profile/Settings) -->
                <slot></slot>
            </div>
        </div>

        <!-- Global Donate Modal -->
        <div class="modal fade" id="donateModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 bg-warning bg-opacity-10">
                        <h5 class="fw-bold">Support Donation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent>
                        <div class="modal-body p-4">
                            <input type="number" class="form-control form-control-lg fw-bold" placeholder="10000">
                        </div>
                        <div class="modal-footer border-0 pt-0">
                            <button type="submit" class="btn btn-warning w-100 rounded-pill fw-bold text-white">Pay Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* CSS Global Dashboard */
:root { 
    --sidebar-width: 280px; 
    --primary-color: #4e54c8; 
    --secondary-bg: #f4f6f9; 
    --code-bg: #1e1e1e; 
}
body { background-color: var(--secondary-bg); }
#wrapper { display: flex; width: 100%; height: 100vh; overflow: hidden; }
#sidebar-wrapper {
    min-height: 100vh; width: var(--sidebar-width); margin-left: calc(var(--sidebar-width) * -1);
    background: #ffffff; border-right: 1px solid #eaeaea; transition: margin 0.3s ease-in-out;
    position: fixed; z-index: 1000; display: flex; flex-direction: column; box-shadow: 4px 0 15px rgba(0,0,0,0.05);
}
.sidebar-heading { padding: 1.5rem; font-size: 1.25rem; font-weight: 800; color: var(--primary-color); display: flex; justify-content: space-between; align-items: center; letter-spacing: 1px; }
.list-group-item { border: none; padding: 1rem 1.5rem; font-weight: 500; color: #6c757d; transition: all 0.2s; border-left: 4px solid transparent; }
.list-group-item:hover, .list-group-item.active { color: var(--primary-color); background-color: #f8f9fa; border-left-color: var(--primary-color); }
.list-group-item.active { background-color: #eef2ff; }
.sidebar-footer { margin-top: auto; padding: 1.5rem; }
#page-content-wrapper { width: 100%; overflow-y: auto; transition: margin 0.3s ease-in-out; }
#wrapper.toggled #sidebar-wrapper { margin-left: 0; }
@media (min-width: 768px) {
    #sidebar-wrapper { margin-left: 0; position: relative; }
    #page-content-wrapper { min-width: 0; width: 100%; }
    #wrapper.toggled #sidebar-wrapper { margin-left: calc(var(--sidebar-width) * -1); }
}
.sidebar-backdrop { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 900; }
#wrapper.toggled .sidebar-backdrop { display: block; }
@media (min-width: 768px) { #wrapper.toggled .sidebar-backdrop { display: none; } }
</style>