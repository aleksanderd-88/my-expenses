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
      :total-row-count="totalRowCount"
      :sortable="table.sortable"
      @do-search="doSearch()"
      @row-clicked="rowClicked($event)"
      @return-checked-rows="onSelectedRows($event)"
      :calculated-total-expense="calculatedTotalExpense"
    />

    <ExpenseDetails />
  </div>
</template>

<script setup lang="ts">
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'
import { computed, watch, ref } from 'vue'
import { useTableStore, type ModeTypes } from '@/stores/table';
import { useCategoryStore } from '@/stores/category';
import CategoryExpenses from '@/components/molecules/Category/CategoryExpenses.vue';
import TableLight from '../Table/TableLight.vue';

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

const props = defineProps({
  resetSelection: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'selectedRows', values: RowType[]): void
}>()

const table = useExpenseStore().table
const checkedRows = ref([] as RowType[])

watch(() => useTableStore().mode.includes('list'), val => {
  if ( val ) {
    table.rows = table.rows.map((r: RowType, index: number) => {
      r.no = index + 1
      return r
    })
  }
})

watch(() => props.resetSelection, val => {
  if ( val ) {
    onSelectedRows([])
  }
})

const tableView = computed(() => useTableStore().mode as ModeTypes)
const categoryMode = computed(() => tableView.value === 'category')

const calculatedTotalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})

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

const totalRowCount = computed(() => filteredRows.value.length)

const rowClicked = (row: RowType) => useExpenseStore().setRowData(row)

const doSearch = () => useExpenseStore().doSearch(0, 10, 'id', 'asc', new Date(useExpenseStore().endOfMonth))

const onSelectedRows = (key: number[]) => {
  checkedRows.value = filteredRows.value.filter((row: RowType, index: number) => key.includes(index + 1))
  emit('selectedRows', checkedRows.value)
}
  
</script>

<style scoped>

</style>