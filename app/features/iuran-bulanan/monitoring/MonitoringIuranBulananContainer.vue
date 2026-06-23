<script setup lang="ts">
import type { HistoryState } from "vue-router";
import type { HistoryPembayaran } from "../constants";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import { YEAR_OPTION } from "~/utils/constant";
import {
  getStatusConfig,
  getStatusLabel,

  monitoringIuranBulananColumns,
} from "../constants";
import CardSummaryIuran from "./components/CardSummaryIuran.vue";

const query = ref<PageSearch & { tahun: number }>({
  page: 1,
  search: "",
  tahun: 2026,
});

const { data, status } = await useFetch("/api/v1/iuran/bulanan/user", {
  query,
});

function clickHistory(historyPembayaran: HistoryPembayaran[]) {
  navigateTo({
    path: "/dashboard/admin/monitoring-history-pembayaran-iuran-bulanan",
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
  <CardSummaryIuran />

  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <USelect
        v-model="query.tahun"
        :items="YEAR_OPTION"
        value-key="value"
        class="w-32"
        @update:model-value="query.page = 1"
      />
      <InputSearch
        :model-value="query.search"
        @update:model-value="Object.assign(query, { search: $event, page: 1 })"
      />
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="monitoringIuranBulananColumns"
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
        <UButton
          class="cursor-pointer bg-orange-500 hover:bg-orange-400 active:bg-orange-400"
          size="sm"
          @click="clickHistory(row.original.historyPembayaran ?? [])"
        >
          Detail
        </UButton>
      </template>
    </DataTable>
  </UCard>
</template>
