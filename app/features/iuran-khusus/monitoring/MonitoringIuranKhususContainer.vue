<script setup lang="ts">
import type { Schema } from "./constants";
import type { ExtractFetchData, PageSearch } from "~/utils/types";
import { parseDate } from "@internationalized/date";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { openModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import CreateModal from "./components/CreateModal.vue";
import { initFormData, iuranKhususColumns } from "./constants";

const modalOpen = ref(false);

const state = ref(initFormData) as Ref<Schema>;

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch("/api/v1/iuran/khusus/monitoring", {
  query,
});

function clickHistory(id: number) {
  navigateTo({
    path: `/dashboard/admin/monitoring-iuran-khusus/${id}`,
  });
}

function clickAdd() {
  state.value = structuredClone(initFormData);
  modalOpen.value = true;
}

function clickUpdate(itemData: ExtractFetchData<typeof data>[number]) {
  modalOpen.value = true;
  state.value = {
    id: itemData.id,
    judul: itemData.judul,
    deskripsi: itemData.deskripsi,
    nominalAnjuran: itemData.nominalAnjuran,
    tanggalAkhir: itemData.tanggalAkhir ? parseDate(itemData.tanggalAkhir) : undefined,
  };
}

async function clickDelete(ids: number[]) {
  openModal(ModalConfirm, { path: "/api/v1/iuran/khusus/monitoring", body: { ids }, refresh });
}
</script>

<template>
  <CreateModal
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
      />
      <UButton
        icon="i-lucide-plus"
        class="text-white dark:bg-blue-600 hover:dark:bg-blue-600/75"
        @click="clickAdd"
      >
        <p class="hidden md:block">
          Tambah
        </p>
      </UButton>
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="iuranKhususColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
      deletable
      editable
      viewable
      @view="(row) => clickHistory(row.id)"
      @edit="clickUpdate"
      @delete="clickDelete"
    >
      <template #daskripsi-cell="{ row }">
        <div class="max-w-md">
          {{ row.original.deskripsi }}
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
