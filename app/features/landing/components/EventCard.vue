<script setup lang="ts">
defineProps({
  image: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isMain: { type: Boolean, default: false },
});
</script>

<template>
  <div
    class="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full"
  >
    <!-- Image Wrapper with Zoom Effect -->
    <div class="relative overflow-hidden aspect-video w-full bg-slate-100">
      <NuxtImg
        :src="image"
        :alt="title"
        class="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <!-- Decorative overlay gradient -->
      <div class="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <!-- Details Content -->
    <div class="flex flex-col grow p-6 md:p-8">
      <!-- Date -->
      <div class="flex items-center gap-2 text-xs font-semibold text-[#ed1e79] uppercase tracking-wider mb-3">
        <UIcon name="i-lucide-calendar" class="w-4 h-4" />
        <span>{{ date }}</span>
      </div>

      <!-- Title -->
      <h3
        class="text-slate-900 group-hover:text-navy-600 transition-colors duration-200 line-clamp-2 mb-3 leading-snug"
        :class="isMain ? 'text-xl md:text-2xl font-bold' : 'text-lg md:text-xl font-semibold'"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 grow">
        {{ description }}
      </p>
    </div>
  </div>
</template>
