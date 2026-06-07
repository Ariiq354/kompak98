<script setup lang="ts">
import StatusPenanganan from "./components/StatusPenanganan.vue";
</script>

<template>
  <div class="bg-white-pointer-50">
    <div class="container mx-auto pt-40 pb-20">
      <div class="bg-white py-10 flex flex-col items-center justify-center gap-8 rounded-xl shadow-sm">
        <p class="text-4xl font-bold text-eucalyptus-700">
          Pantau Status Laporan Anda
        </p>
        <p class="w-175 text-wrap text-center">
          Masukkan Nomor Tiket / Tracking ID laporan yang telah Anda kirimkan untuk melihat perkembangan penanganan secara real-time.
        </p>
        <div class="flex gap-2">
          <UInput
            type="text" placeholder="GEMA-XXXX-XXXX" :ui="{
              base: 'bg-eucalyptus-50',
            }"
            class="focus:ring-white-pointer-200 w-96"
          />
          <UButton class="flex items-center justify-center gap-2 text-white bg-eucalyptus-600 hover:bg-eucalyptus-700 cursor-pointer px-4 py-1">
            <UIcon name="i-lucide-search" class="text-base" />
            <p class="text-base">
              Lacak
            </p>
          </UButton>
        </div>
      </div>

      <StatusPenanganan />
    </div>
  </div>
</template>
