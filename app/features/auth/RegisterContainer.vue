<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { RegisterSchema } from "./constants";
import InputPassword from "~/components/Custom/InputPassword.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { authClient } from "~/utils/auth";
import { initFormDataRegister, registerSchema } from "./constants";

const state = ref(initFormDataRegister);

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  await authClient.signUp.email({
    email: `${event.data.username}@gmail.com`,
    name: event.data.name,
    username: event.data.username,
    password: event.data.password,
  }, {
    onRequest: () => {
      isLoading.value = true;
    },
    onSuccess: async () => {
      isLoading.value = false;
      useToastSuccess("Berhasil registrasi", "Akun Anda menunggu verifikasi admin sebelum dapat digunakan.");
      await navigateTo("/login");
    },
    onError: (error) => {
      isLoading.value = false;
      if (error.error.code === "USERNAME_IS_ALREADY_TAKEN") {
        useToastError("Gagal registrasi", "Username sudah digunakan, silahkan gunakan username lain.");
        return;
      }
      useToastError("Gagal registrasi", "Gagal registrasi, silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <div class="w-full lg:w-1/2 flex items-center justify-center bg-blue-50 px-6 py-12">
    <UCard class="w-full max-w-lg md:p-8 p-4 rounded-4xl">
      <div class="space-y-6">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">
            Silahkan daftar
          </h2>
          <p class="mt-2 text-gray-500">
            Isi form di bawah ini untuk mendaftar
          </p>
        </div>
        <UForm
          :schema="registerSchema"
          :state="state"
          class="w-full space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              :disabled="isLoading"
              placeholder="Masukkan username anda"
            />
          </UFormField>

          <UFormField label="Nama" name="name">
            <UInput
              v-model="state.name"
              :disabled="isLoading"
              placeholder="Masukkan nama anda"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <InputPassword
              v-model="state.password"
              :disabled="isLoading"
              placeholder="Masukkan password anda"
            />
          </UFormField>

          <UButton
            class="flex w-full justify-center"
            type="submit"
            :loading="isLoading"
          >
            Daftar
          </UButton>
        </UForm>

        <div class="font-bold text-muted text-sm text-center">
          Sudah punya akun? Silahkan
          <NuxtLink
            class="text-primary-500" to="/login"
          >
            masuk
          </nuxtlink>
        </div>
      </div>
    </UCard>
  </div>
</template>
