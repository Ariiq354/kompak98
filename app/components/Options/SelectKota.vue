<script setup lang="ts">
const props = defineProps<{
  provinceId?: number;
  disabled?: boolean;
}>();

const selectedRegency = defineModel<number>();
const provinceId = computed(() => props.provinceId);
const { data, status } = await useLazyFetch("/api/v1/wilayah/kota", {
  query: { provinsiId: provinceId },
});

watch(
  () => props.provinceId,
  (_provinceId, previousProvinceId) => {
    if (previousProvinceId !== undefined)
      selectedRegency.value = undefined;
  },
);
</script>

<template>
  <USelectMenu
    v-model="selectedRegency"
    :items="data ?? []"
    label-key="kota"
    value-key="id"
    :disabled="disabled || !provinceId || status === 'pending'"
    :loading="status === 'pending'"
    placeholder="Pilih Kota / Kabupaten"
  />
</template>
