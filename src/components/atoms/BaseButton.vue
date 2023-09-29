<template>
  <LvButton class="base-btn dark-ripple" v-ripple>
    <i :class="`light-icon-${ icon }`" v-if="iconLeft && icon"></i>
    <slot />
    <i :class="`light-icon-${ icon }`" v-if="!iconLeft && icon"></i>
  </LvButton>
</template>

<script setup lang="ts">
import ripple from 'lightvue/ripple'

const vRipple = ripple

defineProps({
  iconLeft: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  }
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
  }
</style>