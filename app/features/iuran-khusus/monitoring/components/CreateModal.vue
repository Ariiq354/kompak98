<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Schema>("state", {
  required: true,
});

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;

    await $fetch(
      isEdit
        ? `/api/v1/iuran/khusus/monitoring/${state.value.id}`
        : "/api/v1/iuran/khusus/monitoring/",
      {
        method: isEdit ? "PATCH" : "POST",
        body: {
          ...event.data,
          tanggalAkhir: event.data.tanggalAkhir ? event.data.tanggalAkhir.toString() : undefined,
        },
      },
    );

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
    :title="`${state.id ? 'Edit' : 'Tambah'} Iuran Khusus`"
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
        <UFormField label="Nama Iuran" name="judul">
          <UInput
            v-model="state.judul"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Deskripsi" name="deskripsi">
          <UInput
            v-model="state.deskripsi"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Nominal Anjuran" name="nominalAnjuran">
          <UInputNumber
            v-model="state.nominalAnjuran"
            orientation="vertical"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Batas Pembayaran" name="tanggalAkhir">
          <InputCalendar
            v-model="state.tanggalAkhir"
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
        @click="() => { openModel = false }"
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
