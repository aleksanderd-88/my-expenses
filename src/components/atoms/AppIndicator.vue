<template>
  <span 
    class="app-indicator" 
    :class="modifiedClass" 
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

  const props = defineProps({
    success: {
      type: Boolean,
      default: true
    },
    warning: {
      type: Boolean,
      default: false
    },
    danger: {
      type: Boolean,
      default: false
    },
    // Used to conditionally set indicator mode e.g. `<condition> ? danger : success`
    mode: {
      type: String,
      default: null
    }
  })

  const modifiedClass = computed(() => {
    let className = ''
    if ( props.success || props.mode.includes('paid') )
      className += ' app-indicator--success'
    if ( props.warning || props.mode?.includes('warning') )
      className += ' app-indicator--warning'
    if ( props.danger || props.mode?.includes('danger') )
      className += ' app-indicator--danger'
    return className
  })
</script>

<style lang="scss" scoped>
  .app-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &--success {
      background-color: $success;
    }

    &--warning {
      background-color: $warning;
    }

    &--danger {
      background-color: $red;
    }
  }
</style>