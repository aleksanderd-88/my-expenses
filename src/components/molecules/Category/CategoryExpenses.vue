<template>
  <div>
    <TableLite
      :title="tableTitle"
      :is-slot-mode="true"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="filteredCategoryRows"
      :total="totalRowCount"
      :sortable="table.sortable"
      @do-search="doSearch()"
      @is-finished="table.isLoading = false"
      @row-clicked="rowClicked"
      :is-hide-paging="true"
      :class="{ 'vtl--added-padding': calculatedTotalExpense }"
      has-checkbox
      @return-checked-rows="onSelectedRows"
    >
      <template v-slot:name="data">
        <div class="vtl__row">
          <p :class="{'vtl__row--linethrough': data.value.isPaid}">{{ data.value.name }}</p>
          <i class="light-icon-check" v-if="data.value.isPaid"></i>
        </div>
      </template>

      <template v-slot:paymentDue="data">
        <div class="vtl__row">
          <AppIndicator 
            :title="title(mode(data.value.paymentDue, data.value.isPaid))"
            :mode="mode(data.value.paymentDue, data.value.isPaid)"
          />
          <p>{{ data.value.paymentDue }}</p>
        </div>
      </template>

      <template v-slot:paidAt="data">
        <div class="vtl__row">
          <AppIndicator 
            success
            title="Expense is paid"
            v-if="data.value.paidAt" 
          />
          <p>{{ data.value.paidAt }}</p>
        </div>
      </template>
    </TableLite>
  </div>
</template>

<script setup lang="ts">
import { useExpenseStore } from '@/stores/expense'
import { computed, watch, ref } from 'vue'
import AppIndicator from '@/components/atoms/AppIndicator.vue';
import Sugar from 'sugar-date'

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

const isDueDate = (date = new Date()) => {
  return Boolean(Sugar.Date(new Date(date)).isToday().raw)
}

const isAfterDueDate = (date = new Date()) => {
  return Boolean(Sugar.Date(new Date(date)).addDays(1).isPast().raw)
}

const mode = (date = new Date(), isPaid?: boolean) => {
  let ret = ''

  if ( isDueDate(date) )
    ret = 'warning'
  if ( isAfterDueDate(date) )
    ret = 'danger'
  if ( isPaid )
    ret = 'paid'

  return ret
}

const title = (mode = '') => {
  let ret = ''

  if ( mode.includes('warning') )
    ret ='Expense is due'
  if ( mode.includes('danger') )
    ret = 'Expense due date has expired'
  if ( mode.includes('paid') )
    ret = 'Expense is paid'

  return ret
}

const rowClicked = (row: RowType) => useExpenseStore().setRowData(row)

const doSearch = () => useExpenseStore().doSearch(0, 10, 'id', 'asc', new Date(useExpenseStore().endOfMonth))

const onSelectedRows = (key: number[]) => {
  checkedRows.value = filteredCategoryRows.value.filter((row: RowType, index: number) => key.includes(index + 1))
  emit('selectedRows', checkedRows.value)
}
  
</script>

<style scoped>

</style>