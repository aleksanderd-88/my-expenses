<template>
  <div>
    <!-- Category view -->
    <template v-if="categoryMode">
      <CategoryExpenses 
        v-for="item in useCategoryStore().categories" 
        :key="item._id"
        :category-id="item._id"
        :table-title="item.label"
        @selected-rows="$emit('selectedRows', $event)"
      />
    </template>

    <TableLight
      v-else
      :table-title="tableTitle"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="filteredRows"
      :sortable="table.sortable"
      @selected-rows="$emit('selectedRows', $event)"
    />

    <ExpenseDetails />
  </div>
</template>

<script setup lang="ts">
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'
import { computed, watch } from 'vue'
import { useTableStore, type ModeTypes } from '@/stores/table';
import { useCategoryStore } from '@/stores/category';
import CategoryExpenses from '@/components/molecules/Category/CategoryExpenses.vue';
import TableLight from '@/components/molecules/Table/TableLight.vue';

type RowType = {
  _id: string
  no: number
  name: string
  cost: number
  isPaid: boolean
  strCost: string
  paymentDue: string
  paidAt: string
  createdAt: string
  categoryId: string
}

const table = useExpenseStore().table

watch(() => useTableStore().mode.includes('list'), val => {
  if ( val ) {
    table.rows = table.rows.map((r: RowType, index: number) => {
      r.no = index + 1
      return r
    })
  }
})

const tableView = computed(() => useTableStore().mode as ModeTypes)
const categoryMode = computed(() => tableView.value === 'category')

const tableTitle = computed(() => {
  let title = 'All expenses'
  
  if ( tableView.value.includes('paid') )
    title = 'Paid expenses'
  if ( tableView.value.includes('unpaid') )
    title = 'Unpaid expenses'

  return title
})

const filteredRows = computed(() => {
  let condition = (item:RowType): boolean => !!item

  switch (tableView.value) {
    case 'paid':
      condition = item => item.isPaid
      break
    case 'unpaid':
      condition = item => Boolean(!item.isPaid || !item.paidAt)
      break
    default:
      table.rows
      break
  }

  const items = table.rows.filter(r => condition(r)).map((o, index) => {
    //- Always set table row number in ascending order
    o.no = index + 1
    return o
  })

  return items
})
  
</script>

<style scoped>

</style>