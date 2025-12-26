<script setup>
const techStack = [
    "NODE.JS", "REACT", "BOOTSTRAP", "MONGODB", "SOCKET.IO", "GSAP", "BAILEYS MD", "AXIOS", "EJS", "EXPRESS",
    "JQUERY", "SWEETALERT", "AOS", "THREE.JS", "ANIME.JS", "CHART.JS", "LEAFLET", "PRISM", "LODASH", "MOMENT"
];
</script>

<template>
    <div class="scroll-tech">
        <div class="tech-track">
            <span v-for="(tech, i) in [...techStack, ...techStack]" :key="i" class="tech-item">
                <i class="fas fa-circle text-primary me-2" style="font-size: 6px;"></i>{{ tech }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.scroll-tech {
    background: var(--bg-light);
    padding: 2rem 0;
    overflow: hidden;
    white-space: nowrap;
}
.tech-track {
    display: flex;
    animation: scroll 30s linear infinite;
}
.tech-item {
    display: inline-block;
    margin: 0 2rem;
    font-weight: 700;
    color: #bdc3c7;
    text-transform: uppercase;
    flex-shrink: 0;
}
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>