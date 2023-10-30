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
      @click="onDeleteRows()"
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
import { computed, type PropType } from 'vue'
import { useExpenseStore } from '@/stores/expense';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  selectedRows: {
    type: Array as PropType<{ _id: string }[]>,
    default: () => ([])
  }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const visible = computed({
  get: () => props.isVisible,
  set: () => emit('close')
})

const onDeleteRows = () => {
  useExpenseStore().deleteSelectedExpenses(props.selectedRows)
  ?.then(() => emit('close'))
}
</script>

<style scoped>

</style>