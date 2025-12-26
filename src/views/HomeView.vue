<script setup>
import { onMounted } from 'vue';
import AOS from 'aos';
import Navbar from '../components/Navbar.vue';
import HeroSection from '../components/HeroSection.vue';
import TechMarquee from '../components/TechMarquee.vue';
import Features from '../components/Features.vue';
import CodeInjector from '../components/CodeInjector.vue';
import Pricing from '../components/Pricing.vue';
import Donation from '../components/Donation.vue';
import Footer from '../components/Footer.vue';

onMounted(() => {
    AOS.init({ duration: 800, once: true });
});
</script>

<template>
    <main>
        <Navbar />
        <HeroSection />
        <TechMarquee />
        <Features />
        <CodeInjector />
        <Pricing />
        <Donation />
        <Footer />
    </main>
</template>