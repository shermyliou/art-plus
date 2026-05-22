<script setup>
import PublicNavbar from './PublicNavbar.vue';
import FloatingNavTabs from '@/components/ui/FloatingNavTabs.vue';
</script>

<template>
  <div>
    <PublicNavbar />
    <main class="page-top-offset">
      <RouterView />
    </main>
    <FloatingNavTabs />
  </div>
</template>

<style scoped lang="scss">
.page-top-offset {
  padding-top: var(--component-navbar-height);
}
</style>
