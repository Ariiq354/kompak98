<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import DiterimaTable from "./components/DiterimaTable.vue";
import PendingTable from "./components/PendingTable.vue";

const items: TabsItem[] = [
  {
    label: "Pending",
    icon: "i-lucide-user",
    slot: "pending",
  },
  {
    label: "Diterima",
    icon: "i-lucide-lock",
    slot: "diterima",
  },
];
</script>

<template>
  <div class="container flex items-center">
    <UTabs :items="items" class="w-full">
      <template #pending>
        <PendingTable />
      </template>
      <template #diterima>
        <DiterimaTable />
      </template>
    </UTabs>
  </div>
</template>
