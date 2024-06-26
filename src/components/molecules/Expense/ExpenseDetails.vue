<template>
  <div class="vtl__bottom">
    <main class="vtl__bottom-content col col--flex mt-0">
      <ShimmerExpenseDetails v-if="isLoading" />

      <template v-else>
        <h2 class="sub-headline sub-headline--flex-start" v-if="paidExpensesLength">
          Remaining expenses: {{ formatCurrency(Number(calculatedRemaingExpenses)) }}
          <p> 
            <span>{{ paidExpensesDetails }}</span> <b>({{ `${ formatCurrency(calculatedPaidExpenses) } of ${ formatCurrency(calculatedTotalExpense) }` }})</b>
          </p>
        </h2>

        <h2 class="sub-headline sub-headline--flex-end">
          Total expenses: {{ formatCurrency(Number(calculatedTotalExpense)) }}
          <p v-if="addedIncome"> 
            Remaining income: 
            <span :style="{ color: `${ Number(addedIncome) < Number(calculatedTotalExpense) ? 
              '#ef5350' : '#495057'}` }">
              <b>
                {{ formatCurrency(Number(addedIncome) - Number(calculatedTotalExpense)) }}
              </b>
            </span>

            <span>
              (Income: <b>{{ `${ formatCurrency(Number(addedIncome)) }` }}</b>)
            </span>
          </p>
        </h2>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils/formatter'
import { computed } from 'vue'
import { useExpenseStore } from '@/stores/expense';
import { useIncomeStore } from '@/stores/income';
import ShimmerExpenseDetails from '../Shimmer/ShimmerExpenseDetails.vue';
import { useLoadingStore } from '@/stores/loader';

const table = useExpenseStore().table
const loaderStore = useLoadingStore()

const isLoading = computed(() => loaderStore.isLoading)

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

const addedIncome = computed(() => useIncomeStore().calculatedTotalIncome)

</script>

<style scoped>

</style>