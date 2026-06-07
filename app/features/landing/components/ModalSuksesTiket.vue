<script setup lang="ts">
interface Props {
  noTiket?: string | null;
}

defineProps<Props>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal
    title="PERHATIAN!"
    description="Pengaduan anda berhasil terkirim, silahkan catat dan simpan kode tiket dibawah ini untuk tracking proses pengaduan."
    :close="{ onClick: () => emit('close', false) }"
  >
    <template #body>
      <div class="flex flex-col items-center justify-center p-6 space-y-4">
        <p class="text-sm text-gray-500 font-medium">
          Nomor Tiket Anda:
        </p>

        <div
          class="bg-gray-100 border border-dashed border-gray-300 text-2xl font-mono font-bold tracking-wider px-6 py-3 rounded-lg text-eucalyptus-700 selection:bg-eucalyptus-100"
        >
          {{ noTiket }}
        </div>
      </div>
    </template>
  </UModal>
</template>
