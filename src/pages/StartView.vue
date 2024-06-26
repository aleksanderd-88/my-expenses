<template>
  <div class="start">
    
    <VueDatePicker 
      v-model="useExpenseStore().expenseMonth" 
      month-picker
      hide-input-icon
      class="start__date-picker"
    />
    
    <ExpenseTable v-if="rowsLength" />

    <ExpenseActionPanel
      class="start__actions"
      @on-edit="editOptionsVisibility = true"
      :edit-button-disabled="!multiSelectButtonVisible"
    />

    <EditOptions
      :is-visible="editOptionsVisibility"
      @close="editOptionsVisibility = false"
    />

    <ExpenseDialog />

    <IncomeDialog />

    <CategoryDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ExpenseTable from '@/components/molecules/Expense/ExpenseTable.vue'
import ExpenseDialog from '@/components/molecules/Expense/ExpenseDialog.vue';
import IncomeDialog from '@/components/molecules/Income/IncomeDialog.vue'
import { useExpenseStore } from '@/stores/expense'
import { useIncomeStore } from '@/stores/income'
import Sugar from 'sugar-date'
import CategoryDialog from '@/components/molecules/Category/CategoryDialog.vue';
import { useCategoryStore } from '@/stores/category';
import { onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '@/stores/user';
import EditOptions from '@/components/molecules/EditOptions.vue';
import { useLoadingStore } from '@/stores/loader';
import ExpenseActionPanel from '@/components/molecules/Panels/ExpenseActionPanel.vue';

const multiSelectButtonVisible = ref(false)
const editOptionsVisibility = ref(false)

watch(() => editOptionsVisibility.value, value => {
  if ( !value )
    multiSelectButtonVisible.value = false
})

watch(() => useExpenseStore().selectedRows, value => {
    multiSelectButtonVisible.value = value.length ? true : false
})

const init = () => {
  useLoadingStore().setLoading(true)
  Promise.all([
    useExpenseStore().doSearch(0, 10, 'id', 'asc', Sugar.Date(useExpenseStore().expenseMonth).endOfMonth().raw),
    useIncomeStore().getIncome(),
    useIncomeStore().listIncome(),
  ])
  .finally(() => useLoadingStore().setLoading(false))
}

init()

const rowsLength = computed(() => useExpenseStore().rowsLength)

useUserStore().getUser(useUserStore().currentUser?._id as string)
useCategoryStore().listCategories()

onBeforeRouteUpdate(() => {
  useCategoryStore().listCategories()
  useUserStore().getUser(useUserStore().currentUser?._id as string)
  return true
})
</script>

<style lang="scss" scoped>
  .start {

    &__date-picker {
      padding-top: 1rem;
      position: sticky;
      top: -10px;
      z-index: 2;
    }

    &__actions {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      max-width: auto;
      display: flex;
      z-index: 1;
      justify-content: flex-end;

      @media (min-width: 1024px) {
        right: 1.5rem;
        bottom: 1.5rem;
      }

      &--bottom-margin {
        bottom: calc(90px + 1rem)
      }
    }
  }
</style>