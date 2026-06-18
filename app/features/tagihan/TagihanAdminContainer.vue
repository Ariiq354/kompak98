<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useSubmit } from "~/composables/function";

const page = ref(1);
const search = ref("");

const { data: tagihanData, status, refresh } = await useFetch("/api/v1/tagihan", {
  query: {
    page,
    limit: 10,
    search,
  },
  watch: [page, search],
});

const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "jenis", header: "Jenis" },
  {
    accessorKey: "nominal",
    header: "Nominal",
    cell: ({ row }) => `Rp ${row.original.nominal.toLocaleString("id-ID")}`,
  },
];

const { execute: createKas, isLoading: isCreatingKas } = useSubmit();
const { execute: deleteTagihan, isLoading: isDeleting } = useSubmit();

async function onCreateKas() {
  await createKas({
    path: "/api/v1/tagihan/kas-bulanan",
    method: "POST",
    onSuccess: () => {
      useToastSuccess("Berhasil", "Kas bulanan berhasil dibuat untuk semua anggota");
      refresh();
    },
    onError: (err) => {
      useToastError("Gagal", err.data?.message || "Terjadi kesalahan");
    },
  });
}

async function onDelete(ids: number | number[]) {
  const payloadIds = Array.isArray(ids) ? ids : [ids];
  await deleteTagihan({
    path: "/api/v1/tagihan",
    method: "DELETE",
    body: { ids: payloadIds },
    onSuccess: () => {
      useToastSuccess("Berhasil", "Tagihan berhasil dihapus");
      refresh();
    },
    onError: (err) => {
      useToastError("Gagal", err.data?.message || "Terjadi kesalahan");
    },
  });
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Kelola Tagihan
      </h1>
      <div class="flex items-center gap-3">
        <InputSearch v-model="search" placeholder="Cari tagihan..." />
        <UButton
          icon="i-lucide-plus"
          label="Kas Bulanan"
          :loading="isCreatingKas"
          @click="onCreateKas"
        />
      </div>
    </div>

    <DataTable
      v-model:page="page"
      :data="tagihanData?.data"
      :total="tagihanData?.total"
      :columns="columns"
      :loading="status === 'pending' || isDeleting"
      pagination
      enumerate
      selectable
      deletable
      @delete="onDelete"
    />
  </div>
</template>
