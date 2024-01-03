<template>
  <div class="search-field__wrapper">
    <LvInput 
      type="text" 
      :label="label"
      :placeholder="placeholder" 
      :bottom-bar="bottomBar"
      :clearable="clearable"
      :icon-left="icon ? `light-icon-${ icon }` : null"
      v-model="input"
      @update:modelValue="search()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

  defineProps({
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
    (event: 'search', payload: string): void
  }>()

  const input = ref('')

  const search = () => emit('search', input.value)
</script>

<style lang="scss">
  .search-field {
    &__wrapper {
      margin: 4rem 0 0;
      width: 100%;
      max-width: 400px;
    }
  }
</style>