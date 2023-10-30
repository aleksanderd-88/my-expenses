<template>
  <LvDialog 
    header="Handle row(s)" 
    v-model="visible"
    :style="{ 
      width: '95%',
      maxWidth: '400px'
    }"
  >
    <BaseButton 
      icon="x" 
      class="lv-button--ml-10"
      @click.stop
      danger
      :style="{ marginTop: '1rem !important', marginLeft: 'auto !important' }"
    >
      Delete
    </BaseButton>
  </LvDialog>
</template>

<script setup lang="ts">
import LvDialog from 'lightvue/dialog'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { computed } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'close', value: boolean): void
}>()

const visible = computed({
  get: () => props.isVisible,
  set: value => emit('close', value)
})
</script>

<style scoped>

</style>