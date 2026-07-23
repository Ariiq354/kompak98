<script setup lang="ts">
const nominal = defineModel<number | null>({ default: null });

const formattedNominal = computed({
  get: () => nominal.value === null
    ? ""
    : new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 0,
      }).format(nominal.value),
  set: (value: string) => {
    const digits = value.replace(/\D/g, "");
    nominal.value = digits ? Number(digits) : null;
  },
});
</script>

<template>
  <UInput
    v-model="formattedNominal"
    inputmode="numeric"
  />
</template>
