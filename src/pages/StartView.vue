<template>
  <div>
    <p class="start__caption caption center-align">No records created yet ...</p>
    <BaseButton class="start__add-btn" icon="plus" />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
</script>

<style lang="scss" scoped>
  .start {
    &__caption {
      width: 100%;
      text-align: center;
    }

    &__add-btn {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      width: 70px;
      height: 70px;
    }
  }
</style>