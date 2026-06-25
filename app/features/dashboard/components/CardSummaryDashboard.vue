<script setup lang="ts">
defineProps<{
  data: {
    totalUser: number;
    totalLaki: number;
    totalPerempuan: number;
  };
}>();
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
    <CardSummary
      title="Total Member"
      :total="data.totalUser"
      icon="i-lucide-users"
      icon-color="text-blue-600 dark:text-blue-400"
      bg-icon="bg-blue-100 dark:bg-blue-900/50"
    />

    <CardSummary
      title="Total Member Laki-laki"
      :total="data.totalLaki"
      icon="i-streamline-sharp-user-single-neutral-male"
      icon-color="text-orange-600 dark:text-orange-400"
      bg-icon="bg-orange-100 dark:bg-orange-900/50"
    />

    <CardSummary
      title="Total Member Perempuan"
      :total="data.totalPerempuan"
      icon="i-streamline-sharp-user-single-neutral-female"
      icon-color="text-pink-600 dark:text-pink-400"
      bg-icon="bg-pink-100 dark:bg-pink-900/50"
    />
  </div>
</template>
