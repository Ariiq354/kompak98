<script setup lang="ts">
import type { CheckboxGroupItem, FormSubmitEvent } from "@nuxt/ui";
import type z from "zod";
import type { CreateTagihanKhususSchema } from "../constants";
import { FetchError } from "ofetch";
import {
  createTagihanKhususSchema,
  updateTagihanSchema,
} from "../constants";

const emit = defineEmits(["submit"]);

const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<CreateTagihanKhususSchema>("state", {
  required: true,
});

const isLoading = ref(false);

const formSchema = computed(() => {
  return state.value.id
    ? updateTagihanSchema
    : createTagihanKhususSchema;
});

type TagihanFormSubmit
  = | z.infer<typeof createTagihanKhususSchema>
    | z.infer<typeof updateTagihanSchema>;

const userIdModels = ref<string[]>([]);

const { data } = await useFetch("/api/v1/users");
const userList = computed(() => data.value ?? []);
const userOptions = computed<CheckboxGroupItem[]>(() => {
  return userList.value.map(user => ({
    label: user.name,
    value: String(user.id),
  }));
});

const isAllSelected = computed<boolean>(() => {
  return userList.value.length > 0
    && userList.value.every(user => userIdModels.value.includes(String(user.id)));
});

function toggleAllUsers(checked: boolean | "indeterminate") {
  const selectedIds = checked === true
    ? userList.value.map(user => user.id)
    : [];

  state.value.userIds = selectedIds;
  userIdModels.value = selectedIds.map(String);
}

watch(
  () => state.value.userIds,
  (value) => {
    userIdModels.value = value.map(String);
  },
  { immediate: true },
);

watch(
  userIdModels,
  (value) => {
    state.value.userIds = value.map(Number);
  },
  { flush: "sync" },
);

async function onSubmit(event: FormSubmitEvent<TagihanFormSubmit>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;

    const body = isEdit
      ? {
          judul: event.data.judul,
          deskripsi: event.data.deskripsi,
          nominal: event.data.nominal,
        }
      : event.data;

    await $fetch(
      isEdit ? `/api/v1/tagihan/admin/${state.value.id}` : "/api/v1/tagihan/admin",
      {
        method: isEdit ? "PATCH" : "POST",
        body,
      },
    );

    openModel.value = false;
    emit("submit");
    useToastSuccess(`Berhasil ${isEdit ? "Tambah" : "Edit"} Data`);
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

        <UFormField
          v-if="!state.id"
          name="userIds"
        >
          <template #label>
            <div class="flex items-center gap-4 text-sm font-normal">
              <span class="font-medium">Member Alumni</span>

              <UCheckbox
                label="Pilih Semua"
                :ui="{ label: 'font-normal text-sm' }"
                :model-value="isAllSelected"
                @update:model-value="toggleAllUsers"
              />
            </div>
          </template>

          <UCheckboxGroup
            v-model="userIdModels"
            :items="userOptions"
            :ui="{
              fieldset: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4',
              label: 'font-normal text-sm',
            }"
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
