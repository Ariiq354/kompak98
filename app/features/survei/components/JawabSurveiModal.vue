<script setup lang="ts">
import type { JawabanState } from "../constants";
import { FetchError } from "ofetch";
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  surveiId: number;
  surveiTitle: string;
}>();

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const survei = ref();
const answers = ref<JawabanState[]>([]);
const isLoadingData = ref(false);
const isSubmitting = ref(false);
const config = useRuntimeConfig();

async function fetchSurveiDetail() {
  isLoadingData.value = true;
  try {
    const data = await $fetch(`/api/v1/survei/${props.surveiId}`);
    survei.value = data;
    if (data && data.pertanyaan) {
      answers.value = data.pertanyaan.map((p: any) => ({
        pertanyaanId: p.id,
        pertanyaanText: p.pertanyaan,
        tipe: p.tipe,
        wajib: p.wajib,
        pilihan: p.pilihan,
        jawaban: p.tipe === "multiple_choice" ? [] : (p.tipe === "rating" ? 0 : ""),
      }));
    }
  }
  catch {
    useToastError("Gagal memuat survei", "Tidak dapat mengambil data pertanyaan survei");
    openModel.value = false;
  }
  finally {
    isLoadingData.value = false;
  }
}

watch(
  openModel,
  (val) => {
    if (val) {
      fetchSurveiDetail();
    }
  },
  { immediate: true },
);

async function onSubmit() {
  // Client-side validation for required fields
  for (const ans of answers.value) {
    let hasValue = false;
    if (ans.tipe === "multiple_choice") {
      hasValue = Array.isArray(ans.jawaban) && ans.jawaban.length > 0;
    }
    else if (ans.tipe === "rating") {
      hasValue = typeof ans.jawaban === "number" && ans.jawaban > 0;
    }
    else {
      hasValue = ans.jawaban !== null && ans.jawaban !== undefined && String(ans.jawaban).trim() !== "";
    }

    if (ans.wajib && !hasValue) {
      useToastError("Validasi Gagal", `Pertanyaan "${ans.pertanyaanText}" wajib diisi.`);
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
      jawaban: answers.value
        .map((ans) => {
          let hasAnswer = false;
          if (ans.tipe === "multiple_choice") {
            hasAnswer = Array.isArray(ans.jawaban) && ans.jawaban.length > 0;
          }
          else if (ans.tipe === "rating") {
            hasAnswer = typeof ans.jawaban === "number" && ans.jawaban > 0;
          }
          else {
            hasAnswer = ans.jawaban !== null && ans.jawaban !== undefined && String(ans.jawaban).trim() !== "";
          }

          if (!hasAnswer)
            return null;

          return {
            pertanyaanId: ans.pertanyaanId,
            jawaban: ans.jawaban,
          };
        })
        .filter((ans): ans is { pertanyaanId: number; jawaban: any } => ans !== null),
    };

    if (payload.jawaban.length === 0) {
      useToastError("Validasi Gagal", "Anda harus menjawab minimal 1 pertanyaan.");
      return;
    }

    await $fetch(`/api/v1/survei/${props.surveiId}/respon`, {
      method: "POST",
      body: payload,
    });

    useToastSuccess("Sukses", "Jawaban survei Anda berhasil dikirim");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal mengirim", error.data?.message || "Terjadi kesalahan");
    }
    else {
      useToastError("Gagal mengirim", "Internal Server Error");
    }
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    :title="`Isi Survei: ${props.surveiTitle}`"
    class="max-w-3xl"
  >
    <template #body>
      <div v-if="isLoadingData" class="flex flex-col items-center justify-center py-12 space-y-4">
        <UIcon name="i-lucide-loader-circle" class="h-8 w-8 text-primary animate-spin transition-none" />
        <p class="text-muted text-sm">
          Memuat daftar pertanyaan...
        </p>
      </div>

      <div v-else-if="!survei || !survei.pertanyaan || survei.pertanyaan.length === 0" class="text-center py-8 text-muted">
        Tidak ada pertanyaan dalam survei ini.
      </div>

      <div v-else class="space-y-6 max-h-140 pr-1">
        <img
          v-if="survei.headerGambar"
          :src="survei.headerGambar.startsWith('http') ? survei.headerGambar : `${config.public.imageUrl}/${survei.headerGambar}`"
          class="w-full h-44 object-cover rounded-lg"
          alt="Header Gambar Survei"
        >

        <div v-if="survei.deskripsi" class="bg-muted/15 border border-muted p-4 rounded-lg text-sm text-muted">
          <p class="font-medium text-default mb-1">
            Petunjuk/Deskripsi:
          </p>
          <p class="whitespace-pre-wrap">
            {{ survei.deskripsi }}
          </p>
        </div>

        <form id="jawabForm" class="space-y-6" @submit.prevent="onSubmit">
          <div
            v-for="(ans, idx) in answers"
            :key="ans.pertanyaanId"
            class="space-y-3 border-b border-muted/40 pb-5 last:border-0 last:pb-0"
          >
            <label class="block font-medium text-sm text-default">
              <span class="text-muted mr-1 font-semibold">{{ idx + 1 }}.</span>
              {{ ans.pertanyaanText }}
              <span v-if="ans.wajib" class="text-error font-bold ml-0.5">*</span>
            </label>

            <!-- Short Text -->
            <UInput
              v-if="ans.tipe === 'short_text'"
              v-model="ans.jawaban"
              placeholder="Tuliskan jawaban singkat Anda..."
              :disabled="isSubmitting"
              class="w-full"
            />

            <!-- Long Text -->
            <UTextarea
              v-else-if="ans.tipe === 'long_text'"
              v-model="ans.jawaban"
              placeholder="Tuliskan jawaban lengkap Anda di sini..."
              :rows="3"
              :disabled="isSubmitting"
              class="w-full"
            />

            <!-- Single Choice (Radio) -->
            <div v-else-if="ans.tipe === 'single_choice'" class="space-y-2">
              <label
                v-for="opt in ans.pilihan || []"
                :key="opt"
                class="flex items-center gap-2 text-sm text-default cursor-pointer p-1 hover:bg-muted/10 rounded"
              >
                <input
                  v-model="ans.jawaban"
                  type="radio"
                  :name="`question_${ans.pertanyaanId}`"
                  :value="opt"
                  :disabled="isSubmitting"
                  class="h-4 w-4 text-primary focus:ring-primary border-muted"
                >
                <span>{{ opt }}</span>
              </label>
            </div>

            <!-- Multiple Choice (Checkbox) -->
            <div v-else-if="ans.tipe === 'multiple_choice'" class="space-y-2">
              <label
                v-for="opt in ans.pilihan || []"
                :key="opt"
                class="flex items-center gap-2 text-sm text-default cursor-pointer p-1 hover:bg-muted/10 rounded"
              >
                <input
                  v-model="ans.jawaban"
                  type="checkbox"
                  :value="opt"
                  :disabled="isSubmitting"
                  class="h-4 w-4 rounded text-primary focus:ring-primary border-muted"
                >
                <span>{{ opt }}</span>
              </label>
            </div>

            <!-- Dropdown -->
            <USelect
              v-else-if="ans.tipe === 'dropdown'"
              v-model="ans.jawaban"
              :items="ans.pilihan || []"
              placeholder="Pilih salah satu..."
              :disabled="isSubmitting"
              class="w-full"
            />

            <!-- Rating -->
            <div v-else-if="ans.tipe === 'rating'" class="flex items-center gap-2 py-1">
              <UInputRating
                v-model="ans.jawaban"
                :disabled="isSubmitting"
                size="xl"
              />
              <span v-if="ans.jawaban > 0" class="text-xs text-muted font-medium ml-2">
                ({{ ans.jawaban }} dari 5)
              </span>
            </div>
          </div>
        </form>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-xs text-muted">
          Tanda <span class="text-error font-bold">*</span> menunjukkan pertanyaan wajib diisi.
        </span>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            icon="i-lucide-x"
            :disabled="isSubmitting"
            @click="() => { openModel = false }"
          >
            Batal
          </UButton>
          <UButton
            type="submit"
            icon="i-lucide-send"
            :loading="isSubmitting"
            :disabled="isLoadingData"
            form="jawabForm"
          >
            Kirim Jawaban
          </UButton>
        </div>
      </div>
    </template>
  </LazyUModal>
</template>
