<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h } from "vue";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import ModalCreateTagihanKhusus from "./components/ModalCreateTagihanKhusus.vue";
import { baseColumns, getInitialFormDataTagihanKhusus } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useLazyFetch("/api/v1/tagihan/admin", {
  query,
});

const modalOpen = ref(false);

const state = shallowRef(getInitialFormDataTagihanKhusus());

function clickAdd() {
  state.value = structuredClone(getInitialFormDataTagihanKhusus());
  modalOpen.value = true;
}

function clickUpdate(itemData: ExtractFetchData<typeof data>[number]) {
  state.value = {
    id: itemData.id,
    judul: itemData.judul,
    deskripsi: itemData.deskripsi,
    nominal: itemData.nominal,
    userIds: [],
  };

  modalOpen.value = true;
}

async function clickDelete(id: number) {
  openModal(ModalConfirm, { path: "/api/v1/tagihan/admin", body: { ids: [id] }, refresh });
}

const columns: TableColumn<any>[] = [
  ...baseColumns,
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-1" }, [
        h(UButton, {
          icon: "i-lucide-pencil",
          color: "primary",
          variant: "ghost",
          size: "sm",
          class: "cursor-pointer",
          onClick: () => clickUpdate(row.original),
        }),
        h(UButton, {
          icon: "i-lucide-trash-2",
          color: "error",
          variant: "ghost",
          size: "sm",
          class: "cursor-pointer",
          onClick: () => clickDelete(row.original.id),
        }),
      ]),
  },
];

async function generateTagihanBulanan() {
  try {
    await $fetch("/api/v1/cron/kas-bulanan", {
      method: "POST",
      credentials: "include",
    });
    refresh();

    useToastSuccess("Gagal Generate Tagihan Kas Bulanan");
  }
  catch (error: any) {
    useToastError("Gagal Generate Tagihan Kas Bulanan", error.data.message);
  }
}
</script>

<template>
  <div>
    <UButton @click="generateTagihanBulanan">
      Buat Tagihan Kas Bulanan
    </UButton>
  </div>

  <div class="rounded-lg bg-white p-5 shadow-sm flex gap-2 md:gap-4">
    <InputSearch :model-value="query.search" @update:model-value="ObjectAssign(query, { search: $event, page: 1 })" />
    <UButton
      icon="i-lucide-plus"
      class="cursor-pointer"
      @click="clickAdd"
    >
      <p class="hidden md:block">
        Buat Tagihan
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
  />

  <ModalCreateTagihanKhusus
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
</template>
