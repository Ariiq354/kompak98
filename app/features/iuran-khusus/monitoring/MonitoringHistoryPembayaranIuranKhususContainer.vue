<script setup lang="ts">
import type { HistoryPembayaran } from "../constants";
import { formatDate } from "~/utils/index";
import { historyIuranBulananColumn } from "../constants";
import ModalBayarHistory from "./components/ModalBayarHistory.vue";

const historyPembayaran = ref<HistoryPembayaran[]>([]);

onMounted(() => {
  const stateData = window.history.state?.historyPembayaran;

  historyPembayaran.value = stateData
    ? JSON.parse(stateData)
    : [];
});

function clickPayment(id: number, nominal: number) {
  openModal(ModalBayarHistory, { id, nominal, bulanan: false });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer bg-primary-50 font-medium text-primary-500 hover:bg-primary hover:text-white"
      to="/dashboard/admin/monitoring-iuran-khusus"
    >
      &lt;&lt; Kembali
    </UButton>

    <DataTable
      :data="historyPembayaran"
      :columns="historyIuranBulananColumn"
      :total="historyPembayaran.length"
      enumerate
    >
      <template #nominal-cell="{ row }">
        {{
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(row.original.nominal)
        }}
      </template>
      <template #tanggalBayar-cell="{ row }">
        {{ formatDate(row.original.tanggalBayar) }}
      </template>
      <template #aksi-cell="{ row }">
        <UButton
          :disabled="row.original.status !== 'menunggu_verifikasi'"
          class="cursor-pointer"
          size="sm"
          @click="
            clickPayment(
              Number(row.original.id),
              row.original.nominal,
            )
          "
        >
          Verifikasi
        </UButton>
      </template>
    </DataTable>
  </UCard>
</template>
