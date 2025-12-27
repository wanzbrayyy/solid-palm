<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue';
import { ref } from 'vue';

const notifEmail = ref(true);
const notifWA = ref(false);
</script>

<template>
    <DashboardLayout>
        <div class="row">
            <div class="col-12 mb-4">
                <h4 class="fw-bold">Settings</h4>
            </div>
            <div class="col-md-6">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body p-4">
                        <h6 class="fw-bold mb-3">Notifikasi</h6>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" v-model="notifEmail">
                            <label class="form-check-label">Email Notification</label>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" v-model="notifWA">
                            <label class="form-check-label">WhatsApp Notification</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>