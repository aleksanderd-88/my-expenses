<template>
  <LvButton class="base-btn dark-ripple" v-ripple>
    <i :class="`light-icon-${ icon }`" v-if="iconLeft && icon"></i>
    <slot />
    <i :class="`light-icon-${ icon }`" v-if="!iconLeft && icon"></i>
  </LvButton>
</template>

<script setup lang="ts">
import LvButton from 'lightvue/button'
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
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    gap: 1rem !important;
    background-color: $dark !important;

    i {
      font-size: 1.5rem;
    }

    &.dark-ripple {
      &.lv-ink {
        background: $dark !important;
      }
    }


    //- Define `dark-mode` theme colors
    body.dark & {
      background-color: $white !important;
      color: $dark !important;
    }
  }
</style>