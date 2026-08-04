<script setup lang="ts">
import type { QueryParams, Schema } from "./constants";
import type { ExtractFetchData } from "~/utils/types";
import { parseDate } from "@internationalized/date";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { openModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import { MONTH_OPTION, YEAR_OPTION } from "~/utils/constant";
import CreateModal from "./components/CreateModal.vue";
import QueryModal from "./components/QueryModal.vue";
import { columns, initFormData } from "./constants";

const modalOpen = ref(false);
const filterModal = ref(false);

const state = ref(initFormData) as Ref<Partial<Schema>>;

const query = ref<QueryParams>({ page: 1 });
const { data, status, refresh } = await useFetch("/api/v1/acara", {
  query,
});

function clickAdd() {
  state.value = { ...initFormData };
  modalOpen.value = true;
}

function clickEdit(item: ExtractFetchData<typeof data>[number]) {
  state.value = {
    id: item.id,
    deskripsi: item.deskripsi,
    judul: item.judul,
    tempat: item.tempat,
    foto: item.foto,
    tanggal: parseDate(item.tanggal),
  };
  modalOpen.value = true;
}

async function clickDelete(ids: number[]) {
  openModal(ModalConfirm, { path: "/api/v1/acara", body: { ids }, refresh });
}
</script>

<template>
  <CreateModal
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
  <QueryModal v-model:open="filterModal" v-model:query="query" />
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
      />
      <USelectMenu
        :model-value="query.tahun"
        :items="YEAR_OPTION"
        placeholder="Pilih Tahun"
        clear
        class="hidden flex-1 md:flex"
        @update:model-value="ObjectAssign(query, { tahun: $event ?? undefined, page: 1 })"
      />
      <USelectMenu
        :model-value="query.bulan"
        placeholder="Pilih Bulan"
        clear
        :items="MONTH_OPTION"
        label-key="label"
        value-key="value"
        class="hidden flex-1 md:flex"
        @update:model-value="ObjectAssign(query, { bulan: $event ?? undefined, page: 1 })"
      />
      <UButton
        variant="subtle"
        icon="i-lucide-filter"
        class="md:hidden"
        @click="() => { filterModal = true }"
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
      :columns="columns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
      deletable
      editable
      @delete="clickDelete"
      @edit="clickEdit"
    >
      <template #deskripsi-cell="{ row }">
        <div class="max-w-md text-wrap">
          {{ row.original.deskripsi }}
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
