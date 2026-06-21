<script setup lang="ts">
import { UButton } from "#components";
import ModalConfirmLunas from "./components/ModalConfirmLunas.vue";
import { columns } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/tagihan/admin/belum-dibayar", {
  query,
});

async function clickUpdate(id: number) {
  openModal(ModalConfirmLunas, { id, refresh });
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
      :columns="columns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template #aksi-cell="{ row }">
        <UButton
          v-if="row.original.status === 'menunggu_verifikasi'"
          size="sm"
          @click="() => clickUpdate(Number(row.original.id))"
        >
          Verifikasi
        </UButton>
        <div v-else>
          -
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
