<script setup lang="ts">
const { data: belum } = await useFetch("/api/v1/acara/landing/belum");

const upcomingEvents = computed(() => {
  if (!belum.value || belum.value.length === 0)
    return [];
  return belum.value.map(event => ({
    date: event.tanggal,
    title: event.judul,
    location: event.tempat,
  }));
});
</script>

<template>
  <section id="akan-datang" class="bg-linear-to-b from-slate-50 to-white py-24 md:py-32 border-t border-slate-200/60">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16 md:mb-20">
        <span class="text-navy-600 font-bold text-xs md:text-sm uppercase tracking-widest">
          Jangan Lewatkan
        </span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Agenda Mendatang
        </h2>
        <div class="w-16 h-1 bg-navy-600 rounded-full mx-auto mt-4 mb-4" />
        <p class="text-slate-500 text-sm md:text-base leading-relaxed">
          Catat tanggalnya dan pastikan Anda terdaftar untuk ikut merayakan momentum kebersamaan berikutnya.
        </p>
      </div>

      <!-- Events Grid -->
      <div v-if="upcomingEvents.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div
          v-for="(event, index) in upcomingEvents"
          :key="index"
          class="group bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- Date Badge -->
            <div class="flex items-center justify-between mb-6">
              <span class="inline-flex py-1 px-3 bg-navy-50 text-xs font-semibold text-navy-700 rounded-full border border-navy-100">
                {{ event.date }}
              </span>
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-900 mb-4 group-hover:text-navy-600 transition-colors duration-200">
              {{ event.title }}
            </h3>

            <!-- Details Stack -->
            <div class="space-y-3">
              <div class="flex items-center gap-2.5 text-slate-500 text-sm">
                <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-slate-400 shrink-0" />
                <span>{{ event.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-3xl border border-slate-200/70 max-w-xl mx-auto shadow-sm">
        <UIcon name="i-lucide-calendar-x" class="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 class="text-lg font-semibold text-slate-900">
          Belum Ada Agenda
        </h3>
        <p class="mt-1 text-sm text-slate-500">
          Saat ini belum ada agenda atau acara mendatang yang direncanakan.
        </p>
      </div>
    </div>
  </section>
</template>
