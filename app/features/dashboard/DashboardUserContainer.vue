<script setup lang="ts">
import CardSummaryDashboard from "./components/CardSummaryDashboard.vue";
import ChartIuran from "./components/ChartIuran.vue";
import ChartTotalMember from "./components/ChartTotalMember.vue";

const { data } = await useFetch("/api/v1/dashboard");
</script>

<template>
  <div class="overflow-y flex flex-col gap-10">
    <CardSummaryDashboard v-if="data" :data="{ totalUser: data?.totalUser, totalLaki: data?.totalLaki, totalPerempuan: data?.totalPerempuan }" />

    <UCard class="md:col-span-3">
      <ChartTotalMember title="Grafik Total Member per Provinsi" :data="data?.chartProvinsi ?? []" />
    </UCard>

    <UCard class="md:col-span-3">
      <ChartIuran title="Grafik Pemasukan dan Pengeluaran Kas" :data="data?.chartPemasukan ?? []" />
    </UCard>
  </div>
</template>
