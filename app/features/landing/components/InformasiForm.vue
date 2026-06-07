<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { LaporanFormSchema } from "../constant";
import { useSubmit } from "~/composables/function";
import { initialFormDataPermintaanInformasi, permintaanInformasiSchema } from "../constant";
import ModalSuksesTiket from "./ModalSuksesTiket.vue";

type PermintaanInformasiFormSchema = Extract<
  LaporanFormSchema,
  { jenis: "permintaan_informasi" }
>;

const state = reactive({ ...initialFormDataPermintaanInformasi });

const { data, isLoading, execute } = useSubmit();

async function onSubmit(event: FormSubmitEvent<PermintaanInformasiFormSchema>) {
  const formDataPayload = event.data;
  isLoading.value = true;

  const bodyFormData = new FormData();
  bodyFormData.append("jenis", formDataPayload.jenis);
  bodyFormData.append("judul", formDataPayload.judul);
  bodyFormData.append("isi", formDataPayload.isi);
  bodyFormData.append("asalPelapor", formDataPayload.asalPelapor);

  if (formDataPayload.files) {
    bodyFormData.append("files", formDataPayload.files);
  }

  await execute({
    path: "/api/v1/tiket",
    body: bodyFormData,
    method: "POST",
    onSuccess() {
      if (data.value) {
        const noTiket = data.value.noTiket;
        openModal(ModalSuksesTiket, { noTiket });
      }
    },
    onError(error) {
      useToastError("Submit Failed", error.data.message);
    },
  });
}
</script>

<template>
  <div class="space-y-6">
    <UForm
      :schema="permintaanInformasiSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField label="Judul Laporan" name="judul">
        <UInput
          v-model="state.judul"
          placeholder="Masukkan Judul Laporan Anda"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Isi Laporan" name="isi">
        <UTextarea
          v-model="state.isi"
          placeholder="Masukkan Isi Laporan Anda"
          :disabled="isLoading"
        />
      </UFormField>

      <UFormField label="Asal Pelapor" name="asalPelapor">
        <UInput
          v-model="state.asalPelapor"
          placeholder="Masukkan Asal Pelapor"
          :disabled="isLoading"
        />
      </UFormField>

      <UFileUpload
        v-slot="{ open }"
        v-model="state.files"
        :disabled="isLoading"
      >
        <UButton class="border border-eucalyptus-700 text-eucalyptus-700 bg-white hover:bg-eucalyptus-700 hover:text-white flex items-center gap-2 w-44 cursor-pointer" @click="open()">
          <UIcon name="i-lucide-link-2" class="-rotate-45" />
          <p>Upload Lampiran</p>
        </UButton>
      </UFileUpload>

      <div
        v-if="state.files"
        class="mt-4 border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between"
      >
        <div class="flex items-start gap-3">
          <UIcon
            name="i-lucide-file-text"
            class="size-6 text-gray-500 mt-1"
          />

          <div>
            <p class="text-sm font-medium">
              Nama File : {{ state.files.name }}
            </p>

            <p class="text-xs text-gray-500">
              Ukuran File :
              {{ (state.files.size / 1024).toFixed(2) }} KB
            </p>
          </div>
        </div>

        <button
          type="button"
          class="cursor-pointer"
          @click="state.files = undefined"
        >
          <UIcon
            name="i-lucide-x"
            class="size-5 text-gray-400 hover:text-gray-600"
          />
        </button>
      </div>

      <UButton
        class="w-full bg-eucalyptus-600 hover:bg-eucalyptus-700 text-white text-base flex justify-center py-3 rounded-lg font-semibold cursor-pointer"
        type="submit"
        :disabled="isLoading"
        :loading="isLoading"
      >
        Kirim
      </UButton>
    </UForm>
  </div>
</template>
