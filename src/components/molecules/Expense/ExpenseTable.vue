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
      v-if="isListMode"
    >
      <template v-slot:no="data">
        <div class="d-flex gap-1 align-center" @click.stop>
          <LvCheckboxGroup 
            :options="[data.value]"
            v-model="checkedRows"
            color="primary"
            :optionLabel="data.value?.no.toString()"
            rounded
            @click.stop
          />
          <p>{{ data.value.no }}</p>
        </div>
      </template>

      <template v-slot:name="data">
        <div class="vtl__row">
          <p :class="{'vtl__row--linethrough': data.value.isPaid}">{{ data.value.name }}</p>
          <i class="light-icon-check" v-if="data.value.isPaid"></i>
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
        :class="{ 'vtl--added-padding': calculatedTotalExpense }"
      >
        <template v-slot:no="data">
          <div class="d-flex gap-1 align-center" @click.stop>
            <LvCheckboxGroup 
              :options="[data.value]"
              v-model="checkedRows"
              color="primary"
              :optionLabel="data.value?.no.toString()"
              rounded
              @click.stop
            />
            <p>{{ data.value.no }}</p>
          </div>
        </template>
        
        <template v-slot:name="data">
          <div class="vtl__row">
            <p :class="{'vtl__row--linethrough': data.value.isPaid}">{{ data.value.name }}</p>
            <i class="light-icon-check" v-if="data.value.isPaid"></i>
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
        :class="{ 'vtl--added-padding': calculatedTotalExpense }"
      >
        <template v-slot:no="data">
          <div class="d-flex gap-1 align-center" @click.stop>
            <LvCheckboxGroup 
              :options="[data.value]"
              v-model="checkedRows"
              color="primary"
              :optionLabel="data.value?.no.toString()"
              rounded
              @click.stop
            />
            <p>{{ data.value.no }}</p>
          </div>
        </template>
        
        <template v-slot:name="data">
          <div class="vtl__row">
            <p :class="{'vtl__row--linethrough': data.value.isPaid}">{{ data.value.name }}</p>
            <i class="light-icon-check" v-if="data.value.isPaid"></i>
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
import { useTableStore } from '@/stores/table';
import { useCategoryStore } from '@/stores/category';
import LvCheckboxGroup  from 'lightvue/checkbox-group'

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
const checkedRows = ref([])

const isListMode = computed(() => useTableStore().mode.includes('list'))

const calculatedTotalExpense = computed(() => {
  console.log(1);
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

/**
 * Table search finished event
 **/
// const tableLoadingFinish = (elements) => {
  //   table.isLoading = false;
  // };
  
</script>

<style scoped>

</style>