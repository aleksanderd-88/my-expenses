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
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import { useIncomeStore } from '@/stores/income';
import { formatCurrency } from '@/utils/formatter';
import { computed } from 'vue';

const list = computed(() => useIncomeStore().incomeList)
</script>

<style lang="scss" scoped>
  .income-list {
    &__item {
      margin-top: .5rem;
      font-size: .9rem;
    }
  }
</style>