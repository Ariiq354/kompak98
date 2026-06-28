<script setup lang="ts">
import type { BarChartProps } from "../constant";
import { Orientation } from "#imports";

const props = defineProps<BarChartProps>();

const categories = computed(() => ({
  total: {
    name: "Total Pegawai",
    color: "#22c55e",
  },
}));

const yFormatter = (i: number): string => `${props.data[i]?.provinsi}`;
const xFormatter = (tick: number) => tick.toString();
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
        :data="data"
        :height="600"
        :categories="categories"
        :y-num-ticks="data.length"
        :y-axis="['total']"
        :x-num-ticks="5"
        :radius="4"
        :y-grid-line="true"
        :hide-legend="true"
        :y-formatter="yFormatter"
        :x-formatter="xFormatter"
        :orientation="Orientation.Horizontal"
      />
    </ClientOnly>
  </div>
</template>
