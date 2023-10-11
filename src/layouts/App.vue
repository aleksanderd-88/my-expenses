<template>
  <div class="base-layout">
    <AppLoader />
    
    <main class="base-layout__content">
      <router-view />
    </main>
    
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import AppLoader from '@/components/atoms/AppLoader.vue';
import AppToast from '@/components/molecules/Toast/AppToast.vue'
</script>

<style scoped>

</style>