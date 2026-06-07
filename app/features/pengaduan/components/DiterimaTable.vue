<script setup lang="ts">
import DataTable from "~/components/Custom/DataTable.vue";
import { columns } from "../constants";

const query = ref({ page: 1 });
const acceptedTickets = [
  {
    noTiket: "TKT-006",
    judul: "Perbaikan notifikasi email",
    stat: "Diterima",
  },
  {
    noTiket: "TKT-007",
    judul: "Update profil pengguna",
    stat: "Diterima",
  },
  {
    noTiket: "TKT-008",
    judul: "Integrasi API pembayaran",
    stat: "Diterima",
  },
  {
    noTiket: "TKT-009",
    judul: "Perbaikan tampilan mobile",
    stat: "Diterima",
  },
  {
    noTiket: "TKT-010",
    judul: "Penambahan fitur pencarian",
    stat: "Diterima",
  },
];
</script>

<template>
  <DataTable
    v-model:page="query.page"
    :data="acceptedTickets"
    :columns="columns"
    :loading="false"
    enumerate
  />
</template>
