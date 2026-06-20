<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h } from "vue";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalBayarTagihan from "./components/ModalBayarTagihan.vue";
import { baseColumnTagihanSaya } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useLazyFetch("/api/v1/tagihan/me", {
  query,
});

function clickPayment(id: number) {
  openModal(ModalBayarTagihan, { path: `/api/v1/tagihan/${id}/bayar`, body: { ids: [id] }, refresh });
}

const columns: TableColumn<any>[] = [
  ...baseColumnTagihanSaya,
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
          onClick: () => clickPayment(row.original.id),
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
