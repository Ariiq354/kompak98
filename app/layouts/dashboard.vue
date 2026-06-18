<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui/runtime/components/DropdownMenu.vue.js";

const session = authClient.useSession();
async function signOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: async () => {
        await navigateTo("/login", { external: true });
      },
      onError: () => {
        useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
      },
    },
  });
}

const open = ref(false);
const links = [
  [
    {
      label: "Admin",
      type: "label",
    },
    {
      label: "Home Dashboard",
      icon: "i-lucide-house",
      to: "/dashboard",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Tagihan",
      icon: "i-lucide-inbox",
      to: "/dashboard/admin/tagihan",
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: "Belum Dibayar",
      icon: "i-lucide-users",
      to: "/dashboard/admin/tagihan/belum-dibayar",
      onSelect: () => {
        open.value = false;
      },
    },
  ],
  [
    {
      label: "User",
      type: "label",
    },
    {
      label: "Tagihan Saya",
      icon: "i-lucide-house",
      to: "/dashboard/user/tagihan",
      onSelect: () => {
        open.value = false;
      },
    },
  ],
] satisfies NavigationMenuItem[][];

const items: DropdownMenuItem[][] = [
  [
    {
      type: "label",
      label: "test",
      avatar: { alt: "test" },
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
    },
  ],
  [
    {
      label: "Log out",
      icon: "i-lucide-log-out",
      onSelect: signOut,
    },
  ],
];
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25 transition-all duration-300 min-w-0"
    >
      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="links"
          orientation="vertical"
          :class="{ hidden: collapsed }"
          :ui="{
            separator: 'h-0',
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <ClientOnly>
          <template #fallback>
            <USkeleton class="h-9 w-full rounded-xl" />
          </template>
          <UDropdownMenu
            :items="items"
            :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
          >
            <UButton
              :avatar="{
                src: session.data?.user.image ?? undefined,
                alt: session.data?.user.name,
                loading: 'lazy',
              }"
              :label="session.data?.user.name"
              color="neutral"
              variant="ghost"
              block
              class="data-[state=open]:bg-elevated"
              trailing-icon="i-lucide-chevrons-up-down"
              :class="{ hidden: collapsed }"
              :ui="{
                trailingIcon: 'text-dimmed',
              }"
            />
          </UDropdownMenu>
        </ClientOnly>
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Inbox">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
