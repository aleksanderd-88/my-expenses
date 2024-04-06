<template>
  <div class="search-field__wrapper">
    <ShimmerSearchField v-if="isLoading" />

    <LvInput
      v-else
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
import { computed, ref } from 'vue';
import ShimmerSearchField from '../Shimmer/ShimmerSearchField.vue';
import { useLoadingStore } from '@/stores/loader';

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
  const loadingStore = useLoadingStore()

  const search = () => emit('search', input.value)

  const isLoading = computed(() => loadingStore.isLoading)
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