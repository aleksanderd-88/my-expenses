<template>
  <div class="wrapper" :class="{ 'wrapper--visible ': isLoading }">
    <LvProgressBar 
      mode="indeterminate" 
      color="#bb2727" 
    />
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loader';
import { computed } from 'vue';
import LvProgressBar from 'lightvue/progress-bar'

const isLoading = computed(() => useLoadingStore().isLoading)
</script>

<style lang="scss" scoped>
  .wrapper {
    background-color: rgba($dark, .1);
    z-index: 999;
    position: fixed;
    top: 0;
    right: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;

    &--visible {
      opacity: 1;
      visibility: visible;
    }
  }
</style>