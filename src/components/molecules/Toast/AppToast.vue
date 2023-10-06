<template>
  <div 
    class="app-toast"
    :class="modifiedClass"
  >
    <p class="app-toast__text">{{ text }}</p>
    <BaseButton class="app-toast__close-btn" icon="x" @click="useToastStore().closeToast()"/>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useToastStore } from '@/stores/toast'
import { computed } from 'vue';

const text = computed(() => useToastStore().text)

const modifiedClass = computed(() => {
  let className = ''
  if ( useToastStore().isVisible )
    className += ' app-toast--visible'
  if ( useToastStore().onError ) 
    className += ' app-toast--error'

  return className
})
</script>

<style lang="scss" scoped>
  .app-toast {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    width: 95%;
    padding: .5rem .25rem .5rem 1rem;
    display: flex;
    z-index: 1000;
    border-radius: 3px;
    gap: 1rem;
    align-items: center;
    transform: translate(-50%, 5px);
    background-color: $primary;
    color: $white;
    transform-origin: center;
    opacity: 0;
    visibility: hidden;
    box-shadow: 0px 10px 28px -13px rgba($dark, .4);
    transition: opacity .25s, visibility .25s, transform .25s ease;

    &__close-btn {
      margin-left: auto;
      background-color: transparent !important;
    }

    @media (min-width: 1024px) {
      width: auto;
      bottom: unset;
      left: unset;
      top: 1rem;
      right: 1rem;
      transform: translate(0, 5px);
    }

    &--visible {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, 0);

      @media (min-width: 1024px) {
        transform: translate(0, 0);
      }
    }

    &--error {
      background-color: $red !important;
    }
  }
</style>