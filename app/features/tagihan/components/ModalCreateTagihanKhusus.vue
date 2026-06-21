<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { CreateTagihanKhususSchema, UpdateTagihanSchema } from "../constants";
import { FetchError } from "ofetch";
import {
  createTagihanKhususSchema,
  updateTagihanSchema,
} from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open");

const state = defineModel<CreateTagihanKhususSchema>("state", {
  required: true,
});

const isLoading = ref(false);

const formSchema = computed(() => {
  return state.value.id
    ? updateTagihanSchema
    : createTagihanKhususSchema;
});

type TagihanFormSubmit = CreateTagihanKhususSchema | UpdateTagihanSchema;

async function onSubmit(event: FormSubmitEvent<TagihanFormSubmit>) {
  isLoading.value = true;
  const isEdit = !!state.value.id;

  try {
    await $fetch(
      isEdit
        ? `/api/v1/tagihan/admin/${state.value.id}`
        : "/api/v1/tagihan/admin",
      {
        method: isEdit ? "PATCH" : "POST",
        body: isEdit
          ? {
              judul: event.data.judul,
              deskripsi: event.data.deskripsi,
              nominal: event.data.nominal,
            }
          : event.data,
      },
    );

    openModel.value = false;
    emit("submit");

    useToastSuccess("Sukses", `Berhasil ${isEdit ? "Edit" : "Tambah"} Data Tagihan`);
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
    :title="`${state.id ? 'Edit' : 'Tambah'} Tagihan`"
    class="max-w-4xl"
  >
    <template #body>
      <UForm
        id="form"
        :schema="formSchema"
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

        <UFormField label="Deskripsi Tagihan" name="deskripsi">
          <UInput
            v-model="state.deskripsi"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField label="Nominal" name="nominal">
          <UInput
            v-model.number="state.nominal"
            type="number"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField v-if="!state.id" label="Member" name="userIds">
          <InputMember
            v-model="state.userIds"
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
