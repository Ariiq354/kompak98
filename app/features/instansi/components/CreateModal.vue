<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
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
        ? `/api/v1/instansi/${state.value.id}`
        : "/api/v1/instansi",
      {
        method: isEdit ? "PATCH" : "POST",
        body: event.data,
      },
    );

    openModel.value = false;
    emit("submit");
  }
  catch (error: any) {
    useToastError("Submit Failed", error.data.message);
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    :title="`${state.id ? 'Edit' : 'Tambah'} Instansi`"
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
        <UFormField label="Nama Instansi" name="nama">
          <UInput
            v-model="state.nama"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Aktif" name="isActive">
          <UCheckbox
            v-model="state.isActive"
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
