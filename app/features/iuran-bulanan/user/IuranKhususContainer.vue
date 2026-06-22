<script setup lang="ts">
import type { HistoryState } from "vue-router";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import { formatDate } from "~/utils/index";
import { iuranKhususColumns } from "../constants";
import ModalBayarIuranKhusus from "./components/ModalBayarIuranKhusus.vue";

interface HistoryPembayaran {
  id: number;
  status: "pending" | "menunggu_verifikasi" | "lunas";
  nominal: number;
  tanggalBayar: string | null;
}

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/khusus/me", {
  query,
});

function clickPayment(id: number, nominalAnjuran: number) {
  openModal(ModalBayarIuranKhusus, { id, nominalAnjuran, refresh });
}

function clickHistory(historyPembayaran: HistoryPembayaran[]) {
  navigateTo({
    path: "/dashboard/user/history-pembayaran-iuran-khusus",
    state: {
      historyPembayaran: JSON.stringify(historyPembayaran),
    } as HistoryState,
  });
}
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="Object.assign(query, { search: $event, page: 1 })"
      />
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="iuranKhususColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template #nominalAnjuran-cell="{ row }">
        {{
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(row.original.nominalAnjuran)
        }}
      </template>
      <template #tanggalAkhir-cell="{ row }">
        {{ formatDate(row.original.tanggalAkhir) }}
      </template>
      <template #aksi-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            class="cursor-pointer"
            size="sm"
            @click="clickPayment(Number(row.original.id), row.original.nominalAnjuran)"
          >
            Bayar
          </UButton>

          <UButton
            class="cursor-pointer bg-orange-500 hover:bg-orange-400 active:bg-orange-400"
            size="sm"
            @click="clickHistory(row.original.historyPembayaran ?? [])"
          >
            History
          </UButton>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
