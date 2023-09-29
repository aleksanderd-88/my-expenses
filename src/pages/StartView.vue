<template>
  <div>
    <p class="start__caption caption center-align">No expenses created yet ...</p>

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
            >
              Add income
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

    <LvDialog 
      header="Add new expense" 
      v-model="expenseDialogIsVisible"
      :style="{ 
        width: '95%',
        maxWidth: '700px'
      }"
    >
      <LvInput 
        type="text"
        v-model="expense.name"
        label="Give your expense a name"
        placeholder="E.g. phone bills"
        bottom-bar
        clearable 
      />

      <div class="col col--flex">
        <LvInput 
          type="text"
          v-model="expense.cost"
          label="Enter expense cost"
          placeholder="E.g. $59.99"
          bottom-bar
          clearable 
        />

        <LvInput 
          type="date"
          v-model="expense.date"
          label="Enter due date"
          bottom-bar
          clearable 
        />
      </div>

      <template #footer>
        <BaseButton 
          icon="x" 
          class="lv-button--ml-10"
          @click="closeExpenseDialog()"
        >
          Cancel
        </BaseButton>

        <BaseButton 
          icon="check"
          class="lv-button--ml-10"
          @click.prevent
        >
          Save
        </BaseButton>
      </template>
    </LvDialog>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvOverlayPanel  from 'lightvue/overlay-panel'
import LvDialog from 'lightvue/dialog';
import LvInput from 'lightvue/input';
import { reactive, ref } from 'vue'

const op = ref()
const expenseDialogIsVisible = ref(false)
const expenseInitialValue = {
  name: null,
  cost: null,
  date: null
}

const expense = reactive({ ...expenseInitialValue })

const togglePanel = (event: Event) => op.value.toggle(event)
const displayExpenseDialog = () => {
  togglePanel(op.value)
  expenseDialogIsVisible.value = true
}
const closeExpenseDialog = () => {
  Object.assign(expense, expenseInitialValue)
  expenseDialogIsVisible.value = false
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