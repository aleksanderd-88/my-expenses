<template>
  <div class="start">
    
    <VueDatePicker 
      v-model="useExpenseStore().expenseMonth" 
      month-picker
      hide-input-icon
      class="start__date-picker"
    />
    
    <ExpenseTable
      v-if="rowsLength"
      :reset-selection="resetSelection"
      @selected-rows="onSelectedRows($event)" 
    />

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
              @click="displayCategoryDialog()"
            >
              {{ useCategoryStore().categories.length ? 'Add/edit category' : 'Add category' }}
            </BaseButton>
          </li>
        </ul>
      </LvOverlayPanel>

      <div class="start__action-btns">
        <BaseButton 
          class="start__add-btn lv-button--center-content" 
          icon="edit" 
          deep-shadow
          success
          title="Edit row(s)"
          @click="editOptionsVisibility = true"
          :disabled="!multiSelectButtonVisible"
        />

        <BaseButton 
          class="start__add-btn lv-button--center-content" 
          icon="filter" 
          deep-shadow
          primary
          @click="toggleFilterMenu()"
          :disabled="!Boolean(useCategoryStore().expensesWithCategories)"
        />
    
        <BaseButton 
          class="start__add-btn lv-button--center-content" 
          icon="plus" 
          deep-shadow
          @click="togglePanel($event)"
        />
      </div>
    </div>

    <EditOptions
      :is-visible="editOptionsVisibility"
      :selected-rows="selectedRows"
      @close="editOptionsVisibility = false"
      @handle-payments="expenseListIsVisible = true"
    />

    <ExpenseDialog />

    <IncomeDialog />

    <CategoryDialog />

    <ExpenseList
      :expenses="selectedRows"
      :is-visible="expenseListIsVisible"
      @set-visibility="expenseListIsVisible = $event"
    />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
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
import { useAppMenu } from '@/stores/menu';
import { useLoadingStore } from '@/stores/loader';
import ExpenseList from '@/components/molecules/Expense/ExpenseList/ExpenseList.vue';

const op = ref()
const multiSelectButtonVisible = ref(false)
const editOptionsVisibility = ref(false)
const selectedRows = ref()
const resetSelection = ref(false)
const expenseListIsVisible = ref(false)

watch(() => editOptionsVisibility.value, value => {
  if ( !value ) {
    multiSelectButtonVisible.value = false
    resetSelection.value = true
  }
})

const init = () => {
  useLoadingStore().setLoading(true)
  Promise.all([
    useIncomeStore().getIncome(),
    useIncomeStore().listIncome(),
    useExpenseStore().doSearch(0, 10, 'id', 'asc', Sugar.Date(useExpenseStore().expenseMonth).endOfMonth().raw)
  ])
  .then(() => useLoadingStore().setLoading(false))
}

init()

const rowsLength = computed(() => useExpenseStore().rowsLength)
const modifiedClass = computed(() => rowsLength.value && 'start__actions--bottom-margin')

const toggleFilterMenu = () => {
  const filterMenuIsVisible = useAppMenu().filterMenuIsVisible
  let setOpen = false
  if ( !filterMenuIsVisible )
    setOpen = true
  useAppMenu().setFilterMenuVisibility(setOpen)
}

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

const displayCategoryDialog = () => {
  togglePanel(op.value)
  useCategoryStore().categoryDialogVisible = true
}

useCategoryStore().listCategories()
useUserStore().getUser(useUserStore().currentUser?._id as string)

onBeforeRouteUpdate(() => {
  useCategoryStore().listCategories()
  useUserStore().getUser(useUserStore().currentUser?._id as string)
  return true
})

const onSelectedRows = (values: Record<string, unknown>[]) => {
  multiSelectButtonVisible.value = false

  if ( values.length ) {
    selectedRows.value = values
    multiSelectButtonVisible.value = true
  }
}
</script>

<style lang="scss" scoped>
  .start {

    &__date-picker {
      padding-top: 1rem;
      position: sticky;
      top: -10px;
      z-index: 2;
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
      bottom: calc(70px + .5rem) !important;
    }

    &__options {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    &__action-btns {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &__action-btn {
      width: 100%;
    }
  }
</style>