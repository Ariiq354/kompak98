<script setup lang="ts">
import CardSummary from "./CardSummary.vue";

const { data: summary } = await useFetch("/api/v1/iuran/bulanan/monitoring/summary");

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
    <CardSummary
      title="Total Kas"
      :total="formatRupiah(summary?.totalKas ?? 0)"
      icon="i-lucide-dollar-sign"
      icon-color="text-blue-600 dark:text-blue-400"
      bg-icon="bg-blue-100 dark:bg-blue-900/50"
    />

    <CardSummary
      title="Total Belum Bayar"
      :total="formatRupiah(summary?.totalBelumBayar ?? 0)"
      icon="i-lucide-hourglass"
      icon-color="text-orange-600 dark:text-orange-400"
      bg-icon="bg-orange-100 dark:bg-orange-900/50"
    />

    <CardSummary
      title="Persentase Pembayaran"
      :total="`${summary?.persentase ?? 0}%`"
      icon="i-lucide-check-circle"
      icon-color="text-green-600 dark:text-green-400"
      bg-icon="bg-green-100 dark:bg-green-900/50"
    />
  </div>
</template>
