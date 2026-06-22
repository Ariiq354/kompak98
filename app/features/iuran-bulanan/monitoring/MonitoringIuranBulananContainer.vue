<script setup lang="ts">
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalBayarTagihan from "./components/ModalBayarTagihan.vue";
import { userColumns } from "./constants.js";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/bulanan/me", {
  query,
});

function clickPayment(id: number, nominal: number) {
  openModal(ModalBayarTagihan, { id, nominal, refresh });
}
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch :model-value="query.search" @update:model-value="Object.assign(query, { search: $event, page: 1 })" />
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="userColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template #aksi-cell="{ row }">
        <UButton
          v-if="row.original.status === 'pending'"
          size="sm"
          @click="() => clickPayment(
            Number(row.original.id),
            Number(row.original.nominal),
          )"
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
