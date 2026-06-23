<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../../constants";
import { FetchError } from "ofetch";
import { schema } from "../../constants";

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
        ? `/api/v1/iuran/khusus/${state.value.id}`
        : "/api/v1/iuran/khusus/",
      {
        method: isEdit ? "PATCH" : "POST",
        body: event.data,
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
    :title="`${state.id ? 'Edit' : 'Tambah'} Tagihan Khusus`"
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
        <UFormField label="Nama Tagihan" name="judul">
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
          <UInput
            v-model="state.nominalAnjuran"
            type="number"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Batas Pembayaran" name="tanggalAkhir">
          <UInput
            v-model="state.tanggalAkhir"
            type="date"
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
        Batal
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
