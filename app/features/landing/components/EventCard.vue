<script setup>
defineProps({
  image: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isMain: { type: Boolean, default: false },
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <NuxtImg :src="image" :alt="title" class="rounded-2xl w-full object-cover cursor-pointer" />
    <p class="text-sm text-[#ed1e79]">
      {{ date }}
    </p>
    <h2 :class="`text-primary cursor-pointer ${isMain ? 'text-xl md:text-2xl font-semibold md:font-bold' : 'text-xl font-semibold'}`">
      {{ title }}
    </h2>
    <p class="text-gray-600 line-clamp-3 leading-5">
      {{ description }}
    </p>
  </div>
</template>
