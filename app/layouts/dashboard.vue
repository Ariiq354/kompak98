<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui/runtime/components/DropdownMenu.vue.js";

defineProps<{
  title?: string;
}>();

const session = authClient.useSession();
async function signOut() {
  try {
    await authClient.signOut();
    await navigateTo("/login", { external: true });
  }
  catch {
    useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
  }
}

const open = ref(false);
function closeSidebar() {
  open.value = false;
}
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
      onSelect: closeSidebar,
    },
    {
      label: "Tagihan",
      icon: "i-lucide-inbox",
      to: "/dashboard/admin/tagihan",
      onSelect: closeSidebar,
    },
    {
      label: "Belum Dibayar",
      icon: "i-lucide-users",
      to: "/dashboard/admin/tagihan/belum-dibayar",
      onSelect: closeSidebar,
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
      onSelect: closeSidebar,
    },
  ],
] satisfies NavigationMenuItem[][];

const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: session.value.data?.user.name ?? "User",
      avatar: {
        src: session.value.data?.user.image ?? undefined,
        alt: session.value.data?.user.name ?? "User",
      },
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
  ],
  [
    {
      label: "Log out",
      icon: "i-lucide-log-out",
      onSelect: signOut,
    },
  ],
]);
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      toggle-side="right"
      class="bg-elevated/25 transition-all duration-300 min-w-0"
    >
      <template #header>
        <div class="md:flex hidden">
          <NuxtImg src="/images/logo-horizontal.webp" />
        </div>
      </template>

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
            :items="dropdownItems"
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
        <UDashboardNavbar :title="title">
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
