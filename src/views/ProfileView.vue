<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue';
</script>

<template>
    <DashboardLayout>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-body p-5 text-center">
                        <img src="https://randomuser.me/api/portraits/men/5.jpg" class="rounded-circle border mb-3" width="100">
                        <h3 class="fw-bold">Maverick</h3>
                        <p class="text-muted">User ID: 12345-ABCD</p>
                        <hr>
                        <form class="text-start">
                            <div class="mb-3">
                                <label class="form-label fw-bold">Email</label>
                                <input type="email" class="form-control rounded-pill" value="maverick@example.com" disabled>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold">Password Baru</label>
                                <input type="password" class="form-control rounded-pill">
                            </div>
                            <button class="btn btn-primary rounded-pill px-4 fw-bold">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
</template>