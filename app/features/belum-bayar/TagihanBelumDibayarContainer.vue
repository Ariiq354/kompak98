<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { UButton } from "#components";
import ModalConfirmLunas from "./components/ModalConfirmLunas.vue";
import { baseColumns } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });
const queryParams = computed(() => {
  const params: Record<string, any> = {
    page: query.value.page,
  };

  if (query.value.search?.trim()) {
    params.search = query.value.search;
  }

  return params;
});

const { data, status, refresh } = await useLazyFetch("/api/v1/tagihan/admin/belum-dibayar", {
  query: queryParams,
});

async function clickUpdate(id: number) {
  openModal(ModalConfirmLunas, { path: `/api/v1/tagihan/admin/${id}/verifikasi`, body: { status: "lunas" }, refresh });
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
          onClick: () => clickUpdate(row.original.id),
        }),
      ]),
  },
];
</script>

<template>
  <div class="rounded-lg bg-white p-5 shadow-sm flex gap-2 md:gap-4">
    <InputSearch :model-value="query.search" @update:model-value="ObjectAssign(query, { search: $event, page: 1 })" />
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
</template>
