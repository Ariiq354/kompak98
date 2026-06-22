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
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-500 mb-4">
          {{ title }}
        </p>

        <p class="mt-1 text-2xl font-bold">
          {{ total }}
        </p>
      </div>

      <div
        class="flex h-12 w-12 items-center justify-center rounded-lg"
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
