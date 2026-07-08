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

async function fetchSurveiDetail() {
  isLoadingData.value = true;
  try {
    const data = await $fetch(`/api/v1/survei/${props.surveiId}`);
    survei.value = data;
    if (data && data.pertanyaan) {
      answers.value = data.pertanyaan.map(p => ({
        pertanyaanId: p.id,
        pertanyaanText: p.pertanyaan,
        wajib: p.wajib,
        jawaban: "",
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
    if (ans.wajib && !ans.jawaban.trim()) {
      useToastError("Validasi Gagal", `Pertanyaan "${ans.pertanyaanText}" wajib diisi.`);
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
      jawaban: answers.value
        .filter(ans => ans.jawaban.trim() !== "")
        .map(ans => ({
          pertanyaanId: ans.pertanyaanId,
          jawaban: ans.jawaban.trim(),
        })),
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
        <USpinner class="h-8 w-8 text-primary" />
        <p class="text-muted text-sm">
          Memuat daftar pertanyaan...
        </p>
      </div>

      <div v-else-if="!survei || !survei.pertanyaan || survei.pertanyaan.length === 0" class="text-center py-8 text-muted">
        Tidak ada pertanyaan dalam survei ini.
      </div>

      <div v-else class="space-y-6">
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
            class="space-y-2 border-b border-muted/40 pb-4 last:border-0 last:pb-0"
          >
            <label class="block font-medium text-sm text-default">
              <span class="text-muted mr-1 font-semibold">{{ idx + 1 }}.</span>
              {{ ans.pertanyaanText }}
              <span v-if="ans.wajib" class="text-error font-bold ml-0.5">*</span>
            </label>

            <UTextarea
              v-model="ans.jawaban"
              placeholder="Tuliskan jawaban Anda di sini..."
              :rows="3"
              :disabled="isSubmitting"
              class="w-full"
            />
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
