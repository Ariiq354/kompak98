<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthSession } from "~/composables/auth";

const { session } = await useAuthSession();

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
        label: "Monitoring Member",
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
      {
        label: "Survei",
        icon: "i-lucide-clipboard-check",
        to: "/dashboard/admin/survei",
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
      label: "Cari Teman",
      icon: "i-lucide-users-round",
      to: "/dashboard/user/monitoring-pegawai",
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
    {
      label: "Berbagi Foto & Info",
      icon: "i-lucide-folder-open",
      to: "/dashboard/user/galeri",
      onSelect: closeSidebar,
    },
    {
      label: "Survei",
      icon: "i-lucide-clipboard-list",
      to: "/dashboard/user/survei",
      onSelect: closeSidebar,
    },
  ]);

  return menu;
});
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
      <div class="hidden w-full items-center justify-center px-2 py-3 md:flex">
        <NuxtLink to="/" class="h-8 w-auto object-contain">
          <NuxtImg
            src="/images/logo-horizontal.webp"
            alt="Logo"
          />
        </NuxtLink>
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
  </UDashboardSidebar>
</template>
