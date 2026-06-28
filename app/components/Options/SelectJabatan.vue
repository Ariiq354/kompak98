<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();

const { data } = await useFetch("/api/v1/jabatan/options");

const selectedJabatan = defineModel<number>();
</script>

<template>
  <USelectMenu
    v-model="selectedJabatan"
    :items="data"
    label-key="jabatan"
    value-key="id"
    :disabled="disabled"
    placeholder="Pilih Jabatan"
  />
</template>
