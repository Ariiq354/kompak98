<script setup lang="ts">
import AgendaPopup from "~/components/Modal/AgendaPopup.vue";
import CardSummary from "./components/CardSummary.vue";
import ChartTotalMember from "./components/ChartTotalMember.vue";

const { data } = await useFetch("/api/v1/dashboard");
const showAgendaPopup = ref(false);

onMounted(() => {
  showAgendaPopup.value = sessionStorage.getItem("show-agenda-after-login") === "true";
  sessionStorage.removeItem("show-agenda-after-login");
});
</script>

<template>
  <div class="overflow-y flex flex-col gap-10">
    <AgendaPopup
      v-if="showAgendaPopup"
      :open="showAgendaPopup"
      detail-target="/#akan-datang"
    />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <CardSummary
        title="Total Pegawai"
        :total="data?.summary.user.totalUser ?? 0"
        icon="i-lucide-users"
        icon-color="text-blue-600 dark:text-blue-400"
        bg-icon="bg-blue-100 dark:bg-blue-900/50"
        :details="data?.summary.user.byGender"
      />

      <CardSummary
        title="Pejabat Struktural"
        :total="data?.summary.PejabatStruktural.total ?? 0"
        icon="i-lucide-briefcase"
        icon-color="text-orange-600 dark:text-orange-400"
        bg-icon="bg-orange-100 dark:bg-orange-900/50"
        :details="data?.summary.PejabatStruktural.byKodeJabatan"
      />

      <CardSummary
        title="Pejabat Fungsional"
        :total="data?.summary.PejabatFungsional.total ?? 0"
        icon="i-lucide-award"
        icon-color="text-pink-600 dark:text-pink-400"
        bg-icon="bg-pink-100 dark:bg-pink-900/50"
        :details="data?.summary.PejabatFungsional.byKodeJabatan"
      />

      <CardSummary
        title="Pelaksana"
        :total="data?.summary.Pelaksana.total ?? 0"
        icon="i-lucide-user-cog"
        icon-color="text-green-600 dark:text-green-400"
        bg-icon="bg-green-100 dark:bg-green-900/50"
        :details="data?.summary.Pelaksana.byKodeJabatan"
      />
    </div>

    <UCard class="md:col-span-3">
      <ChartTotalMember title="Grafik Kantor Pegawai" :data="data?.chartProvinsiKantor ?? []" />
    </UCard>

    <UCard class="md:col-span-3">
      <ChartTotalMember title="Grafik Homebase Pegawai" :data="data?.chartProvinsi ?? []" />
    </UCard>
  </div>
</template>
