<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  path: string;
  body: object;
  refresh: () => void;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);

async function onClick() {
  loading.value = true;
  try {
    await $fetch(`${props.path}`, {
      method: "PATCH",
      body: props.body,
      credentials: "include",
    });
    props.refresh();
    emit("close", false);

    useToastSuccess("Berhasil", "Silahkan tunggu konfirmasi status pembayaran");
  }
  catch (error: any) {
    useToastError("Gagal Konfirmasi Pembayaran", error.data.message);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    :close="{ onClick: () => emit('close', false) }"
    title="Pembayaran"
    class="max-w-4xl"
  >
    <template #body>
      <div class="flex flex-col items-center gap-4">
        <NuxtImg
          src="/images/contoh-dana.jpg"
          alt="QRIS Pembayaran"
          class="w-full max-w-xs rounded-lg border"
        />

        <UButton
          to="/images/contoh-dana.jpg"
          target="_blank"
          download
          icon="i-lucide-download"
          variant="outline"
        >
          Download QRIS
        </UButton>

        <p class="max-w-lg text-center text-sm text-gray-600">
          Silahkan klik Konfirmasi Pembayaran jika sudah mentransfer sesuai nominal terbilang dan tunggu status konfirmasi dari admin.
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="loading"
        @click="emit('close')"
      >
        Batal
      </UButton>

      <UButton
        icon="i-lucide-check"
        :loading="loading"
        @click="onClick"
      >
        Konfirmasi Pembayaran
      </UButton>
    </template>
  </LazyUModal>
</template>
