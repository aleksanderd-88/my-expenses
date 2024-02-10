<template>
  <LvDialog 
    :header="dialogTitle" 
    v-model="visible"
    :style="{ 
      width: '95%',
      maxWidth: '450px'
    }"
  >
    <template #footer>
      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="onDeleteRows()"
        danger
        :style="{ marginTop: '1rem !important' }"
      >
        Delete selected
      </BaseButton>

      <BaseButton 
        icon="thumb-up" 
        class="lv-button--ml-10"
        @click.stop="onHandlePayments()"
        success
        :style="{ marginTop: '1rem !important' }"
      >
        {{ markExpenseLabel }}
      </BaseButton>
    </template>

  </LvDialog>
</template>

<script setup lang="ts">
import LvDialog from 'lightvue/dialog'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { computed, type PropType } from 'vue'
import { useExpenseStore, type RowType } from '@/stores/expense';

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
  (event: 'handle-payments'): void
}>()

const visible = computed({
  get: () => props.isVisible,
  set: () => emit('close')
})

const dialogTitle = computed(() => `${ props.selectedRows.length } ${ props.selectedRows.length < 2 ? 'row' : 'rows' } selected`)

const markExpenseLabel = computed(() => {
  return `Handle ${ props.selectedRows.length < 2 ? 'expense' : 'expenses'}`
})

const onDeleteRows = () => {
  useExpenseStore().deleteSelectedExpenses(props.selectedRows)
  ?.then(() => emit('close'))
}

const onHandlePayments = () => {
  emit('handle-payments')
  emit('close')
}
</script>

<style scoped>

</style>