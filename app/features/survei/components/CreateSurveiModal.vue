<script setup lang="ts">
import type { Schema } from "../constants";
import { CalendarDate } from "@internationalized/date";
import { FetchError } from "ofetch";
import InputCalendar from "~/components/Custom/InputCalendar.vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
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

const tipePertanyaanOptions = [
  { label: "Short Text", value: "short_text" },
  { label: "Long Text", value: "long_text" },
  { label: "Single Choice (Radio)", value: "single_choice" },
  { label: "Multiple Choice (Checkbox)", value: "multiple_choice" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Rating 1-5 (Star)", value: "rating" },
];

function addQuestion() {
  if (!state.value.pertanyaan) {
    state.value.pertanyaan = [];
  }
  state.value.pertanyaan.push({
    tipe: "short_text",
    pertanyaan: "",
    wajib: false,
    nomorUrut: state.value.pertanyaan.length + 1,
    pilihan: [],
  });
}

function removeQuestion(index: number) {
  state.value.pertanyaan?.splice(index, 1);
}

function addOption(questionIdx: number) {
  const q = state.value.pertanyaan?.[questionIdx];
  if (q) {
    if (!q.pilihan) {
      q.pilihan = [];
    }
    q.pilihan.push("");
  }
}

function removeOption(questionIdx: number, optionIdx: number) {
  const q = state.value.pertanyaan?.[questionIdx];
  if (q && q.pilihan) {
    q.pilihan.splice(optionIdx, 1);
  }
}

// Make sure there is at least one question when creating
watch(
  openModel,
  (val) => {
    if (val && !state.value.id) {
      if (!state.value.pertanyaan || state.value.pertanyaan.length === 0) {
        state.value.pertanyaan = [
          {
            tipe: "short_text",
            pertanyaan: "",
            wajib: false,
            nomorUrut: 1,
            pilihan: [],
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

    // Validate choice options
    for (let i = 0; i < state.value.pertanyaan.length; i++) {
      const q = state.value.pertanyaan[i];
      if (!q)
        continue;
      if (["single_choice", "multiple_choice", "dropdown"].includes(q.tipe)) {
        if (!q.pilihan || q.pilihan.length === 0) {
          useToastError("Gagal", `Pertanyaan #${i + 1} memerlukan pilihan jawaban`);
          return;
        }
        const hasEmptyOption = q.pilihan.some(opt => !opt.trim());
        if (hasEmptyOption) {
          useToastError("Gagal", `Pilihan jawaban pada pertanyaan #${i + 1} tidak boleh kosong`);
          return;
        }
      }
    }
  }

  isLoading.value = true;
  try {
    const url = `/api/v1/survei/${isEdit ? state.value.id : ""}`;
    const formData = new FormData();

    if (state.value.judul)
      formData.append("judul", state.value.judul);
    formData.append("deskripsi", state.value.deskripsi || "");
    formData.append("headerGambar", state.value.headerGambar || "");

    if (state.value.file) {
      formData.append("file", state.value.file);
    }
    if (state.value.status) {
      formData.append("status", state.value.status);
    }

    if (state.value.tanggalMulai) {
      const tm = state.value.tanggalMulai instanceof CalendarDate ? state.value.tanggalMulai.toString() : state.value.tanggalMulai;
      formData.append("tanggalMulai", tm as string);
    }
    if (state.value.tanggalSelesai) {
      const ts = state.value.tanggalSelesai instanceof CalendarDate ? state.value.tanggalSelesai.toString() : state.value.tanggalSelesai;
      formData.append("tanggalSelesai", ts as string);
    }

    if (!isEdit && state.value.pertanyaan) {
      const mappedPertanyaan = state.value.pertanyaan.map((p, idx) => ({
        tipe: p.tipe,
        pertanyaan: p.pertanyaan,
        wajib: !!p.wajib,
        nomorUrut: idx + 1,
        pilihan: ["single_choice", "multiple_choice", "dropdown"].includes(p.tipe) ? p.pilihan : null,
      }));
      formData.append("pertanyaan", JSON.stringify(mappedPertanyaan));
    }

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
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
        class="space-y-6 max-h-160 pr-1"
        @submit="onSubmit"
      >
        <UFormField label="Gambar Header (Opsional)" name="headerGambar">
          <UploadImage
            v-model:file="state.file"
            v-model:foto="state.headerGambar"
            ratio="16:9"
            :disabled="isLoading"
          />
        </UFormField>

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

        <UFormField label="Status" name="status">
          <USelect
            v-model="state.status"
            :items="[
              { label: 'Draft', value: 'draft' },
              { label: 'Published', value: 'published' },
            ]"
            class="w-full"
            :disabled="isLoading"
          />
        </UFormField>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Tanggal Mulai (Opsional)" name="tanggalMulai">
            <InputCalendar
              v-model="state.tanggalMulai"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Tanggal Selesai (Opsional)" name="tanggalSelesai">
            <InputCalendar
              v-model="state.tanggalSelesai"
              :disabled="isLoading"
            />
          </UFormField>
        </div>

        <div v-if="!state.id" class="space-y-4">
          <div class="border-b border-muted pb-2">
            <span class="font-medium text-sm text-default">Daftar Pertanyaan</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="(item, idx) in state.pertanyaan || []"
              :key="idx"
              class="flex flex-col gap-3 rounded-lg border border-muted bg-muted/20 p-4"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-xs text-primary">Pertanyaan #{{ idx + 1 }}</span>
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

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="md:col-span-2">
                  <UInput
                    v-model="item.pertanyaan"
                    placeholder="Masukkan teks pertanyaan"
                    :disabled="isLoading"
                    class="w-full"
                  />
                </div>
                <div>
                  <USelect
                    v-model="item.tipe"
                    :items="tipePertanyaanOptions"
                    :disabled="isLoading"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Options section if question type is choice-based -->
              <div v-if="['single_choice', 'multiple_choice', 'dropdown'].includes(item.tipe)" class="mt-2 space-y-2 border-t border-muted/30 pt-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-muted">Pilihan Jawaban</span>
                  <UButton
                    type="button"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-plus"
                    @click="addOption(idx)"
                  >
                    Tambah Pilihan
                  </UButton>
                </div>
                <div class="space-y-2">
                  <div v-for="(opt, optIdx) in item.pilihan || []" :key="optIdx" class="flex gap-2 items-center">
                    <UInput
                      v-model="item.pilihan![optIdx]"
                      placeholder="Masukkan teks pilihan..."
                      size="sm"
                      class="flex-1"
                      :disabled="isLoading"
                    />
                    <UButton
                      type="button"
                      color="error"
                      variant="ghost"
                      icon="i-lucide-trash"
                      size="xs"
                      @click="removeOption(idx, optIdx)"
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center mt-1">
                <UCheckbox
                  v-model="item.wajib"
                  :disabled="isLoading"
                  label="Wajib diisi"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <UButton
              type="button"
              variant="subtle"
              size="sm"
              icon="i-lucide-plus"
              @click="addQuestion"
            >
              Tambah Pertanyaan
            </UButton>
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
