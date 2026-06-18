<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useSubmit } from "~/composables/function";

const page = ref(1);
const search = ref("");

const { data: tagihanData, status, refresh } = await useFetch("/api/v1/tagihan/me", {
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
  {
    accessorKey: "nominal",
    header: "Nominal",
    cell: ({ row }) => `Rp ${row.original.nominal.toLocaleString("id-ID")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusMap: Record<string, { label: string; color: string }> = {
        pending: { label: "Belum Bayar", color: "warning" },
        menunggu_verifikasi: { label: "Menunggu Verifikasi", color: "info" },
        lunas: { label: "Lunas", color: "success" },
      };
      const s = statusMap[row.original.status as string] || { label: row.original.status, color: "neutral" };
      return h(UBadge, { color: s.color as any, variant: "subtle" }, () => s.label);
    },
  },
  {
    accessorKey: "tanggalBayar",
    header: "Tanggal Bayar",
    cell: ({ row }) => row.original.tanggalBayar ? new Date(row.original.tanggalBayar).toLocaleDateString("id-ID") : "-",
  },
];

const { execute: payTagihan, isLoading: isPaying } = useSubmit();

const UBadge = resolveComponent("UBadge");

async function onBayar(row: any) {
  await payTagihan({
    path: `/api/v1/tagihan/${row.id}/bayar`,
    method: "PATCH",
    onSuccess: () => {
      useToastSuccess("Berhasil", "Tagihan berhasil dikirim untuk verifikasi");
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
        Tagihan Saya
      </h1>
      <InputSearch v-model="search" placeholder="Cari tagihan..." />
    </div>

    <DataTable
      v-model:page="page"
      :data="tagihanData?.data"
      :total="tagihanData?.total"
      :columns="columns"
      :loading="status === 'pending' || isPaying"
      pagination
      enumerate
      :dropdown-items="(row) => [
        {
          label: 'Bayar',
          icon: 'i-lucide-credit-card',
          disabled: row.status !== 'pending',
          onSelect: () => onBayar(row),
        },
      ]"
    />
  </div>
</template>
