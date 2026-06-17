<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useSubmit } from "~/composables/function";

const page = ref(1);
const search = ref("");

const { data: unpaidData, status, refresh } = await useFetch("/api/v1/tagihan/belum-dibayar", {
  query: {
    page,
    limit: 10,
    search,
  },
  watch: [page, search],
});

const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul Tagihan" },
  { accessorKey: "namaAnggota", header: "Nama Anggota" },
];

const { execute: updateStatus, isLoading: isUpdating } = useSubmit();

async function onVerify(row: any) {
  await updateStatus({
    path: `/api/v1/tagihan/${row.id}/admin`,
    method: "PATCH",
    body: { status: "lunas" },
    onSuccess: () => {
      useToastSuccess("Berhasil", "Tagihan berhasil diverifikasi sebagai lunas");
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
        Tagihan Belum Dibayar
      </h1>
      <InputSearch v-model="search" placeholder="Cari tagihan atau anggota..." />
    </div>

    <DataTable
      v-model:page="page"
      :data="unpaidData?.data"
      :total="unpaidData?.total"
      :columns="columns"
      :loading="status === 'pending' || isUpdating"
      pagination
      enumerate
      :dropdown-items="(row) => [
        {
          label: 'Verifikasi Lunas',
          icon: 'i-lucide-check-circle',
          onSelect: () => onVerify(row)
        }
      ]"
    />
  </div>
</template>
