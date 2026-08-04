<script setup lang="ts">
import type { PageSearch } from "~/utils/types";
import { isBefore, parseISO, startOfDay } from "date-fns";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { openModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import ModalBayarIuranKhusus from "./components/ModalBayarIuranKhusus.vue";
import { iuranKhususColumns } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/khusus/me", {
  query,
});

function clickPayment(id: number, nominalAnjuran: number) {
  openModal(ModalBayarIuranKhusus, { id, nominalAnjuran, refresh });
}

function clickHistory(id: number) {
  navigateTo({
    path: `/dashboard/user/iuran-khusus/${id}`,
  });
}

function canPay(tanggalAkhir: string | null) {
  if (!tanggalAkhir)
    return true;

  return !isBefore(
    parseISO(tanggalAkhir),
    startOfDay(new Date()),
  );
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
      :columns="iuranKhususColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template #deskripsi-cell="{ row }">
        <div class="max-w-md text-wrap">
          {{ row.original.deskripsi }}
        </div>
      </template>
      <template #aksi-cell="{ row }">
        <div class="flex gap-2 justify-center">
          <UButton
            v-if="canPay(row.original.tanggalAkhir)"
            class="cursor-pointer"
            size="sm"
            @click="clickPayment(Number(row.original.id), row.original.nominalAnjuran)"
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
