<script setup lang="ts">
import type { BulletLegendItemInterface } from "@unovis/ts";
import type { AreaChartIuranProps } from "../constant";
import { formatRupiah } from "~/utils";

const props = defineProps<AreaChartIuranProps>();

const chartData = computed(() =>
  props.data.map(item => ({
    ...item,
    month: item.bulan.slice(0, 3),
  })),
);

function xFormatter(tick: number): string {
  return chartData.value[tick]?.month ?? "";
}

function yFormatter(value: number): string {
  return formatRupiah(value);
}

const categories: Record<string, BulletLegendItemInterface> = {
  pemasukan: { name: "Pemasukan", color: "#3b3fba" },
  pengeluaran: { name: "Pengeluaran", color: "#ef4444" },
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-xl font-bold text-center">
      {{ title }}
    </p>
    <ClientOnly>
      <template #fallback>
        <USkeleton class="h-80 w-full rounded-xl" />
      </template>
      <AreaChart
        :data="chartData"
        :height="500"
        :categories="categories"
        :y-num-ticks="5"
        :x-num-ticks="chartData.length"
        :y-grid-line="true"
        :hide-legend="false"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        index="month"
      />
    </ClientOnly>
  </div>
</template>
