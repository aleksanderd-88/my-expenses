<template>
  <LvToggleSwitch 
    :icon="icon" 
    v-model="value"
  />
</template>

<script setup lang="ts">
import LvToggleSwitch from 'lightvue/toggle-switch';
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: null
  },
  modelValue: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>

</style>