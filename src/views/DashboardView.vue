<script setup>
import { ref, onMounted } from 'vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Swal from 'sweetalert2';
// Jika menggunakan Bootstrap Bundle dari Main.js, modal instance bisa diakses via window.bootstrap atau import
import { Modal } from 'bootstrap';

// --- DATA MOCKUP (Ganti dengan fetch API backend nanti) ---
const user = ref({
    isPremium: false,
    serverSlots: 2,
    maxSessions: 2
});

const projects = ref([]); // Data Server Cloud
const sessions = ref([
    { sessionId: 'session_01', phoneNumber: '6289512345678', status: 'connected', customCode: '', config: { botname: 'FionaBot', owner: '628XX', jedaPushkontak: 5000, telegram: '' } }
]); // Data WA Session

// --- STATE MANAGEMENT ---
const currentSession = ref({});
const pairingNumber = ref('');
const newProject = ref({ name: '', description: '' });

// --- MODAL HANDLERS ---
// Fungsi untuk membuka Config Modal dengan data sesi tertentu
const openConfigModal = (session) => {
    currentSession.value = { ...session }; // Clone object
    const modal = new Modal(document.getElementById('configModal'));
    modal.show();
};

const openCodeModal = (session) => {
    currentSession.value = { ...session };
    const modal = new Modal(document.getElementById('codeModal'));
    modal.show();
};

// --- ACTIONS ---
const requestPairing = () => {
    if(!pairingNumber.value) return Swal.fire('Error', 'Enter Number', 'error');
    
    // Simulasi Socket Emit
    Swal.fire({ title: 'Processing', didOpen: () => Swal.showLoading() });
    
    setTimeout(() => {
        // Simulasi berhasil dapat kode
        Swal.fire({ 
            title: 'PAIRING CODE', 
            html: `<div class="bg-light p-3 rounded mb-2"><h1 class="text-success fw-bold display-2 m-0">ABC-123</h1></div><p>Enter on WhatsApp Linked Device</p>` 
        });
        // Reset modal
        const modalEl = document.getElementById('addBotModal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
        
        // Simulasi tambah sesi
        sessions.value.push({ 
            sessionId: 'new_sess_' + Date.now(), 
            phoneNumber: pairingNumber.value, 
            status: 'connecting' 
        });
    }, 1500);
};

const createProject = () => {
    projects.value.push({
        uuid: 'proj_' + Date.now(),
        name: newProject.value.name,
        description: newProject.value.description
    });
    newProject.value = { name: '', description: '' };
    const modal = Modal.getInstance(document.getElementById('createProjectModal'));
    modal.hide();
    Swal.fire('Success', 'Server Deployed!', 'success');
};

const deleteSession = (id) => {
    Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes' }).then((res) => {
        if(res.isConfirmed) { 
            sessions.value = sessions.value.filter(s => s.sessionId !== id);
            Swal.fire('Deleted!', 'Session removed.', 'success');
        }
    });
};

const deleteProject = (uuid) => {
    Swal.fire({ title: 'Delete Server?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Destroy' }).then((res) => {
        if(res.isConfirmed) { 
            projects.value = projects.value.filter(p => p.uuid !== uuid);
            Swal.fire('Destroyed!', 'Server container removed.', 'success');
        }
    });
};

const saveConfig = () => {
    // Update data di array sessions (Simulasi Save ke DB)
    const index = sessions.value.findIndex(s => s.sessionId === currentSession.value.sessionId);
    if(index !== -1) sessions.value[index] = { ...currentSession.value };
    
    const modal = Modal.getInstance(document.getElementById('configModal'));
    modal.hide();
    Swal.fire('Saved', 'Configuration updated.', 'success');
};

const saveCode = () => {
    // Update code
    const index = sessions.value.findIndex(s => s.sessionId === currentSession.value.sessionId);
    if(index !== -1) sessions.value[index].customCode = currentSession.value.customCode;

    const modal = Modal.getInstance(document.getElementById('codeModal'));
    modal.hide();
    Swal.fire('Saved', 'Custom injector updated.', 'success');
};
</script>

<template>
    <DashboardLayout>
        <!-- Premium Banner -->
        <div v-if="!user.isPremium" class="card border-0 bg-primary bg-gradient text-white shadow-sm rounded-4 mb-5">
            <div class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div class="mb-3 mb-md-0">
                    <h4 class="fw-bold"><i class="fas fa-rocket me-2"></i>Upgrade Premium</h4>
                    <p class="mb-0 opacity-75">Buka akses 10 Sesi Bot & Fitur Inject Code hanya <strong>Rp 5.000</strong>.</p>
                </div>
                <button class="btn btn-light text-primary fw-bold rounded-pill px-4 shadow py-2">Upgrade Sekarang</button>
            </div>
        </div>

        <!-- PROJECT SECTION -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark m-0"><i class="fas fa-server me-2"></i>Cloud Servers</h4>
                <p class="text-muted small m-0">Your Instances ({{ projects.length }} / {{ user.serverSlots }} Slots)</p>
            </div>
            <button v-if="projects.length < user.serverSlots" class="btn btn-dark rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#createProjectModal">
                <i class="fas fa-plus me-2"></i>Deploy Server
            </button>
            <button v-else class="btn btn-warning text-white rounded-pill px-4 shadow-sm fw-bold">
                <i class="fas fa-arrow-up me-2"></i>Upgrade Slots
            </button>
        </div>

        <div class="row g-4 mb-5">
            <div v-if="projects.length === 0" class="col-12">
                <div class="alert alert-light border text-center rounded-4 p-4 shadow-sm">
                    <i class="fas fa-cube fa-2x text-muted mb-2"></i>
                    <h6 class="fw-bold text-muted">No servers deployed</h6>
                    <p class="text-muted small">Create your first server container to run scripts.</p>
                </div>
            </div>
            <div v-for="p in projects" :key="p.uuid" class="col-xl-4 col-md-6">
                <div class="card card-server h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between mb-3">
                            <div class="server-icon"><i class="fas fa-microchip"></i></div>
                            <div class="dropdown">
                                <button class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i></button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><a class="dropdown-item text-danger" href="#" @click.prevent="deleteProject(p.uuid)">Delete</a></li>
                                </ul>
                            </div>
                        </div>
                        <h5 class="fw-bold mb-1">{{ p.name }}</h5>
                        <div class="mb-4 text-muted small text-truncate">{{ p.description || 'No description' }}</div>
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Running</span>
                            <button class="btn btn-dark btn-sm rounded-pill px-4 fw-bold">Manage <i class="fas fa-arrow-right ms-1"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <hr class="my-5 border-light">

        <!-- WHATSAPP BOT SECTION -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold text-dark m-0"><i class="fab fa-whatsapp me-2"></i>Bot Sessions</h4>
                <p class="text-muted small m-0">Active Connections ({{ sessions.length }} / {{ user.maxSessions }})</p>
            </div>
            <button v-if="sessions.length < user.maxSessions" class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#addBotModal">
                <i class="fas fa-plus me-2"></i>Connect WA
            </button>
            <button v-else class="btn btn-secondary rounded-pill px-4 shadow-sm fw-bold" @click="Swal.fire('Limit!', 'Upgrade Premium', 'warning')">
                Max Reached
            </button>
        </div>

        <div class="row g-4">
            <div v-if="sessions.length === 0" class="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                <i class="fab fa-whatsapp fa-3x text-muted mb-3 opacity-25"></i>
                <h5 class="fw-bold text-muted">No WhatsApp connected</h5>
            </div>
            
            <div v-for="sess in sessions" :key="sess.sessionId" class="col-md-6 col-xl-4">
                <div class="card card-session h-100">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center mb-4">
                            <div class="bg-light p-3 rounded-circle me-3 text-success shadow-sm"><i class="fab fa-whatsapp fa-2x"></i></div>
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">{{ sess.phoneNumber || 'Connecting...' }}</h6>
                                <span class="badge bg-light text-dark border mt-1">
                                    <span class="status-indicator" :class="sess.status == 'connected' ? 'status-connected' : 'status-connecting'"></span> {{ sess.status }}
                                </span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <small class="text-muted fw-bold">{{ sess.sessionId.substring(0,6) }}...</small>
                            <div class="d-flex">
                                <button class="btn btn-action btn-code shadow-sm" @click="openCodeModal(sess)"><i class="fas fa-code"></i></button>
                                <button class="btn btn-action btn-settings shadow-sm" @click="openConfigModal(sess)"><i class="fas fa-cog"></i></button>
                                <button class="btn btn-action btn-delete shadow-sm" @click="deleteSession(sess.sessionId)"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: ADD BOT -->
        <div class="modal fade" id="addBotModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0">
                        <h5>New Connection</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <input v-model="pairingNumber" type="number" class="form-control form-control-lg text-center fw-bold mb-3 rounded-pill" placeholder="628xxx">
                        <button class="btn btn-success w-100 btn-lg rounded-pill fw-bold" @click="requestPairing">Get Pairing Code</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: CREATE PROJECT -->
        <div class="modal fade" id="createProjectModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0">
                        <h5>Create Server</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="createProject">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">Server Name</label>
                                <input v-model="newProject.name" type="text" class="form-control rounded-pill" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">Description</label>
                                <textarea v-model="newProject.description" class="form-control rounded-4"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="submit" class="btn btn-dark w-100 rounded-pill fw-bold">Deploy Server</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- MODAL: CONFIG (Dynamic) -->
        <div class="modal fade" id="configModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow rounded-4">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold">Bot Config: {{ currentSession.phoneNumber }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="saveConfig" v-if="currentSession.config">
                        <div class="modal-body p-4">
                            <div class="row g-3">
                                <div class="col-12"><input type="text" v-model="currentSession.config.botname" class="form-control" placeholder="Bot Name"></div>
                                <div class="col-6"><input type="number" v-model="currentSession.config.owner" class="form-control" placeholder="Owner Num"></div>
                                <div class="col-6"><input type="number" v-model="currentSession.config.jedaPushkontak" class="form-control" placeholder="Delay"></div>
                                <div class="col-12"><input type="text" v-model="currentSession.config.telegram" class="form-control" placeholder="Telegram Link"></div>
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="submit" class="btn btn-primary rounded-pill w-100 fw-bold">Save Settings</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- MODAL: CODE (Dynamic) -->
        <div class="modal fade" id="codeModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold">Custom Injector: {{ currentSession.phoneNumber }}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <form @submit.prevent="saveCode">
                        <div class="modal-body bg-dark p-3">
                            <textarea v-model="currentSession.customCode" class="code-editor" placeholder="JS Code Here..." spellcheck="false"></textarea>
                        </div>
                        <div class="modal-footer bg-dark border-top border-secondary">
                            <button type="submit" class="btn btn-success rounded-pill px-4 fw-bold">Save Code</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>

<style scoped>
/* Specific Card Styles */
.card-session { border: none; border-radius: 16px; background: white; box-shadow: 0 5px 20px rgba(0,0,0,0.03); transition: transform 0.2s; position: relative; overflow: hidden; }
.card-session:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
.status-indicator { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
.status-connected { background-color: #198754; box-shadow: 0 0 10px rgba(25, 135, 84, 0.5); }
.status-connecting { background-color: #ffc107; box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
.btn-action { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: none; transition: 0.2s; margin-left: 5px; }
.btn-settings { background: #f1f3f5; color: #495057; }
.btn-settings:hover { background: var(--primary-color); color: white; }
.btn-code { background: #e7f5ff; color: #007bff; }
.btn-code:hover { background: #007bff; color: white; }
.btn-delete { background: #fff5f5; color: #dc3545; }
.btn-delete:hover { background: #dc3545; color: white; }
.code-editor { background-color: var(--code-bg); color: #d4d4d4; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; border: 1px solid #333; border-radius: 8px; padding: 15px; width: 100%; height: 300px; resize: vertical; line-height: 1.5; }
.code-editor:focus { outline: 2px solid var(--primary-color); border-color: transparent; }

.card-server { border: none; border-radius: 12px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: 0.2s; }
.card-server:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border: 1px solid var(--primary-color); }
.server-icon { width: 50px; height: 50px; border-radius: 12px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 24px; }
</style>