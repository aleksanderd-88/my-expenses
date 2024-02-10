<template>
  <LvDialog
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
    class="expense-list"
    v-model="visibility"
    header="Handle expenses"
  >
    <ExpenseItem
      v-for="expense in expenses" 
      :key="expense._id"
      :expense="expense"
    />
  </LvDialog>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import ExpenseItem from './ExpenseItem.vue';
import type { RowType } from '@/stores/expense';

const props = defineProps({
  expenses: {
    type: Array as PropType<RowType[]>,
    default: () => ([])
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'set-visibility', value: boolean): void
}>()

const visibility = computed({
  get: () => props.isVisible,
  set: value => {
    emit('set-visibility', value)
  }
})
</script>

<style scoped>

</style>