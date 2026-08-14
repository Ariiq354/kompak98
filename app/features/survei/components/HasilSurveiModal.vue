<script setup lang="ts">
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  surveiId: number;
  surveiTitle: string;
}>();

const openModel = defineModel<boolean>("open", {
  required: true,
});

const responses = ref();
const isLoading = ref(false);
const isDownloading = ref(false);
const activeTab = ref<"summary" | "respondent">("summary");
const selectedRespondent = ref();

async function downloadHasilCsv() {
  isDownloading.value = true;
  try {
    const csv = await $fetch<string>(`/api/v1/survei/${props.surveiId}/export`);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeTitle = props.surveiTitle
      ? props.surveiTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : `survei-${props.surveiId}`;
    link.download = `hasil-${safeTitle}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  catch (error: any) {
    useToastError("Gagal download hasil survei", error?.data?.message || "Terjadi kesalahan saat mengunduh CSV.");
  }
  finally {
    isDownloading.value = false;
  }
}

async function fetchHasil() {
  isLoading.value = true;
  try {
    const data = await $fetch(`/api/v1/survei/${props.surveiId}/hasil`);
    responses.value = data || [];
    if (responses.value.length > 0) {
      selectedRespondent.value = responses.value[0] || null;
    }
  }
  catch {
    useToastError("Gagal memuat hasil", "Tidak dapat mengambil data hasil respon");
  }
  finally {
    isLoading.value = false;
  }
}

watch(
  openModel,
  (val) => {
    if (val) {
      fetchHasil();
    }
  },
  { immediate: true },
);

// Group responses by question ID
const questionsSummary = computed(() => {
  const summaryMap = new Map<number, { text: string; answers: { userName: string; jawaban: any }[] }>();

  for (const resp of responses.value || []) {
    for (const j of resp.jawaban) {
      if (!summaryMap.has(j.pertanyaanId)) {
        summaryMap.set(j.pertanyaanId, {
          text: j.pertanyaanText,
          answers: [],
        });
      }
      summaryMap.get(j.pertanyaanId)!.answers.push({
        userName: resp.userName || "Anonim",
        jawaban: j.jawaban,
      });
    }
  }

  return Array.from(summaryMap.values());
});

function formatJawaban(jawaban: any): string {
  if (Array.isArray(jawaban)) {
    return jawaban.join(", ");
  }
  if (typeof jawaban === "number") {
    return `${jawaban} ★`;
  }
  return String(jawaban || "");
}

function formatDateString(value: Date | string) {
  try {
    return format(new Date(value), "dd MMMM yyyy, HH:mm", { locale: id });
  }
  catch {
    return value instanceof Date ? value.toISOString() : value;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    :title="`Hasil Respon: ${props.surveiTitle}`"
    class="max-w-4xl"
  >
    <template #body>
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
        <UIcon name="i-lucide-loader-circle" class="h-8 w-8 text-primary animate-spin" />
        <p class="text-muted text-sm">
          Memuat tanggapan...
        </p>
      </div>

      <div v-else-if="!responses || responses.length === 0" class="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <UIcon name="i-lucide-clipboard-x" class="h-12 w-12 text-dimmed" />
        <p class="font-medium text-default">
          Belum Ada Tanggapan
        </p>
        <p class="text-muted text-sm max-w-xs">
          Belum ada pengguna yang mengisi survei ini. Hasil akan muncul setelah ada yang berpartisipasi.
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Custom Tab Navigation -->
        <div class="flex border-b border-muted">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200"
            :class="
              activeTab === 'summary'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-default'
            "
            @click="activeTab = 'summary'"
          >
            Ringkasan Pertanyaan
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200"
            :class="
              activeTab === 'respondent'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-default'
            "
            @click="activeTab = 'respondent'"
          >
            Daftar Responden ({{ responses.length }})
          </button>
        </div>

        <!-- Ringkasan Tab Content -->
        <div v-if="activeTab === 'summary'" class="space-y-6 max-h-125 overflow-y-auto pr-1">
          <div
            v-for="(item, idx) in questionsSummary"
            :key="idx"
            class="rounded-lg border border-muted bg-muted/10 p-4 space-y-3"
          >
            <div class="flex items-start gap-2 border-b border-muted pb-2">
              <span class="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded">Q{{ idx + 1 }}</span>
              <p class="font-medium text-sm text-default">
                {{ item.text }}
              </p>
            </div>

            <div class="space-y-2">
              <div
                v-for="(ans, ansIdx) in item.answers"
                :key="ansIdx"
                class="flex flex-col md:flex-row md:items-start gap-1 justify-between bg-elevated/40 px-3 py-2 rounded text-sm"
              >
                <span class="font-medium text-xs text-muted md:w-1/4">{{ ans.userName }}</span>
                <span class="text-default md:w-3/4 flex items-center">
                  <UInputRating
                    v-if="typeof ans.jawaban === 'number'"
                    :model-value="ans.jawaban"
                    readonly
                  />
                  <template v-else>
                    {{ formatJawaban(ans.jawaban) }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Responden Tab Content -->
        <div v-else-if="activeTab === 'respondent'" class="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-125 overflow-hidden">
          <!-- Left side: List of respondents -->
          <div class="border border-muted rounded-lg overflow-y-auto h-112.5">
            <div class="bg-muted/30 p-2 font-medium text-xs border-b border-muted text-muted">
              PILIH RESPONDEN
            </div>
            <div class="divide-y divide-border">
              <button
                v-for="resp in responses"
                :key="resp.id"
                type="button"
                class="w-full text-left p-3 hover:bg-muted/20 transition-colors flex flex-col gap-1"
                :class="selectedRespondent?.id === resp.id ? 'bg-primary/5 text-primary border-l-4 border-l-primary font-medium' : 'text-default'"
                @click="selectedRespondent = resp"
              >
                <span class="text-sm">{{ resp.userName }}</span>
                <span class="text-[10px] text-muted">{{ formatDateString(resp.submittedAt) }}</span>
              </button>
            </div>
          </div>

          <!-- Right side: Detail of selected respondent's answers -->
          <div class="md:col-span-2 border border-muted rounded-lg p-4 bg-muted/5 flex flex-col h-112.5 overflow-y-auto">
            <div v-if="selectedRespondent" class="space-y-4">
              <div class="border-b border-muted pb-3">
                <h4 class="font-semibold text-base text-default">
                  {{ selectedRespondent.userName }}
                </h4>
                <p class="text-xs text-muted">
                  Dikirim pada: {{ formatDateString(selectedRespondent.submittedAt) }}
                </p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(jaw, jawIdx) in selectedRespondent.jawaban"
                  :key="jawIdx"
                  class="space-y-1"
                >
                  <p class="text-xs font-semibold text-muted">
                    Pertanyaan: {{ jaw.pertanyaanText }}
                  </p>
                  <div class="bg-elevated p-3 rounded-lg border border-muted text-sm text-default">
                    <UInputRating
                      v-if="typeof jaw.jawaban === 'number'"
                      :model-value="jaw.jawaban"
                      readonly
                    />
                    <template v-else>
                      {{ formatJawaban(jaw.jawaban) }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full text-muted text-sm">
              Silahkan pilih responden di samping kiri
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          v-if="responses && responses.length > 0"
          icon="i-lucide-download"
          class="text-white dark:bg-blue-600 hover:dark:bg-blue-600/75"
          :loading="isDownloading"
          :disabled="isDownloading"
          @click="downloadHasilCsv"
        >
          Download CSV
        </UButton>
        <div v-else />
        <UButton
          variant="ghost"
          icon="i-lucide-x"
          @click="() => { openModel = false }"
        >
          Tutup
        </UButton>
      </div>
    </template>
  </LazyUModal>
</template>
