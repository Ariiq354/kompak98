<script setup lang="ts">
import { computed } from "vue";
import EventCard from "./EventCard.vue";

const { data: sudah } = await useFetch("/api/v1/acara/landing/sudah");

const mainEvent = computed(() => {
  if (!sudah.value || sudah.value.length === 0)
    return null;
  return {
    image: sudah.value[0]!.foto,
    date: sudah.value[0]!.tanggal,
    title: sudah.value[0]!.judul,
    description: sudah.value[0]!.deskripsi,
  };
});

const sideEvents = computed(() => {
  if (!sudah.value || sudah.value.length <= 1)
    return [];
  return sudah.value.slice(1).map(event => ({
    image: event.foto,
    date: event.tanggal,
    title: event.judul,
    description: event.deskripsi,
  }));
});

const config = useRuntimeConfig();
</script>

<template>
  <section id="acara" class="relative bg-slate-50 py-24 md:py-32">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center mb-16 md:mb-20">
        <span class="text-[#ed1e79] font-bold text-xs md:text-sm uppercase tracking-widest">
          Kilas Balik Kegiatan
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Acara & Kegiatan Terbaru
        </h2>
        <div class="w-16 h-1 bg-[#ed1e79] rounded-full mx-auto mt-4 mb-4" />
        <p class="text-slate-500 text-sm md:text-base leading-relaxed">
          Kumpulan momen kebersamaan dan program kerja alumni KOMPAK 98 yang telah terlaksana dengan sukses dan penuh kehangatan.
        </p>
      </div>

      <div v-if="sudah && sudah.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div v-if="mainEvent" class="lg:col-span-2">
          <EventCard
            :image="`${config.public.imageUrl}/${mainEvent.image}`"
            :date="mainEvent.date"
            :title="mainEvent.title"
            :description="mainEvent.description"
            is-main
          />
        </div>

        <div v-if="sideEvents.length > 0" class="flex flex-col gap-8 lg:gap-10">
          <EventCard
            v-for="(event, index) in sideEvents"
            :key="index"
            :image="`${config.public.imageUrl}/${event.image}`"
            :date="event.date"
            :title="event.title"
            :description="event.description"
          />
        </div>
      </div>

      <div v-else class="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-xl mx-auto">
        <svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-semibold text-slate-900">
          Belum Ada Acara
        </h3>
        <p class="mt-1 text-sm text-slate-500">
          Saat ini belum ada data acara yang dapat ditampilkan.
        </p>
      </div>
    </div>
  </section>
</template>
