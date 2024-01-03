<template>
  <div>
    <!-- Category view -->
    <template v-if="categoryMode">
      <CategoryExpenses 
        v-for="item in useCategoryStore().categories" 
        :key="item._id"
        :category-id="item._id"
        :table-title="item.label"
        @selected-rows="$emit('selected-rows', $event)"
      />
    </template>

    <template v-else>
      <SearchField
        placeholder="Search in list"
        label="Search expenses"
        bottom-bar
        clearable
        icon="search"
        @search="searchQuery = $event"
      />
      
      <TableLight
        :table-title="tableTitle"
        :is-loading="table.isLoading"
        :columns="table.columns"
        :rows="filteredRows"
        :sortable="table.sortable"
        @selected-rows="$emit('selected-rows', $event)"
      />
    </template>

    <ExpenseDetails />
  </div>
</template>

<script setup lang="ts">
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'
import { computed, ref, watch } from 'vue'
import { useTableStore, type ModeTypes } from '@/stores/table';
import { useCategoryStore } from '@/stores/category';
import CategoryExpenses from '@/components/molecules/Category/CategoryExpenses.vue';
import TableLight from '@/components/molecules/Table/TableLight.vue';
import SearchField from '@/components/molecules/Search/SearchField.vue';
import uniqBy from 'lodash/uniqBy';

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
const searchQuery = ref('')

watch(() => useTableStore().mode.includes('list'), val => {
  if ( val ) {
    table.rows = sortAscending(table.rows)
  }
})

const items = computed(() => useExpenseStore().table.rows)
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
  let condition = (item: RowType): boolean => !!item
  
  switch (tableView.value) {
    case 'paid':
     condition = item => item.isPaid
     break
    case 'unpaid':
      condition = item => Boolean(!item.isPaid || !item.paidAt)
      break
    default:
      items.value
      break
  }

  let rows = sortAscending(items.value.filter(condition))
  
  // Filter using `searchQuery` ref
  if ( !searchQuery.value ) 
    return rows
        
  rows = rows.filter(r => r.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return rows
})

const sortAscending = (rows: RowType[]) => {
  return uniqBy(rows.map((o, index) => {
    //- Always set table row number in ascending order
    o.no = index + 1
    return o
  }), 'no')
}
  
</script>

<style scoped>

</style>