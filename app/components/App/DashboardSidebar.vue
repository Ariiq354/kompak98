<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[][] = [
  [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/dashboard",
    },
  ],
  [
    {
      label: "Tagihan Saya",
      icon: "i-lucide-receipt",
      to: "/dashboard/user/tagihan",
    },
  ],
  [
    {
      label: "Admin - Kelola Tagihan",
      icon: "i-lucide-settings-2",
      to: "/dashboard/admin/tagihan",
    },
    {
      label: "Admin - Belum Dibayar",
      icon: "i-lucide-alert-circle",
      to: "/dashboard/admin/tagihan/belum-dibayar",
    },
  ],
];

const isLoading = ref(false);
async function signOut() {
  await authClient.signOut({
    fetchOptions: {

      onRequest: () => {
        isLoading.value = true;
      },
      onSuccess: async () => {
        isLoading.value = false;
        await navigateTo("/login", { external: true });
      },
      onError: () => {
        isLoading.value = false;
        useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
      },
    },
  });
}
</script>

<template>
  <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
    <div class="flex items-center gap-3 px-2 py-3">
      <NuxtImg
        src="/images/logo-kemenag-bogor.png"
        alt="GEMA Logo"
        class="w-10 h-10 object-contain"
      />
      <div class="leading-tight">
        <h1 class="font-semibold text-sm">
          GEMA
        </h1>
        <p class="text-xs text-gray-500">
          Sistem Informasi
        </p>
      </div>
    </div>

    <UNavigationMenu
      :items="items[0]"
      orientation="vertical"
    />

    <template #footer>
      <UButton
        icon="i-lucide-log-out"
        label="Logout"
        color="neutral"
        variant="ghost"
        class="w-full"
        :loading="isLoading"
        @click="signOut"
      />
    </template>
  </UDashboardSidebar>
</template>
