<script setup lang="ts">
import CardSummary from "./CardSummary.vue";

const { data: summary } = await useFetch("/api/v1/iuran/bulanan/summary");

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
</script>

<template>
  <div class="grid grid-cols-3 gap-6">
    <CardSummary
      title="Total Kas"
      :total="formatRupiah(summary?.totalKas ?? 0)"
      icon="i-lucide-dollar-sign"
      icon-color="text-blue-600"
      bg-icon="bg-blue-100"
    />

    <CardSummary
      title="Total Belum Bayar"
      :total="formatRupiah(summary?.totalBelumBayar ?? 0)"
      icon="i-lucide-hourglass"
      icon-color="text-orange-600"
      bg-icon="bg-orange-100"
    />

    <CardSummary
      title="Persentase Pembayaran"
      :total="`${summary?.persentase ?? 0}%`"
      icon="i-lucide-check-circle"
      icon-color="text-green-600"
      bg-icon="bg-green-100"
    />
  </div>
</template>
