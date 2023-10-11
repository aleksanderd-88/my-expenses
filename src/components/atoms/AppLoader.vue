<template>
  <LvProgressBar 
    mode="indeterminate" 
    color="#bb2727" 
    :class="{ 'lv-progressbar--visible ': isLoading }" 
  />
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loader';
import { computed } from 'vue';
import LvProgressBar from 'lightvue/progress-bar'

const isLoading = computed(() => useLoadingStore().isLoading)
</script>

<style scoped>

</style>