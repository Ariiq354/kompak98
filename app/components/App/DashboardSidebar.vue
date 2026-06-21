<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";

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
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/dashboard",
      onSelect: closeSidebar,
    },
    {
      label: "Tagihan",
      icon: "i-lucide-receipt",
      to: "/dashboard/admin/tagihan",
      onSelect: closeSidebar,
    },
    {
      label: "Pending Pembayaran",
      icon: "i-lucide-clock",
      to: "/dashboard/admin/belum-dibayar",
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
      icon: "i-lucide-file-text",
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
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25 transition-all duration-300 min-w-0"
  >
    <template #header>
      <div class="hidden w-full md:flex items-center justify-center px-2 py-3">
        <NuxtImg
          src="/images/logo-horizontal.webp"
          class="h-8 w-auto object-contain"
          alt="Logo"
        />
      </div>
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :items="links"
        orientation="vertical"
        :class="{ hidden: collapsed }"
        :ui="{
          label: 'text-xs font-medium text-dimmed uppercase tracking-wider px-2 py-2',
          link: [
            'rounded-lg px-3 py-2 text-sm transition-colors',
            'hover:bg-elevated hover:text-default',
            'data-[active=true]:bg-primary/10 data-[active=true]:text-primary',
          ],
          item: 'my-0.5',
          separator: 'h-px bg-border my-2',
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
</template>
