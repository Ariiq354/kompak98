<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();

const { data, status } = await useLazyFetch("/api/v1/wilayah/provinsi");
const selectedProvinsi = defineModel<number>();
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
