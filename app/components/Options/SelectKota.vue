<script setup lang="ts">
import { useKotaOptions } from "~/composables/wilayahOptions";

const props = defineProps<{
  provinceId?: number;
  disabled?: boolean;
}>();

const selectedRegency = defineModel<number>();
const provinceId = computed(() => props.provinceId);
const { data: kotaByProvinsi, status: statusByProvinsi, load } = useKotaOptions();
const data = computed(() => provinceId.value ? kotaByProvinsi.value[provinceId.value] ?? [] : []);
const status = computed(() => provinceId.value ? statusByProvinsi.value[provinceId.value] ?? "idle" : "idle");

onMounted(() => {
  if (provinceId.value)
    load(provinceId.value);
});

watch(
  () => props.provinceId,
  (currentProvinceId, previousProvinceId) => {
    if (previousProvinceId !== undefined)
      selectedRegency.value = undefined;

    if (currentProvinceId)
      load(currentProvinceId);
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
