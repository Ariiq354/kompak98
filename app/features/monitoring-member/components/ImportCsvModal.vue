<script setup lang="ts">
import { FetchError } from "ofetch";
import { useToastError, useToastSuccess } from "~/composables/toast";

const emit = defineEmits<{ submit: [] }>();
const open = defineModel<boolean>("open", { required: true });

const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);

function selectFile(event: Event) {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] ?? null;
}

function closeModal() {
  open.value = false;
}

async function uploadCsv() {
  if (!file.value) {
    useToastError("File belum dipilih", "Pilih file CSV hasil export terlebih dahulu.");
    return;
  }

  isLoading.value = true;
  try {
    const body = new FormData();
    body.append("file", file.value);
    const result = await $fetch<{ updated: number }>("/api/v1/users/import", {
      method: "POST",
      body,
    });

    useToastSuccess("Import berhasil", `${result.updated} data member berhasil diperbarui.`);
    file.value = null;
    open.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Import gagal", error.data?.statusMessage || error.message);
    }
    else {
      useToastError("Import gagal", "Terjadi kesalahan saat mengunggah CSV.");
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Upload Data Member"
    description="Gunakan file CSV hasil export, lalu unggah kembali setelah datanya diedit."
    class="max-w-lg"
  >
    <template #body>
      <input
        ref="fileInput"
        type="file"
        accept=".csv,text/csv"
        class="hidden"
        @change="selectFile"
      >

      <button
        type="button"
        class="w-full cursor-pointer rounded-xl border-2 border-dashed border-accented p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
        @click="fileInput?.click()"
      >
        <UIcon name="i-lucide-file-up" class="mx-auto mb-3 size-9 text-primary" />
        <p class="font-medium text-default">
          {{ file?.name || "Pilih file CSV" }}
        </p>
        <p class="mt-1 text-xs text-dimmed">
          Maksimal 5 MB
        </p>
      </button>
    </template>

    <template #footer>
      <UButton
        variant="ghost"
        :disabled="isLoading"
        @click="closeModal"
      >
        Batal
      </UButton>
      <UButton
        icon="i-lucide-upload"
        :loading="isLoading"
        :disabled="!file || isLoading"
        @click="uploadCsv"
      >
        Upload
      </UButton>
    </template>
  </UModal>
</template>
