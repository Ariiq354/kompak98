<script setup lang="ts">
import { useKotaOptions } from "~/composables/wilayah";

const props = defineProps<{
  provinceId?: number;
  disabled?: boolean;
}>();

const selectedRegency = defineModel<number>();

// Fetch options and state from composable
const { data: kotaByProvinsi, status: statusByProvinsi, load } = useKotaOptions();

// Computed properties for selected province
const provinceId = computed(() => props.provinceId);

const data = computed(() => {
  if (!provinceId.value)
    return [];
  return kotaByProvinsi.value[provinceId.value] ?? [];
});

const status = computed(() => {
  if (!provinceId.value)
    return "idle";
  return statusByProvinsi.value[provinceId.value] ?? "idle";
});

// Load data on mounted if provinceId is preset
onMounted(() => {
  if (provinceId.value) {
    load(provinceId.value);
  }
});

// Watch provinceId changes to reset selected city and fetch new data
watch(
  () => props.provinceId,
  (currentProvinceId, previousProvinceId) => {
    // Reset selected city only if the province actually changed
    if (previousProvinceId !== undefined && currentProvinceId !== previousProvinceId) {
      selectedRegency.value = undefined;
    }

    if (currentProvinceId) {
      load(currentProvinceId);
    }
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
    :placeholder="status === 'error' ? 'Gagal memuat. Klik untuk coba lagi' : 'Pilih Kota / Kabupaten'"
    @click="status === 'error' && provinceId && load(provinceId)"
  />
</template>
