<script setup lang="ts">
import AspirasiForm from "./components/AspirasiForm.vue";
import InformasiForm from "./components/InformasiForm.vue";
import LaporanTab from "./components/LaporanTab.vue";
import PengaduanForm from "./components/PengaduanForm.vue";
import StepProsesPengajuan from "./components/StepProsesPengajuan.vue";
import TotalLaporan from "./components/TotalLaporan.vue";

const activeTab = ref<"pengaduan" | "aspirasi" | "informasi">("pengaduan");
</script>

<template>
  <section class="relative">
    <div class="absolute top-0 left-0 w-full -z-10">
      <NuxtImg
        src="/images/hero-kemenag.webp"
        class="w-full h-full object-cover rotate-180"
      />
    </div>
    <div class="container mx-auto px-4 pt-48">
      <div class="text-center mb-20">
        <h1 class="text-5xl font-bold mb-4">
          Layanan Aspirasi dan Pengaduan Online Rakyat
        </h1>

        <p class="text-lg font-semibold">
          Sampaikan aspirasi dan pengaduan Anda secara online, lebih cepat dan praktis!
        </p>
      </div>

      <div class="max-w-5xl mx-auto bg-white rounded-xl p-8 shadow-lg">
        <h2 class="text-3xl font-bold text-center mb-8">
          Sampaikan Laporan Anda
        </h2>

        <LaporanTab v-model="activeTab" />

        <PengaduanForm
          v-if="activeTab === 'pengaduan'"
        />

        <AspirasiForm
          v-else-if="activeTab === 'aspirasi'"
        />

        <InformasiForm
          v-else
        />
      </div>
    </div>

    <StepProsesPengajuan />
    <TotalLaporan />
  </section>
</template>
