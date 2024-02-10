<template>
  <div class="expense-item">
    <BaseButton 
      icon="trash"
      @click.stop
      danger
    />

    <p>{{ expense.name }}</p>

    <BaseButton 
      icon="thumb-up"
      class="expense-item__mark-btn"
      @click.stop
      success
    >
      Mark as paid
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { RowType } from '@/stores/expense';
import type { PropType } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'

  defineProps({
    expense: {
      type: Object as PropType<RowType>,
      default: () => ({})
    }
  })
</script>

<style lang="scss" scoped>
  .expense-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;

    &:last-child {
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    &__mark-btn {
      margin-left: auto;
    }
  }
</style>