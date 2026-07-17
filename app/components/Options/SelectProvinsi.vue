<script setup lang="ts">
import { useProvinsiOptions } from "~/composables/wilayahOptions";

defineProps<{
  disabled?: boolean;
}>();

const { data, status, load } = useProvinsiOptions();
const selectedProvinsi = defineModel<number>();

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
    placeholder="Pilih Provinsi"
  />
</template>
