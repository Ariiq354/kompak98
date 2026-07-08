<script setup lang="ts">
import { navigateTo } from "#app";
import UploadImage from "~/components/Custom/UploadImage.vue";
import SelectKota from "~/components/Options/SelectKota.vue";
import SelectProvinsi from "~/components/Options/SelectProvinsi.vue";

const props = defineProps<{
  id: number;
}>();

const { data } = await useFetch(`/api/v1/users/${props.id}`);
</script>

<template>
  <UButton
    icon="i-lucide-arrow-left"
    variant="ghost"
    class="w-fit"
    @click="() => { navigateTo('/dashboard/admin/monitoring-member') }"
  >
    Kembali
  </UButton>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="md:col-span-4 space-y-6">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div class="relative h-24 overflow-hidden bg-linear-to-r from-primary-500 to-primary-600">
          <svg class="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0C100 80 300 0 400 100L400 0H0Z" fill="white" />
            <path d="M0 100C150 0 250 50 400 0V100H0Z" fill="white" opacity="0.5" />
          </svg>
        </div>

        <div class="px-6 pb-6 flex flex-col items-center text-center -mt-12">
          <div class="relative mb-3 bg-white p-1 rounded-xl shadow-sm ring-1 ring-gray-100">
            <UploadImage
              :foto="data?.foto ?? undefined"
              disabled
            />
          </div>

          <h2 class="text-xl font-bold text-gray-900 mt-2">
            {{ data?.name || '-' }}
          </h2>
          <p class="text-sm font-medium text-primary-600 mt-1">
            {{ data?.namaJabatan || '-' }}
          </p>

          <div v-if="data?.namaPangkat" class="mt-3 flex items-center gap-1.5 bg-gray-50 border border-primary-100 px-3 py-1 rounded-full text-xs text-primary-700">
            <UIcon name="i-lucide-award" class="size-3.5 text-green-500" />
            <span class="font-medium">{{ data?.namaPangkat }}</span>
          </div>

          <div class="w-full border-t border-gray-100 mt-6 pt-5 flex flex-col gap-3.5 text-sm text-left">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-lucide-id-card" class="size-4.5 text-gray-400 shrink-0" />
              <span class="truncate font-medium">{{ data?.nip9 || '-' }}</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-lucide-building-2" class="size-4.5 text-gray-400 shrink-0" />
              <span class="line-clamp-2 leading-snug">{{ data?.namaKantor || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:col-span-8">
      <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div
          class="space-y-8"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-user-round" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Data Pribadi
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="Nama Lengkap">
                <UInput
                  :model-value="data?.name"
                  disabled
                />
              </UFormField>
              <UFormField label="Jenis Kelamin" name="gender">
                <USelect
                  :model-value="data?.gender ?? undefined"
                  :items="['Laki-laki', 'Perempuan']"
                  disabled
                />
              </UFormField>
              <UFormField label="Nomor HP" name="noHp">
                <UInput
                  :model-value="data?.noHp ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Pendidikan Formal" name="pendidikanFormal">
                <UInput
                  :model-value="data?.pendidikanFormal ?? undefined"
                  disabled
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-briefcase-business" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Data Kepegawaian
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="NIP 9" name="nip9">
                <UInput
                  :model-value="data?.nip9 ?? ''"
                  disabled
                />
              </UFormField>
              <UFormField label="NIP 18" name="nip18">
                <UInput
                  :model-value="data?.nip18 ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Nama Kantor" name="namaKantor">
                <UInput
                  :model-value="data?.namaKantor ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Provinsi Kantor" name="provinsiKantor">
                <SelectProvinsi
                  :model-value="data?.provinsiKantor ?? undefined"
                  disabled
                />
              </UFormField>

              <UFormField label="Unit Eselon 4" name="namaUnitEs4" class="md:col-span-2">
                <UInput
                  :model-value="data?.namaUnitEs4 ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Jabatan" name="namaJabatan">
                <UInput
                  :model-value="data?.namaJabatan ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Pangkat" name="namaPangkat">
                <UInput
                  :model-value="data?.namaPangkat ?? undefined"
                  disabled
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900">
                Alamat Homebase
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <UFormField label="Alamat Tempat Tinggal" name="alamat" class="md:col-span-2">
                <UTextarea
                  :model-value="data?.alamat ?? undefined"
                  :rows="4"
                  disabled
                  autoresize
                />
              </UFormField>
              <UFormField label="Provinsi" name="provinsi">
                <SelectProvinsi
                  :model-value="data?.provinsi ?? undefined"
                  disabled
                />
              </UFormField>
              <UFormField label="Kabupaten/Kota" name="kota">
                <SelectKota
                  :model-value="data?.kota ?? undefined"
                  :province-id="data?.provinsi ?? undefined"
                  disabled
                />
              </UFormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
