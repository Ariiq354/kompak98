<script setup lang="ts">
import { useProvinsiOptions } from "~/composables/wilayah";

defineProps<{
  disabled?: boolean;
}>();

const selectedProvinsi = defineModel<number>();

// Fetch options and state from composable
const { data, status, load } = useProvinsiOptions();

// Fetch on mount
onMounted(load);
</script>

<template>
  <USelectMenu
    v-model="selectedProvinsi"
    :items="data ?? []"
    label-key="provinsi"
    value-key="id"
    :disabled="disabled || status === 'pending'"
    :loading="status === 'pending'"
    :placeholder="status === 'error' ? 'Gagal memuat. Klik untuk coba lagi' : 'Pilih Provinsi'"
    @click="status === 'error' && load()"
  />
</template>
