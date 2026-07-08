<script setup lang="ts">
defineProps<{
  title: string;
  total: number | string;
  icon: string;
  iconColor: string;
  bgIcon: string;
}>();
</script>

<template>
  <UCard>
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col">
        <span class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ title }}
        </span>

        <span class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ total }}
        </span>
      </div>

      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        :class="bgIcon"
      >
        <UIcon
          :name="icon"
          class="h-6 w-6"
          :class="iconColor"
        />
      </div>
    </div>
  </UCard>
</template>
