<template>
  <div class="start">
    <p class="start__caption caption center-align" v-if="!rowsLength || !isCurrentMonth">No expenses created yet ...</p>
    
    <ExpenseTable v-if="isCurrentMonth" />
    <h1 class="start__headline">{{ currentMonth }}</h1>

    <div class="start__actions" :class="modifiedClass">
      <LvOverlayPanel 
        ref="op" 
        class="start__panel"
        align-right
      >
        <ul class="start__options">
          <li class="start__option">
            <BaseButton 
              icon="stack"
              icon-left
              class="start__action-btn"
              @click="displayExpenseDialog()"
            >
              Add expenses
            </BaseButton>
          </li>

          <li class="start__option">
            <BaseButton 
              icon="currency-euro"
              icon-left
              class="start__action-btn"
              @click="displayIncomeDialog()"
            >
              Update income
            </BaseButton>
          </li>

          <li class="start__option">
            <BaseButton 
              icon="file-check"
              icon-left
              class="start__action-btn"
            >
              Create category
            </BaseButton>
          </li>
        </ul>
      </LvOverlayPanel>
  
      <BaseButton 
        class="start__add-btn lv-button--center-content" 
        icon="plus" 
        deep-shadow
        @click="togglePanel($event)"
      />
    </div>

    <ExpenseDialog />

    <!-- Incomde dialog -->
    <IncomeDialog />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
import { ref, computed } from 'vue'
import ExpenseTable from '@/components/molecules/Expense/ExpenseTable.vue'
import ExpenseDialog from '@/components/molecules/Expense/ExpenseDialog.vue';
import IncomeDialog from '@/components/molecules/Income/IncomeDialog.vue'
import { useExpenseStore } from '@/stores/expense'
import { useIncomeStore } from '@/stores/income'
import Sugar from 'sugar-date'

const op = ref()

useIncomeStore().getIncome()
useExpenseStore().doSearch(0, 10, 'id', 'asc')

const rowsLength = computed(() => useExpenseStore().rowsLength)
const modifiedClass = computed(() => rowsLength.value && 'start__actions--bottom-margin')
const currentMonth = computed(() => Sugar.Date(new Date()).endOfMonth().format('{Month} {yyyy}'))

const isCurrentMonth = computed(() => {
  return useExpenseStore().table.rows.some(r => {
    return Sugar.Date(new Date(currentMonth.value)).isBefore(new Date(r.paymentDue)).raw
  })
})

const togglePanel = (event: Event) => op.value.toggle(event)

const displayExpenseDialog = () => {
  togglePanel(op.value)
  useExpenseStore().editMode = false
  useExpenseStore().expenseDialogVisible = true
}

const displayIncomeDialog = () => {
  togglePanel(op.value)
  useIncomeStore().incomeDialogVisible = true
}
</script>

<style lang="scss" scoped>
  .start {

    &__headline {
      text-align: center;
      position: absolute;
      left: 50%;
      top: 1rem;
      transform: translateX(-50%);
    }

    &__caption {
      width: 100%;
      text-align: center;
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

    &__add-btn {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }

    &__panel {
      right: 0 !important;
      left: unset !important;
      top: unset !important;
      bottom: calc(100% + .5rem) !important;
    }

    &__options {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    &__action-btn {
      width: 100%;
    }
  }
</style>