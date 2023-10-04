<template>
  <div>
    <TableLite
      title="Expenses"
      :is-slot-mode="true"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="table.rows"
      :total="table.totalRecordCount"
      :sortable="table.sortable"
      @do-search="doSearch()"
      @is-finished="table.isLoading = false"
      @row-clicked="rowClicked"
      :is-hide-paging="true"
      :class="{ 'vtl--added-padding': calculatedTotalExpense }"
    >
      <template v-slot:name="data">
        <div class="vtl__row">
          <p :class="{'vtl__row--linethrough': data.value.isPaid}">{{ data.value.name }}</p>
          <i class="light-icon-check" v-if="data.value.isPaid"></i>
        </div>
      </template>
    </TableLite>

    <ExpenseDetails
      :added-income="addedIncome"
    />
  </div>
</template>

<script setup lang="ts">
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'
import { computed } from 'vue'

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
}

const table = useExpenseStore().table

const calculatedTotalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})
const rowClicked = (row: RowType) => useExpenseStore().setRowData(row)

const doSearch = () => useExpenseStore().doSearch(0, 10, 'id', 'asc')

/**
 * Table search finished event
 **/
// const tableLoadingFinish = (elements) => {
  //   table.isLoading = false;
  // };
  
</script>

<style scoped>

</style>