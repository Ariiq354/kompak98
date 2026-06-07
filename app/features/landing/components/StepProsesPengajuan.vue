<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import { ref } from "vue";

const activeStep = ref(1);

const items = ref<StepperItem[]>([
  {
    title: "Tulis Laporan",
    description: "Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap",
    icon: "i-lucide-square-pen",
    disabled: activeStep.value !== 0,
  },
  {
    title: "Proses Verifikasi",
    description: "Dalam 3 hari, laporan Anda akan diverifikasi dan diteruskan",
    icon: "i-lucide-file-down",
    disabled: activeStep.value !== 1,
  },
  {
    title: "Proses Tindak Lanjut",
    description: "Instansi akan menindaklanjuti dan membalas laporan Anda",
    icon: "i-lucide-file-check-2",
    disabled: activeStep.value !== 2,
  },
  {
    title: "Selesai",
    description: "Laporan Anda akan terus ditindaklanjuti hingga terselesaikan",
    icon: "i-lucide-check",
    disabled: activeStep.value !== 3,
  },
]);
</script>

<template>
  <div class="relative my-40">
    <div class="container mx-auto">
      <UStepper v-model="activeStep" :items="items" color="warning">
        <template #indicator="{ item }">
          <UIcon
            :name="item.icon"
            class="size-5"
          />
        </template>

        <template #title="{ item }">
          <p class="max-w-42 text-center text-[16px] font-bold mx-auto my-2">
            {{ item.title }}
          </p>
        </template>

        <template #description="{ item }">
          <p class="max-w-42 text-center mx-auto">
            {{ item.description }}
          </p>
        </template>
      </UStepper>

      <div class="flex justify-center mt-10">
        <UButton class="py-2 px-6 text-base font-normal bg-white hover:bg-eucalyptus-600 text-eucalyptus-600 hover:text-white border border-eucalyptus-600 cursor-pointer">
          Pelajari Lebih Lanjut
        </UButton>
      </div>
    </div>
  </div>
</template>
