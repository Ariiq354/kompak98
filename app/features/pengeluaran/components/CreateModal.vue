<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { schema, sumberDanaOptions } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Schema>("state", {
  required: true,
});

const { data: option } = await useFetch("/api/v1/iuran/khusus/options");

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/pengeluaran/${isEdit ? state.value.id : ""}`;

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: {
        judul: event.data.judul,
        nominal: event.data.nominal,
        sumberDana: event.data.sumberDana,
        tanggal: event.data.tanggal.toString(),
        iuranKhususId: event.data.sumberDana === "khusus" ? event.data.iuranKhususId : undefined,
      },
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
        <UFormField label="Judul pengeluaran" name="judul">
          <UInput
            v-model="state.judul"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Nominal" name="nominal">
          <UInputNumber
            v-model="state.nominal"
            orientation="vertical"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Tanggal" name="tanggal">
          <InputCalendar
            v-model="state.tanggal"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Sumber Dana" name="sumberDana">
          <USelect
            v-model="state.sumberDana"
            :items="sumberDanaOptions"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField v-if="state.sumberDana === 'khusus'" label="Iuran" name="iuranKhususId">
          <USelectMenu
            v-model="state.iuranKhususId"
            :items="option"
            value-key="id"
            label-key="judul"
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
