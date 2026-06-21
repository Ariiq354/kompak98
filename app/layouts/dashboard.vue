<script setup lang="ts">
import DashboardSidebar from "~/components/App/DashboardSidebar.vue";

defineProps<{
  title?: string;
}>();
</script>

<template>
  <UDashboardGroup>
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
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
