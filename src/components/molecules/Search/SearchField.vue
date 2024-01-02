<template>
  <div class="search-field__wrapper">
    <LvInput 
      type="text" 
      v-model="inputValue" 
      :label="label" 
      :placeholder="placeholder" 
      :bottom-bar="bottomBar"
      :clearable="clearable"
      :icon-left="icon ? `light-icon-${ icon }` : null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

  const props = defineProps({
    input: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    bottomBar: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    }
  })

  const emit = defineEmits<{
    (event: 'input-value', payload: string): void
  }>()

  const inputValue = computed({
    get: () => props.input,
    set: val => emit('input-value', val)
  })
</script>

<style lang="scss">
  .search-field {
    &__wrapper {
      margin: 4rem 0 0;
      width: 100%;
      max-width: 300px;
    }
  }
</style>