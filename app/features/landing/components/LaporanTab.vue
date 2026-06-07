<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits([
  "update:modelValue",
]);

function setTab(tab: string) {
  emit("update:modelValue", tab);
}

const tabs = [
  {
    key: "pengaduan",
    label: "PENGADUAN",
  },
  {
    key: "aspirasi",
    label: "ASPIRASI",
  },
  {
    key: "informasi",
    label: "PERMINTAAN INFORMASI",
  },
];
</script>

<template>
  <div class="mb-10">
    <label class="block font-semibold mb-3">
      Pilih Klasifikasi Laporan
    </label>

    <div
      class="grid grid-cols-3 border border-eucalyptus-700 rounded-lg overflow-hidden"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.key"
        type="button"
        class="py-4 font-semibold transition cursor-pointer"
        :class="[
          modelValue === tab.key
            ? 'bg-eucalyptus-700 text-white'
            : 'bg-white text-eucalyptus-700',
          index === 1 && 'border-x border-eucalyptus-700',
        ]"
        @click="setTab(tab.key)"
      >
        <div class="flex items-center gap-3 px-5">
          <span
            class="size-4 rounded-full border-2 flex items-center justify-center"
            :class="
              modelValue === tab.key
                ? 'border-white'
                : 'border-eucalyptus-700'
            "
          >
            <span
              v-if="modelValue === tab.key"
              class="size-2 rounded-full bg-white"
            />
          </span>

          <span>
            {{ tab.label }}
          </span>
        </div>
      </button>
    </div>

    <p class="text-center mt-6">
      Perhatikan Cara Menyampaikan Pengaduan Yang Baik dan Benar
      <a
        href="#"
        class="text-eucalyptus-700 ml-2 font-semibold"
      >
        Lihat Panduan
      </a>
    </p>
  </div>
</template>
