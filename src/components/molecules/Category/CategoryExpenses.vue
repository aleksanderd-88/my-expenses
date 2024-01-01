<template>
  <TableLight
    :table-title="tableTitle"
    :is-loading="table.isLoading"
    :columns="table.columns"
    :rows="filteredCategoryRows"
    :total-row-count="totalRowCount"
    :sortable="table.sortable"
    @do-search="doSearch()"
    @row-clicked="rowClicked($event)"
    @return-checked-rows="onSelectedRows($event)"
    :calculated-total-expense="calculatedTotalExpense"
  />
</template>

<script setup lang="ts">
import { useExpenseStore } from '@/stores/expense'
import { computed, watch, ref } from 'vue'
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

const props = defineProps({
  resetSelection: {
    type: Boolean,
    default: false
  },
  tableTitle: {
    type: String,
    default: 'Other expenses'
  },
  categoryId: {
    type: String,
    default: null
  }
})

const emit = defineEmits<{
  (event: 'selectedRows', values: RowType[]): void
}>()

const table = useExpenseStore().table
const checkedRows = ref([] as RowType[])

watch(() => props.resetSelection, val => {
  if ( val ) {
    onSelectedRows([])
  }
})

const calculatedTotalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})

const filteredCategoryRows = computed(() => {
  return table.rows?.filter(r => r.categoryId === props.categoryId).map((r: RowType, index: number) => {
    r.no = index + 1
    return r
  })
})

const totalRowCount = computed(() => filteredCategoryRows.value.length)

const rowClicked = (row: RowType) => useExpenseStore().setRowData(row)

const doSearch = () => useExpenseStore().doSearch(0, 10, 'id', 'asc', new Date(useExpenseStore().endOfMonth))

const onSelectedRows = (key: number[]) => {
  checkedRows.value = filteredCategoryRows.value.filter((row: RowType, index: number) => key.includes(index + 1))
  emit('selectedRows', checkedRows.value)
}
  
</script>

<style scoped>

</style>