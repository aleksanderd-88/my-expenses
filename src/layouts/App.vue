<template>
  <div class="base-layout">
    <AppLoader />
    <TheAppBar />
    
    <main class="base-layout__content">
      <router-view />
    </main>
    
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import AppLoader from '@/components/atoms/AppLoader.vue';
import AppToast from '@/components/molecules/Toast/AppToast.vue'
import TheAppBar from '@/components/organisms/TheAppBar.vue'
</script>

<style scoped>

</style>