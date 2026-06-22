<script setup lang="ts">
import type { HistoryState } from "vue-router";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalBayarIuranBulanan from "./components/ModalBayarIuranBulanan.vue";
import { getAvailMonths, getStatusConfig, getStatusLabel, iuranBulananColumns } from "./constants";

interface HistoryPembayaran {
  id: number;
  status: "pending" | "menunggu_verifikasi" | "lunas";
  nominal: number;
  tanggalBayar: string | null;
}

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/bulanan/me", {
  query,
});

function clickPayment(id: number, pendingPayment: number[]) {
  openModal(ModalBayarIuranBulanan, { id, pendingPayment, refresh });
}

function clickHistory(historyPembayaran: HistoryPembayaran[]) {
  navigateTo({
    path: "/dashboard/user/history-pembayaran-iuran-bulanan",
    state: {
      historyPembayaran: JSON.stringify(historyPembayaran),
    } as HistoryState,
  });
}

function getStatusBulan(row: any, bulan: number) {
  return row.original.bulan?.find((item: any) => item.bulan === bulan)?.status;
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
      :columns="iuranBulananColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template
        v-for="bulan in 12"
        :key="bulan"
        #[`bulan_${bulan}-cell`]="{ row }"
      >
        <div class="flex justify-center">
          <UTooltip
            :text="getStatusLabel(getStatusBulan(row, bulan))"
            :content="{
              align: 'center',
              side: 'top',
              sideOffset: 8,
            }"
          >
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
              :class="[getStatusConfig(getStatusBulan(row, bulan)).class]"
            >
              <UIcon
                :name="getStatusConfig(getStatusBulan(row, bulan)).icon"
                class="h-4 w-4"
              />
            </div>
          </UTooltip>
        </div>
      </template>

      <template #aksi-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            class="cursor-pointer"
            size="sm"
            @click="
              clickPayment(
                Number(row.original.id),
                getAvailMonths(row.original.bulan),
              )
            "
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
