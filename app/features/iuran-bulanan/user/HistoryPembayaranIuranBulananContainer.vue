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
  openModal(ModalBayarHistory, { id, nominal, bulanan: true });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer"
      to="/dashboard/user/iuran-bulanan"
      leading-icon="i-lucide-step-back"
      variant="soft"
    >
      Kembali
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
          v-if="row.original.status === 'pending'"
          class="cursor-pointer"
          size="sm"
          @click="
            clickPayment(
              Number(row.original.id),
              row.original.nominal,
            )
          "
        >
          Bayar
        </UButton>
        <div v-else>
          -
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
