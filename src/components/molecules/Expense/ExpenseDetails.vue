<template>
  <div class="vtl__bottom">
    <main class="vtl__bottom-content col col--flex">
      <h2 class="sub-headline sub-headline--flex-start" v-if="paidExpensesLength">
        Remaining expenses: {{ formatCurrency(Number(calculatedRemaingExpenses)) }}
        <p> 
          {{ paidExpensesDetails }} <b>({{ `${ formatCurrency(calculatedPaidExpenses) } of ${ formatCurrency(calculatedTotalExpense) }` }})</b>
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils/formatter'
import { type PropType } from 'vue'

defineProps({
  addedIncome: {
    type: String as PropType<null | string>,
    default: null
  },
  calculatedRemaingExpenses: {
    type: Number,
    default: null
  },
  calculatedTotalExpense: {
    type: Number,
    default: null
  },
  calculatedPaidExpenses: {
    type: Number,
    default: null
  },
  paidExpensesDetails: {
    type: String,
    default: null
  },
  paidExpensesLength: {
    type: Number,
    default: null
  },
})


</script>

<style scoped>

</style>