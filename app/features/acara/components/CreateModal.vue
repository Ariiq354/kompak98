<script setup lang="ts">
import type { Schema } from "../constants";
import { CalendarDate } from "@internationalized/date";
import { FetchError } from "ofetch";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Partial<Schema>>("state", {
  required: true,
});

const isLoading = ref(false);
async function onSubmit() {
  const formData = new FormData();

  for (const [key, value] of Object.entries(
    state.value as Record<string, any>,
  )) {
    if (value) {
      if (value instanceof CalendarDate) {
        formData.append(key, value.toString());
        continue;
      };
      formData.append(key, value);
    }
  }
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/acara/${isEdit ? state.value.id : ""}`;

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
    });

    useToastSuccess("Sukses", "Data berhasill diubah");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Failed", error.data.message);
    }
    else {
      useToastError("Submit Failed", "Internal Server Error");
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    title="Tambah Pengeluaran"
    class="max-w-4xl"
  >
    <template #body>
      <UForm
        id="form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Foto Acara" name="foto">
          <UploadImage
            v-model:file="state.file"
            v-model:foto="state.foto"
            ratio="16:9"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Judul Acara" name="judul">
          <UInput
            v-model="state.judul"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Deskripsi Acara" name="deskripsi">
          <UTextarea
            v-model="state.deskripsi"
            :disabled="isLoading"
            :rows="4"
          />
        </UFormField>
        <UFormField label="Tempat" name="tempat">
          <UInput
            v-model="state.tempat"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Tanggal" name="tanggal">
          <InputCalendar
            v-model="state.tanggal"
            :disabled="isLoading"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        @click="openModel = false"
      >
        Tutup
      </UButton>
      <UButton
        type="submit"
        icon="i-lucide-check"
        :loading="isLoading"
        form="form"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>
