<script setup lang="ts">
import type { BulletLegendItemInterface } from "@unovis/ts";
import { LegendPosition } from "#imports";

const { data: chartData } = await useFetch("/api/v1/dashboard/iuran");

const categories: Record<string, BulletLegendItemInterface> = {
  pemasukan: { name: "Pemasukan", color: "#3b3fba" },
  pengeluaran: { name: "Pengeluaran", color: "#ef4444" },
};

const xFormatter = (i: number): string => `${chartData.value![i]?.bulan}`;
const yFormatter = (tick: number) => tick.toString();
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-xl font-bold text-center">
      Grafik Transaksi
    </p>
    <ClientOnly>
      <template #fallback>
        <USkeleton class="h-130 w-full rounded-xl" />
      </template>
      <BarChart
        :data="chartData ?? []"
        :height="500"
        :categories="categories"
        :y-axis="['pemasukan', 'pengeluaran']"
        :group-padding="0"
        :bar-padding="0.2"
        :x-num-ticks="12"
        :radius="4"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :y-grid-line="true"
        :hide-legend="false"
        :legend-position="LegendPosition.TopRight"
      />
    </ClientOnly>
  </div>
</template>
