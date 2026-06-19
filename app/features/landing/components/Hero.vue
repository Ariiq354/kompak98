<template>
  <div class="relative w-full h-[80vh] min-h-125 flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <NuxtImg
        src="/images/bg-hero.webp"
        class="absolute w-full h-full object-cover object-center"
        alt="Hero Background"
      />
      <div class="absolute inset-0 bg-primary/40 mix-blend-multiply" />
      <div class="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
    </div>

    <div class="relative z-10 text-center px-6 md:px-margin-desktop max-w-6xl mx-auto flex flex-col items-center gap-4 md:gap-8">
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
        Selamat Datang, Alumni KOMPAK 98
      </h1>

      <p class="max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
        Menjalin Kembali Hubungan, Mengingat, dan Membangun Masa Depan Bersama
      </p>
    </div>
  </div>
</template>
