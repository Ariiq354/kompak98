<script setup lang="ts">
import DataTable from "~/components/Custom/DataTable.vue";
import { columns } from "../constants";

const query = ref({ page: 1 });
const pendingTickets = [
  {
    noTiket: "TKT-001",
    judul: "Tidak bisa login aplikasi",
    stat: "Pending",
  },
  {
    noTiket: "TKT-002",
    judul: "Error saat upload dokumen",
    stat: "Pending",
  },
  {
    noTiket: "TKT-003",
    judul: "Permintaan reset password",
    stat: "Pending",
  },
  {
    noTiket: "TKT-004",
    judul: "Halaman dashboard lambat",
    stat: "Pending",
  },
  {
    noTiket: "TKT-005",
    judul: "Data tidak muncul di laporan",
    stat: "Pending",
  },
];
</script>

<template>
  <DataTable
    v-model:page="query.page"
    :data="pendingTickets"
    :columns="columns"
    :loading="false"
    enumerate
  />
</template>
