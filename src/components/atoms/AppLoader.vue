<template>
  <div class="wrapper" :class="{ 'wrapper--visible ': isLoading }">
    <span class="loader"></span>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loader';
import { computed } from 'vue';

const isLoading = computed(() => useLoadingStore().isLoading)
</script>

<style lang="scss" scoped>
  .wrapper {
    background-color: rgba($dark, .65);
    z-index: 9999;
    position: fixed;
    top: 0;
    right: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    display: flex;

    .loader {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: block;
      margin: auto;
      position: relative;
      color: $dark;
      left: -100px;
      box-sizing: border-box;
      animation: shadowRolling 2s linear infinite;
    }

    @keyframes shadowRolling {
      0% {
        box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      12% {
        box-shadow: 100px 0 $white, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      25% {
        box-shadow: 110px 0 $white, 100px 0 $white, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      36% {
        box-shadow: 120px 0 $white, 110px 0 $white, 100px 0 $white, 0px 0 rgba(255, 255, 255, 0);
      }
      50% {
        box-shadow: 130px 0 $white, 120px 0 $white, 110px 0 $white, 100px 0 $white;
      }
      62% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 $white, 120px 0 $white, 110px 0 $white;
      }
      75% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 $white, 120px 0 $white;
      }
      87% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 $white;
      }
      100% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
      }
    }

    &--visible {
      opacity: 1;
      visibility: visible;
    }
  }
</style>