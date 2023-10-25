<template>
  <ul class="income-list">
    <li 
      class="income-list__item d-flex align-center gap-1"
      v-for="item in list" :key="item._id"
    >
      {{ item.name }}
      &middot;
      {{ formatCurrency(Number(item.amount)) }}

      <BaseButton 
        transparent 
        icon="edit"
        :style="{ padding: '0 !important' }"
        title="Edit income"
        @click.stop="edit(item)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useIncomeStore } from '@/stores/income';
import { formatCurrency } from '@/utils/formatter';
import { computed } from 'vue';
import { type IncomeType } from '@/stores/income'

const list = computed(() => useIncomeStore().incomeList)

const edit = (income: IncomeType) => {
  useIncomeStore().editIncome(income)
}
</script>

<style lang="scss" scoped>
  .income-list {
    &__item {
      margin-top: .5rem;
      font-size: .9rem;
    }
  }
</style>