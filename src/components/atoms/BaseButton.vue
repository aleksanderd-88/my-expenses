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
  primary: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  transparent: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
})

const modifiedClass = computed(() => {
  let className = ''
  if ( props.danger )
    className += ' base-btn--bg-danger'
  if ( props.success )
    className += ' base-btn--bg-success'
  if ( props.primary )
    className += ' base-btn--bg-primary'
  if ( props.transparent )
    className += ' base-btn--transparent'
  if ( props.isVisible )
    className += ' base-btn--visible'

  return className
})
</script>

<style lang="scss">
  .base-btn {
    background-color: $dark !important;
    transform: scale(0) !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transition: transform .25s, visibility .25s, opacity .25s ease !important;

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
    
    &--bg-primary {
      background-color: $primary !important;
    }

    &--transparent {
      padding: .5rem 0 !important;
      color: $dark !important;
      background-color: transparent !important;
    }

    &--visible {
      opacity: 1 !important;
      visibility: visible !important;
      transform: scale(1) !important;
    }
  }
</style>