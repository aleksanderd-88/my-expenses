<template>
  <div class="app-overlay" :class="modifiedClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    }
  })

  const modifiedClass = computed(() => props.isVisible && 'app-overlay--visible')
</script>

<style lang="scss" scoped>
  .app-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2;
    visibility: hidden;
    transition: all .25s ease;

    &--visible {
      visibility: visible;
    }
  }
</style>