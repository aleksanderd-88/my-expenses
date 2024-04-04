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
    },
    themeDark: {
      type: Boolean,
      default: false
    }
  })

  const modifiedClass = computed(() => {
    let className = ''
    if ( props.isVisible ) 
      className += ' app-overlay--visible'
    if ( props.themeDark )
      className += ' app-overlay--theme-dark'

    return className
  })
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
    transition: background-color .25s, visibility .25s ease;

    &--visible {
      visibility: visible;
    }

    &--theme-dark {
      background-color: rgba(#000, .5);
    }
  }
</style>