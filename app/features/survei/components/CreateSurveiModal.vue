<script setup lang="ts">
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Partial<Schema>>("state", {
  required: true,
});

const isLoading = ref(false);

function addQuestion() {
  if (!state.value.pertanyaan) {
    state.value.pertanyaan = [];
  }
  state.value.pertanyaan.push({
    pertanyaan: "",
    wajib: false,
    nomorUrut: state.value.pertanyaan.length + 1,
  });
}

function removeQuestion(index: number) {
  state.value.pertanyaan?.splice(index, 1);
}

// Make sure there is at least one question when creating
watch(
  openModel,
  (val) => {
    if (val && !state.value.id) {
      if (!state.value.pertanyaan || state.value.pertanyaan.length === 0) {
        state.value.pertanyaan = [
          {
            pertanyaan: "",
            wajib: false,
            nomorUrut: 1,
          },
        ];
      }
    }
  },
  { immediate: true },
);

async function onSubmit() {
  const isEdit = !!state.value.id;

  // Validate questions if creating
  if (!isEdit) {
    if (!state.value.pertanyaan || state.value.pertanyaan.length === 0) {
      useToastError("Gagal", "Minimal harus ada 1 pertanyaan");
      return;
    }
    const emptyQuestion = state.value.pertanyaan.some(p => !p.pertanyaan?.trim());
    if (emptyQuestion) {
      useToastError("Gagal", "Semua pertanyaan wajib diisi teksnya");
      return;
    }
  }

  isLoading.value = true;
  try {
    const url = `/api/v1/survei/${isEdit ? state.value.id : ""}`;
    const body = isEdit
      ? {
          judul: state.value.judul,
          deskripsi: state.value.deskripsi || "",
        }
      : {
          judul: state.value.judul,
          deskripsi: state.value.deskripsi || "",
          pertanyaan: state.value.pertanyaan!.map((p, idx) => ({
            pertanyaan: p.pertanyaan,
            wajib: !!p.wajib,
            nomorUrut: idx + 1,
          })),
        };

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body,
    });

    useToastSuccess("Sukses", isEdit ? "Data survei berhasil diubah" : "Survei berhasil dibuat");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal menyimpan", error.data?.message || "Terjadi kesalahan");
    }
    else {
      useToastError("Gagal menyimpan", "Internal Server Error");
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
    :title="state.id ? 'Ubah Informasi Survei' : 'Buat Survei Baru'"
    class="max-w-3xl"
  >
    <template #body>
      <UForm
        id="surveiForm"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Judul Survei" name="judul" required>
          <UInput
            v-model="state.judul"
            placeholder="Masukkan judul survei"
            :disabled="isLoading"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Deskripsi" name="deskripsi">
          <UTextarea
            v-model="state.deskripsi"
            placeholder="Masukkan deskripsi atau petunjuk pengerjaan survei"
            :disabled="isLoading"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div v-if="!state.id" class="space-y-4">
          <div class="flex items-center justify-between border-b border-muted pb-2">
            <span class="font-medium text-sm text-default">Daftar Pertanyaan</span>
            <UButton
              type="button"
              variant="subtle"
              size="xs"
              icon="i-lucide-plus"
              @click="addQuestion"
            >
              Tambah Pertanyaan
            </UButton>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, idx) in state.pertanyaan || []"
              :key="idx"
              class="flex flex-col gap-3 rounded-lg border border-muted bg-muted/20 p-3"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-medium text-xs text-muted">Pertanyaan #{{ idx + 1 }}</span>
                <UButton
                  v-if="state.pertanyaan && state.pertanyaan.length > 1"
                  type="button"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  size="xs"
                  @click="removeQuestion(idx)"
                />
              </div>

              <UInput
                v-model="item.pertanyaan"
                placeholder="Masukkan teks pertanyaan"
                :disabled="isLoading"
                class="w-full"
              />

              <div class="flex items-center">
                <UCheckbox
                  v-model="item.wajib"
                  :disabled="isLoading"
                  label="Wajib diisi"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="rounded-lg bg-info-50/20 border border-info-500/20 p-4 text-xs text-info-700 dark:text-info-400 space-y-1">
          <p class="font-medium">
            Catatan:
          </p>
          <p>
            Daftar pertanyaan tidak dapat diubah setelah survei dipublikasikan untuk menjaga integritas data tanggapan yang telah masuk.
          </p>
        </div>
      </UForm>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        @click="() => { openModel = false }"
      >
        Batal
      </UButton>
      <UButton
        type="submit"
        icon="i-lucide-check"
        :loading="isLoading"
        form="surveiForm"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>
