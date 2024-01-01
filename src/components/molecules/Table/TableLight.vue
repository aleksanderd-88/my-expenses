<template>
  <TableLite
    :title="tableTitle"
    :is-slot-mode="true"
    :is-loading="isLoading"
    :columns="columns"
    :rows="rows"
    :total="totalRowCount"
    :sortable="sortable"
    @do-search="doSearch()"
    @is-finished="table.isLoading"
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
</template>

<script setup lang="ts">
import AppIndicator from '@/components/atoms/AppIndicator.vue';
import { useExpenseStore } from '@/stores/expense';
import Sugar from 'sugar-date'
import { computed, ref, watch, type PropType } from 'vue';
import { type RowType } from '@/stores/expense';

  const props = defineProps({
    tableTitle: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => ([])
    },
    rows: {
      type: Array as PropType<RowType[]>,
      default: () => ([])
    },
    sortable: {
      type: Object,
      default: null
    },
    appIndicatorTitle: {
      type: String,
      default: ''
    },
    appIndicatorMode: {
      type: String,
      default: ''
    },
    resetSelection: {
      type: Boolean,
      default: false
    },
  })


  const emit = defineEmits<{
    (event: 'selected-rows', values: RowType[]): void
  }>()


  const table = useExpenseStore().table
  const checkedRows = ref([] as RowType[])

  watch(() => props.resetSelection, val => {
    if ( val ) {
      onSelectedRows([])
    }
  })

  const totalRowCount = computed(() => props.rows.length)

  const calculatedTotalExpense = computed(() => {
    return table.rows.reduce((sum, item) => sum += item.cost, 0)
  })

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

  const onSelectedRows = (key: number[]) => {
    checkedRows.value = props.rows.filter((r, index) => key.includes(index + 1))
    emit('selected-rows', checkedRows.value)
  }

  const rowClicked = (row: RowType) => useExpenseStore().setRowData(row)

  const doSearch = () => useExpenseStore().doSearch(0, 10, 'id', 'asc', new Date(useExpenseStore().endOfMonth))
</script>

<style scoped>

</style>