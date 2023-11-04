<template>
  <LvDialog 
    header="Add new expense" 
    v-model="useExpenseStore().expenseDialogVisible"
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
  >
    <LvInput 
      type="text"
      v-model="expense.name"
      label="Give your expense a name"
      placeholder="E.g. Telenor"
      bottom-bar
      clearable
      :disabled="useExpenseStore().copyPrevious" 
    />

    <div class="col col--flex">
      <LvInput 
        type="number"
        v-model="expense.cost"
        label="Enter expense cost"
        placeholder="E.g. 600 SEK"
        bottom-bar
        clearable
        :disabled="useExpenseStore().copyPrevious"  
      />

      <LvInput 
        type="date"
        v-model="expense.paymentDue"
        label="Enter due date"
        bottom-bar
        clearable
        :disabled="useExpenseStore().copyPrevious"  
      />
    </div>

    <div class="col col--flex">
      <BaseButton 
        icon="thumb-up" 
        class="lv-button--ml-10"
        @click="onHandlePayment()"
        success
        :style="{ marginLeft: 'auto !important' }"
        :disabled="markAsPaidButtonDisabled"
      >
        {{ useExpenseStore().expenseIsPaid ? 'Un-mark as paid' : 'Mark as paid' }}
      </BaseButton>
    </div>

    <ExpensePaymentDateDialog 
      :is-visible="paymentDateDialogVisible" 
      @close="paymentDateDialogVisible = false" 
    />

    <h2 class="sub-headline sub-headline--added-spacing">Optional</h2>

    <div class="col col--flex">
      <LvColorpicker 
        v-model="initialColor" 
        clearable
        bottom-bar
        label="Attach a color" 
      />

      <lv-dropdown 
        v-model="useExpenseStore().data.categoryId" 
        :options="categories" 
        placeholder="Select category" 
        optionLabel="label"
        label="Select category"
        option-value="_id"
        options-label="label"
        clearable
      />
    </div>

    <template #footer>
      <BaseButton 
        icon="trash" 
        @click="useExpenseStore().deleteExpense()"
        danger
        :style="{ marginRight: 'auto !important' }"
        v-if="useExpenseStore().editMode"
      >
        Delete
      </BaseButton>

      <LvToggleSwitch 
        v-model="useExpenseStore().copyPrevious" 
        label="Copy previous month expenses"
        class="d-toggle__wrapper"
        v-if="!useExpenseStore().table.rows.length"
      />

      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="useExpenseStore().resetDialog()"
      >
        Cancel
      </BaseButton>

      <BaseButton 
        icon="check"
        class="lv-button--ml-10"
        success
        @click="useExpenseStore().createExpense()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import { useExpenseStore } from '@/stores/expense';
import LvToggleSwitch from 'lightvue/toggle-switch'
import { useCategoryStore } from '@/stores/category'
import ExpensePaymentDateDialog from './ExpensePaymentDateDialog.vue';
import pick from 'lodash/pick';

const initialColor = ref('#607C8A')
const paymentDateDialogVisible = ref(false)
const expense = useExpenseStore().data

const categories = computed(() => useCategoryStore().categories)

const markAsPaidButtonDisabled = computed(() => {
  const requiredFields = pick(expense, ['name', 'cost', 'paymentDue'])
  return Object.values(requiredFields).some(f => !f)
})


const onHandlePayment = () => {
  if ( useExpenseStore().expenseIsPaid ) {
    paymentDateDialogVisible.value = false
    return useExpenseStore().onMarkPayment()
  }
  paymentDateDialogVisible.value = true
}

watch(() => useExpenseStore().expenseDialogVisible, val => {
  if ( !val ) {
    paymentDateDialogVisible.value = false
  }
})

</script>

<style scoped>

</style>