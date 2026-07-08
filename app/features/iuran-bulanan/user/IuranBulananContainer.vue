<script setup lang="ts">
import type { PageSearch } from "~/utils/types";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import { openModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import StatusCell from "../components/StatusCell.vue";
import ModalBayarIuranBulanan from "./components/ModalBayarIuranBulanan.vue";
import { iuranBulananColumns } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/bulanan/me", {
  query,
});

function clickPayment(id: number, bulan: number[]) {
  openModal(ModalBayarIuranBulanan, { id, bulan, refresh });
}

function clickHistory(id: number) {
  navigateTo({
    path: `/dashboard/user/iuran-bulanan/${id}`,
  });
}

function getAvailMonths(bulan: {
  bulan: number;
}[]) {
  const paidMonths = bulan.map(item => item.bulan);

  return Array.from({ length: 12 }, (_, index) => index + 1)
    .filter(month => !paidMonths.includes(month));
}
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
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
        <div class="flex gap-2 justify-center">
          <UButton
            v-if="row.original.bulan.length < 12"
            class="cursor-pointer"
            size="sm"
            @click="
              clickPayment(
                row.original.id,
                getAvailMonths(row.original.bulan),
              )
            "
          >
            Bayar
          </UButton>

          <UButton
            class="cursor-pointer"
            color="warning"
            size="sm"
            @click="clickHistory(row.original.id)"
          >
            History
          </UButton>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
