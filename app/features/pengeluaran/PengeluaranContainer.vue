<script setup lang="ts">
import type { Schema } from "./constants";
import { parseDate } from "@internationalized/date";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import CreateModal from "./components/CreateModal.vue";
import { columns, initFormData } from "./constants";

const modalOpen = ref(false);

const state = ref(initFormData) as Ref<Schema>;

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch("/api/v1/pengeluaran", {
  query,
});

function clickAdd() {
  state.value = { ...initFormData };
  modalOpen.value = true;
}

function clickEdit(item: ExtractFetchData<typeof data>[number]) {
  state.value = {
    id: item.id,
    judul: item.judul,
    nominal: item.nominal,
    tanggal: parseDate(item.tanggal),
    sumberDana: item.sumberDana,
    iuranKhususId: item.iuranKhususId ?? undefined,
  };
  modalOpen.value = true;
}

async function clickDelete(ids: number[]) {
  openModal(ModalConfirm, { path: "/api/v1/pengeluaran", body: { ids }, refresh });
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
        @update:model-value="Object.assign(query, { search: $event, page: 1 })"
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
      @edit="clickEdit"
      @delete="clickDelete"
    />
  </UCard>
</template>
