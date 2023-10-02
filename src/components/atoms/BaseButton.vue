<template>
  <LvButton class="base-btn dark-ripple" :class="modifiedClass" v-ripple>
    <i :class="`light-icon-${ icon }`" v-if="iconLeft && icon"></i>
    <slot />
    <i :class="`light-icon-${ icon }`" v-if="!iconLeft && icon"></i>
  </LvButton>
</template>

<script setup lang="ts">
import ripple from 'lightvue/ripple'
import { computed } from 'vue';

const vRipple = ripple

const props = defineProps({
  iconLeft: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  }
})

const modifiedClass = computed(() => {
  let className = ''
  if ( props.danger )
    className += ' base-btn--bg-danger'
  if ( props.success )
    className += ' base-btn--bg-success'

  return className
})
</script>

<style lang="scss">
  .base-btn {
    background-color: $dark !important;

    i {
      font-size: 1.25rem;
    }

    &.dark-ripple {
      &.lv-ink {
        background: $dark !important;
      }
    }
  
    &--bg-danger {
      background-color: $red !important;
    }
    
    &--bg-success {
      background-color: $success !important;
    }
  }
</style>