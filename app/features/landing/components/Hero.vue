<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const images = [
  "/images/image1.webp",
  "/images/image2.webp",
  "/images/image3.webp",
  "/images/image4.webp",
  "/images/image5.webp",
];

const currentImageIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }, 5000); // Berganti setiap 5 detik
});

onUnmounted(() => {
  if (timer)
    clearInterval(timer);
});
</script>

<template>
  <section id="hero" class="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-slate-900 pt-20">
    <div class="absolute inset-0 z-0">
      <div
        v-for="(img, index) in images"
        :key="img"
        class="absolute inset-0 transition-all duration-1500 ease-in-out"
        :class="index === currentImageIndex ? 'opacity-60 scale-100 z-10' : 'opacity-0 scale-102 z-0'"
      >
        <NuxtImg
          :src="img"
          class="w-full h-full object-cover object-center"
          alt="Hero Background"
        />
      </div>

      <div class="absolute inset-0 bg-linear-to-tr from-navy-950/90 via-navy-900/50 to-slate-900/30 z-20" />

      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl z-20" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8f0044]/15 rounded-full blur-3xl z-20" />

      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0f172a_90%)] z-20" />
    </div>

    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center gap-6 md:gap-8 pt-12 pb-24 md:pb-36">
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20 uppercase tracking-widest">
        <span class="w-1.5 h-1.5 rounded-full bg-[#ed1e79] animate-ping" />
        Portal Alumni Resmi
      </span>

      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
        Selamat Datang, <br> Alumni <span class="bg-linear-to-r from-navy-400 via-pink-400 to-[#ed1e79] bg-clip-text text-transparent">KOMPAK 98</span>
      </h1>

      <p class="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed">
        Menjalin Kembali Hubungan, Mengenang Masa Indah, dan Berkolaborasi Membangun Masa Depan yang Lebih Baik Bersama.
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
        <UButton
          to="#acara"
          size="xl"
          color="primary"
          class="w-full sm:w-auto px-8 py-3.5 shadow-lg shadow-primary-500/30 cursor-pointer transition-transform transform hover:scale-[1.03] active:scale-[0.98]"
        >
          Jelajahi Acara
        </UButton>
      </div>
    </div>
  </section>
</template>
