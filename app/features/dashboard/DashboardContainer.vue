<script setup lang="ts">
import CardSummaryDashboard from "./components/CardSummaryDashboard.vue";
import ChartTotalMember from "./components/ChartTotalMember.vue";

const { data } = await useFetch("/api/v1/dashboard");
</script>

<template>
  <CardSummaryDashboard v-if="data" :data="{ totalUser: data?.totalUser, totalLaki: data?.totalLaki, totalPerempuan: data?.totalPerempuan }" />

  <UCard class="md:col-span-3">
    <ChartTotalMember title="Grafik Total Member per Provinsi" :data="data?.chartProvinsi ?? []" />
  </UCard>
</template>
