<script setup lang="ts">
import type { BarChartProps } from "../constant";

const props = defineProps<BarChartProps>();

const chartData = computed(() =>
  props.data.map(item => ({
    provinsi: item.provinsi,
    total: item.total,
  })),
);

function xFormatter(index: number): string {
  return chartData.value[index]?.provinsi ?? "";
}

const categories = computed(() => ({
  total: {
    name: "Total Member",
    color: "#22c55e",
  },
}));
</script>

<template>
  <div class="chart-provinsi flex flex-col gap-4">
    <p class="text-xl font-bold text-center">
      {{ title }}
    </p>

    <ClientOnly>
      <template #fallback>
        <USkeleton class="h-96 w-full rounded-xl" />
      </template>

      <BarChart
        :data="chartData"
        :height="600"
        :categories="categories"
        :y-num-ticks="5"
        :y-axis="['total']"
        :x-num-ticks="chartData.length"
        :y-grid-line="true"
        :hide-legend="false"
        :x-formatter="xFormatter"
      />
    </ClientOnly>
  </div>
</template>
