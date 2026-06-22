<!-- <script setup lang="ts">
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import ModalCreateTagihanKhusus from "./components/ModalCreateTagihanKhusus.vue";
import { adminColumns, getInitialFormDataTagihanKhusus } from "./constants";

const modalOpen = ref(false);

const state = ref(getInitialFormDataTagihanKhusus());

const query = ref<PageSearch>({ page: 1, search: "" });
const { data, status, refresh } = await useFetch("/api/v1/tagihan/admin", {
  query,
});

function clickAdd() {
  state.value = structuredClone(getInitialFormDataTagihanKhusus());
  modalOpen.value = true;
}

function clickUpdate(itemData: ExtractFetchData<typeof data>[number]) {
  state.value = { ...itemData, userIds: [] };

  modalOpen.value = true;
}

async function clickDelete(id: number) {
  openModal(ModalConfirm, { path: "/api/v1/tagihan/admin", body: { ids: [id] }, refresh });
}

async function generateTagihanBulanan() {
  try {
    await $fetch("/api/v1/cron/kas-bulanan", {
      method: "POST",
      credentials: "include",
    });
    refresh();

    useToastSuccess("Sukes");
  }
  catch (error: any) {
    useToastError("Gagal Generate Tagihan Kas Bulanan", error.data.message);
  }
}
</script>

<template>
  <ModalCreateTagihanKhusus
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch :model-value="query.search" @update:model-value="Object.assign(query, { search: $event, page: 1 })" />
      <UButton
        icon="i-lucide-plus"
        class="cursor-pointer"
        @click="clickAdd"
      >
        <p class="hidden md:block">
          Buat Tagihan
        </p>
      </UButton>
      <UButton @click="generateTagihanBulanan">
        Buat Kas Bulanan
      </UButton>
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="adminColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
      editable
      deletable
      selectable
      @edit="clickUpdate"
      @delete="clickDelete"
    />
  </UCard>
</template> -->

<template>
  Iuran Khusus
</template>
