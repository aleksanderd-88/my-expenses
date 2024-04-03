<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
import { useAppMenu } from '@/stores/menu';
import { computed, ref } from 'vue';
import { useExpenseStore } from '@/stores/expense';
import { useIncomeStore } from '@/stores/income';
import { useCategoryStore } from '@/stores/category';

defineProps({
  editButtonDisabled: {
    type: Boolean,
    default: false
  }
})

const op = ref()

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
</script>

<template>
  <div class="action-panel" :class="modifiedClass">
    <LvOverlayPanel 
      ref="op" 
      class="action-panel__panel"
      align-right
    >
      <ul class="action-panel__options">
        <li class="action-panel__option">
          <BaseButton 
            icon="stack"
            icon-left
            class="action-panel__action-btn"
            @click="displayExpenseDialog()"
          >
            Add expenses
          </BaseButton>
        </li>

        <li class="action-panel__option">
          <BaseButton 
            icon="currency-euro"
            icon-left
            class="action-panel__action-btn"
            @click="displayIncomeDialog()"
          >
            Update income
          </BaseButton>
        </li>

        <li class="action-panel__option">
          <BaseButton 
            icon="file-check"
            icon-left
            class="action-panel__action-btn"
            @click="displayCategoryDialog()"
          >
            {{ useCategoryStore().categories.length ? 'Add/edit category' : 'Add category' }}
          </BaseButton>
        </li>
      </ul>
    </LvOverlayPanel>

    <div class="action-panel__action-btns">
      <BaseButton 
        class="action-panel__add-btn lv-button--center-content" 
        icon="edit" 
        deep-shadow
        success
        title="Edit row(s)"
        @click="$emit('on-edit')"
        :disabled="editButtonDisabled"
      />

      <BaseButton 
        class="action-panel__add-btn lv-button--center-content" 
        icon="filter" 
        deep-shadow
        primary
        @click="toggleFilterMenu()"
        :disabled="!Boolean(useCategoryStore().expensesWithCategories)"
      />
  
      <BaseButton 
        class="action-panel__add-btn lv-button--center-content" 
        icon="plus" 
        deep-shadow
        @click="togglePanel($event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
 .action-panel {
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