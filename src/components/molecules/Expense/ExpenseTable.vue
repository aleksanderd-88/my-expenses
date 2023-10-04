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
      @do-search="doSearch"
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
      :calculated-total-expense="calculatedTotalExpense"
      :calculated-remaing-expenses="calculatedRemaingExpenses"
      :calculated-paid-expenses="calculatedPaidExpenses"
      :paid-expenses-details="paidExpensesDetails"
      :paid-expenses-length="paidExpensesLength"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import Sugar from 'sugar-date'
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'

type RowType = { 
  no: number
  name: string
  cost: number
  isPaid: boolean
  strCost: string
  paymentDue: string
  paidAt: string
  createdAt: string 
}

defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initSearch: {
    type: Boolean,
    default: false
  },
  addedIncome: {
    type: String as PropType<null | string>,
    default: null
  },
})

const emit = defineEmits<{
  (event: 'toggle', value: boolean): void,
  (event: 'edit-mode', value: boolean): void,
  (event: 'set-row', value: RowType): void
}>()

const rowData = ref()
const table = useExpenseStore().table

const calculatedTotalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})

const calculatedRemaingExpenses = computed(() => {
  return table.rows.reduce((sum, item) => sum -= item.isPaid ? item.cost : 0, calculatedTotalExpense.value)
})

const calculatedPaidExpenses = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.isPaid ? item.cost : 0, 0)
})

const paidExpensesDetails = computed(() => `${ table.rows.filter(r => r.isPaid).length } expenses of ${ table.rows.length } paid`)
const paidExpensesLength = computed(() => table.rows.filter(r => r.isPaid).length)

const rowClicked = (row: RowType) => {
  rowData.value = row
  const parsedPaymentDueDate = Sugar.Date(new Date(row.paymentDue)).format('{yyyy}-{MM}-{dd}').raw
  emit('set-row', { ...row, paymentDue: parsedPaymentDueDate })
  emit('toggle', true)
  emit('edit-mode', true)
}

/**
 * Table search finished event
 **/
// const tableLoadingFinish = (elements) => {
  //   table.isLoading = false;
  // };
  
</script>

<style scoped>

</style>