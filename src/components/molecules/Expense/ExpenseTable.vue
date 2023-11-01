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
      has-checkbox
      @return-checked-rows="onSelectedRows"
      v-if="isListMode"
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

    <TableLite
      title="Expenses"
      :is-slot-mode="true"
      :is-loading="table.isLoading"
      :columns="table.columns"
      :rows="filterPaidRows"
      :total="filterPaidRows.length"
      :sortable="table.sortable"
      @do-search="doSearch()"
      @is-finished="table.isLoading = false"
      @row-clicked="rowClicked"
      :is-hide-paging="true"
      :class="{ 'vtl--added-padding': calculatedTotalExpense }"
      has-checkbox
      @return-checked-rows="onSelectedRows"
      v-else-if="paidView"
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

    <template v-else>
      <TableLite
        v-for="(item, index) in useCategoryStore().categories" :key="index"
        :title="item.label"
        :is-slot-mode="true"
        :is-loading="table.isLoading"
        :columns="table.columns"
        :rows="filterRows(item._id)"
        :total="filterRows.length"
        :sortable="table.sortable"
        @do-search="doSearch()"
        @is-finished="table.isLoading = false"
        @row-clicked="rowClicked"
        :is-hide-paging="true"
        @return-checked-rows="onSelectedRows"
        :class="{ 'vtl--added-padding': calculatedTotalExpense }"
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

      <TableLite
        title="Other expenses"
        :is-slot-mode="true"
        :is-loading="table.isLoading"
        :columns="table.columns"
        :rows="filteredRowsWithoutCategory"
        :total="filteredRowsWithoutCategory.length"
        :sortable="table.sortable"
        @do-search="doSearch()"
        @is-finished="table.isLoading = false"
        @row-clicked="rowClicked"
        :is-hide-paging="true"
        @return-checked-rows="onSelectedRows"
        :class="{ 'vtl--added-padding': calculatedTotalExpense }"
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
    </template>

    <ExpenseDetails />
  </div>
</template>

<script setup lang="ts">
import ExpenseDetails from '@/components/molecules/Expense/ExpenseDetails.vue'
import { useExpenseStore } from '@/stores/expense'
import { computed, watch, ref } from 'vue'
import { useTableStore, type ModeTypes } from '@/stores/table';
import { useCategoryStore } from '@/stores/category';
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

const emit = defineEmits<{
  (event: 'selectedRows', values: RowType[]): void
}>()

const table = useExpenseStore().table
const checkedRows = ref([] as RowType[])

const tableView = computed(() => useTableStore().mode as ModeTypes)
const isListMode = computed(() => tableView.value.includes('list'))
const paidView = computed(() => tableView.value.includes('paid'))

const calculatedTotalExpense = computed(() => {
  return table.rows.reduce((sum, item) => sum += item.cost, 0)
})

const filterRows = (id: string) => {
  if ( !isListMode.value ) {
    return table.rows?.filter(r => r.categoryId === id).map((r: RowType, index: number) => {
      r.no = index + 1
      return r
    })
  }
}

const filteredRowsWithoutCategory = computed(() => table.rows.filter(r => !r.categoryId).map((r: RowType, index: number) => {
  if ( !isListMode.value ) {
    r.no = index + 1
    return r
  }
}))

const filterPaidRows = computed(() => table.rows.filter(r => r.paidAt).map((r: RowType, index: number) => {
  if ( !isListMode.value ) {
    r.no = index + 1
    return r
  }
}))

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

watch(() => useTableStore().mode.includes('list'), val => {
  if ( val ) {
    table.rows = table.rows.map((r: RowType, index: number) => {
      r.no = index + 1
      return r
    })
  }
})

const onSelectedRows = (key: number[]) => {
  checkedRows.value = table.rows.filter((row: RowType, index: number) => key.includes(index + 1))
  emit('selectedRows', checkedRows.value)
}
  
</script>

<style scoped>

</style>