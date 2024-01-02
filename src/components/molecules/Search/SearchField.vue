<template>
  <lv-input 
    type="text" 
    v-model="inputValue" 
    :label="label" 
    :placeholder="placeholder" 
    :bottom-bar="bottomBar"
    :clearable="clearable"
  />
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

<style scoped>

</style>