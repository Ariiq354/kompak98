<script setup lang="ts">
import type { QueryParam } from "./types";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import { ObjectAssign } from "~/utils";
import { YEAR_OPTION } from "~/utils/constant";
import StatusCell from "../components/StatusCell.vue";
import CardSummaryIuran from "./components/CardSummaryIuran.vue";
import { FILTER_OPTIONS, iuranBulananColumns } from "./constants";

const query = ref<QueryParam>({
  page: 1,
  tahun: 2026,
});

const { data, status } = await useFetch("/api/v1/iuran/bulanan/monitoring", {
  query,
});

function clickHistory(userId: number, iuranId: number) {
  navigateTo({
    path: `/dashboard/admin/monitoring-iuran-bulanan/${iuranId}`,
    query: { userId },
  });
}
</script>

<template>
  <CardSummaryIuran />

  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <USelect
        v-model="query.tahun"
        :items="YEAR_OPTION"
        class="w-32"
        @update:model-value="ObjectAssign(query, { tahun: $event, page: 1 })"
      />
      <USelectMenu
        v-model="query.filter"
        :items="[...FILTER_OPTIONS]"
        class="w-32"
        label-key="label"
        value-key="value"
        :search-input="false"
        placeholder="Filter"
        clear
        @update:model-value="ObjectAssign(query, { filter: $event ?? undefined, page: 1 })"
      />
      <InputSearch
        :model-value="query.search"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
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
          <StatusCell :row="row" :bulan="bulan" />
        </div>
      </template>

      <template #aksi-cell="{ row }">
        <div class="flex justify-center">
          <UButton
            class="cursor-pointer"
            color="warning"
            size="sm"
            @click="clickHistory(row.original.id, row.original.iuranId)"
          >
            Detail
          </UButton>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
