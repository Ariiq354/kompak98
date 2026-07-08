<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { LoginSchema } from "./constants";
import InputPassword from "~/components/Custom/InputPassword.vue";
import { useToastError } from "~/composables/toast";
import { authClient } from "~/utils/auth";
import { initFormDataLogin, loginSchema } from "./constants";

const state = ref(initFormDataLogin);

const isLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  await authClient.signIn.username({
    username: event.data.username,
    password: event.data.password,
    rememberMe: event.data.rememberMe,
  }, {
    onRequest: () => {
      isLoading.value = true;
    },
    onSuccess: async () => {
      isLoading.value = false;
      await navigateTo("/dashboard", { external: true });
    },
    onError: () => {
      isLoading.value = false;
      useToastError("Gagal login", "Username atau password salah, silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <div class="w-full lg:w-1/2 flex flex-col items-center justify-center bg-blue-50 px-6 py-12">
    <NuxtLink
      to="/"
      class="lg:hidden flex mb-8 h-10"
    >
      <NuxtImg
        src="/images/logo-horizontal.webp"
        alt="Logo"
      />
    </NuxtLink>
    <UCard class="w-full max-w-lg md:p-8 p-4 rounded-4xl">
      <div class="space-y-6">
        <div class="mb-8">
          <h2 class="lg:text-3xl text-xl font-bold text-gray-900">
            Selamat Datang!
          </h2>
          <p class="mt-2 text-gray-500 lg:text-base text-sm">
            Silahkan login dengan akun anda
          </p>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Username" name="username">
            <UInput
              v-model="state.username"
              :disabled="isLoading"
              placeholder="Masukkan NIP8 atau username anda"
            />
          </UFormField>

          <UFormField label="Password" name="password">
            <InputPassword
              v-model="state.password"
              :disabled="isLoading"
              placeholder="Masukkan password anda"
            />
          </UFormField>

          <UCheckbox
            v-model="state.rememberMe"
            :disabled="isLoading"
            label="Ingat saya"
          />

          <UButton
            class="flex w-full justify-center"
            type="submit"
            :loading="isLoading"
          >
            Masuk
          </UButton>
        </UForm>

        <div class="font-bold text-muted text-sm text-center">
          Belum punya akun? Silahkan
          <NuxtLink
            class="text-primary-500" to="/register"
          >
            daftar
          </nuxtlink>
        </div>
      </div>
    </UCard>
  </div>
</template>
