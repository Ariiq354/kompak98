<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import DashboardSidebar from "~/components/App/DashboardSidebar.vue";
import ModalPassword from "~/components/Modal/ModalPassword.vue";
import { useAuthSession } from "~/composables/auth";
import { openModal } from "~/composables/modal";
import { useToastError } from "~/composables/toast";
import { authClient } from "~/utils/auth";

defineProps<{
  title?: string;
}>();

const config = useRuntimeConfig();
const { session } = await useAuthSession();

async function signOut() {
  try {
    await authClient.signOut();
    await navigateTo("/login", { external: true });
  }
  catch {
    useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
  }
}

const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: session.value?.user.name ?? "User",
      avatar: {
        src: session.value?.user.image ? `${config.public.imageUrl}/${session.value.user.image}` : undefined,
        alt: session.value?.user.name ?? "User",
      },
    },

  ],
  [
    {
      label: "Ubah Password",
      icon: "i-lucide-key-round",
      onSelect: () => openModal(ModalPassword),
    },
  ],
  [
    {
      label: "Keluar",
      icon: "i-lucide-log-out",
      onSelect: signOut,
    },
  ],
]);
</script>

<template>
  <UDashboardGroup unit="rem">
    <DashboardSidebar />
    <UDashboardPanel
      :ui="{
        body: 'bg-navy-50/20',
      }"
    >
      <template #header>
        <UDashboardNavbar :title="title">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #right>
            <UDropdownMenu
              :items="dropdownItems"
            >
              <div class="flex items-center gap-2">
                <p class="text-black font-medium">
                  {{ session?.user.name ?? "User" }}
                </p>
                <UAvatar
                  data-slot="right"
                  :src="session?.user.image ? `${config.public.imageUrl}/${session.user.image}` : undefined"
                  :alt="session?.user.name ?? 'User'"
                  class="cursor-pointer ring-2 ring-transparent transition hover:ring-primary/30"
                />
              </div>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
