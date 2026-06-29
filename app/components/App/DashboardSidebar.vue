<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useAuthSession } from "~/composables/auth";
import ModalPassword from "../Modal/ModalPassword.vue";

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

const open = ref(false);

function closeSidebar() {
  open.value = false;
}

const links = computed<NavigationMenuItem[][]>(() => {
  const isAdmin = session.value?.user.role === "admin";
  const menu: NavigationMenuItem[][] = [];

  if (isAdmin) {
    menu.push([
      {
        label: "Admin",
        type: "label" as const,
      },
      {
        label: "Monitoring Kas Bulanan",
        icon: "i-lucide-wallet",
        to: "/dashboard/admin/monitoring-iuran-bulanan",
        onSelect: closeSidebar,
      },
      {
        label: "Monitoring Iuran Khusus",
        icon: "i-lucide-badge-dollar-sign",
        to: "/dashboard/admin/monitoring-iuran-khusus",
        onSelect: closeSidebar,
      },
      {
        label: "Monitoring Pegawai",
        icon: "i-lucide-users",
        to: "/dashboard/admin/monitoring-member",
        onSelect: closeSidebar,
      },
      {
        label: "Transaksi",
        icon: "i-lucide-hand-coins",
        to: "/dashboard/admin/pengeluaran",
        onSelect: closeSidebar,
      },
      {
        label: "Acara",
        icon: "i-lucide-calendar-clock",
        to: "/dashboard/admin/acara",
        onSelect: closeSidebar,
      },
    ]);
  }

  menu.push([
    {
      label: "User",
      type: "label" as const,
    },
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/dashboard",
      onSelect: closeSidebar,
    },
    {
      label: "Iuran Kas Bulanan",
      icon: "i-lucide-wallet",
      to: "/dashboard/user/iuran-bulanan",
      onSelect: closeSidebar,
    },
    {
      label: "Iuran Khusus",
      icon: "i-lucide-badge-dollar-sign",
      to: "/dashboard/user/iuran-khusus",
      onSelect: closeSidebar,
    },
    {
      label: "Profil Saya",
      icon: "i-lucide-user-round",
      to: "/dashboard/user/profile",
      onSelect: closeSidebar,
    },
  ]);

  return menu;
});

const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: session.value?.user.name ?? "User",
      avatar: {
        src: session.value?.user.image ?? undefined,
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
      <UDropdownMenu
        :items="dropdownItems"
        :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
      >
        <UButton
          :avatar="{
            src: session?.user.image ? `${config.public.imageUrl}/${session.user.image}` : undefined,
            alt: session?.user.name ?? 'User',
            loading: 'lazy',
          }"
          :label="session?.user.name ?? 'User'"
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
    </template>
  </UDashboardSidebar>
</template>
