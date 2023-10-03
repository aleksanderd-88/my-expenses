<template>
  <div>
    <p class="start__caption caption center-align" v-if="!rowsLength">No expenses created yet ...</p>

    <ExpenseTable
      :init-search="doSearch"
      @set-row="rowData = $event"
      @rows-length="rowsLength = $event"
      v-else
    />

    <div class="start__actions">
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

    <ExpenseDialog
      :expense-dialog-is-visible="expenseDialogIsVisible"
      :edit-mode="editMode"
      :row-data="rowData"
      @close="expenseDialogIsVisible = $event"
      @do-search="doSearch = true"
      @set-edit-mode="editMode = $event"
    />

    <!-- Incomde dialog -->
    <IncomeDialog
      :added-income="addedIncome"
      @do-search="doSearch = $event"
    />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
import LvDialog from 'lightvue/dialog';
import LvInput from 'lightvue/input';
import { reactive, ref, computed, watch, onMounted } from 'vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import API from '@/services/api'
import { formatCurrency } from '@/utils/formatter'
import ExpenseTable from '@/components/molecules/Expense/ExpenseTable.vue'
import ExpenseDialog from '@/components/molecules/Expense/ExpenseDialog.vue';
import IncomeDialog from '@/components/molecules/Income/IncomeDialog.vue'

const op = ref()
const editMode = ref(false)
const doSearch = ref(false)
const incomeDialogVisible = ref(false)
const addedIncome = ref<null | string>(null)
const rowsLength = ref<null | number>(null)

onMounted(() => doSearch.value = true)

const rowData = ref()
const expenseDialogIsVisible = ref(false)

const getIncome = () => {
  return API.getIncome().then(({ data }: { data: { amount: number } }) => addedIncome.value = data.amount.toString())
  .catch(err => console.log(`Error: ${ err }`))
}

getIncome()

const togglePanel = (event: Event) => op.value.toggle(event)
const displayExpenseDialog = () => {
  editMode.value = false
  togglePanel(op.value)
  expenseDialogIsVisible.value = true
}

const displayIncomeDialog = () => {
  togglePanel(op.value)
  incomeDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
  .start {
    &__caption {
      width: 100%;
      text-align: center;
    }

    &__actions {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      width: 100%;
      max-width: auto;
      display: flex;
      z-index: 1;
      justify-content: flex-end;

      @media (min-width: 1024px) {
        right: 1.5rem;
        bottom: 1.5rem;
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