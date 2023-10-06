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
    />

    <div class="col col--flex">
      <LvInput 
        type="text"
        v-model="expense.cost"
        label="Enter expense cost"
        placeholder="E.g. 600 SEK"
        bottom-bar
        clearable 
      />

      <LvInput 
        type="date"
        v-model="expense.paymentDue"
        label="Enter due date"
        bottom-bar
        clearable 
      />
    </div>

    <h2 class="sub-headline sub-headline--added-spacing">Optional</h2>

    <div class="col col--flex">
      <LvColorpicker 
        v-model="initialColor" 
        clearable
        bottom-bar
        label="Attach a color" 
      />

      <lv-dropdown 
        v-model="selectedOption" 
        :options="options" 
        placeholder="Select bank account" 
        optionLabel="label"
        label="Choose bank account"
        clearable 
      />
    </div>

    <template #footer>
      <BaseButton 
        icon="thumb-up" 
        class="lv-button--ml-10"
        @click="useExpenseStore().markAsPaid()"
        success
        v-if="useExpenseStore().editMode"
      >
        {{ useExpenseStore().expenseIsPaid ? 'Un-mark as paid' : 'Mark as paid' }}
      </BaseButton>

      <BaseButton 
        icon="trash" 
        class="lv-button--ml-10"
        @click="useExpenseStore().deleteExpense()"
        danger
        v-if="useExpenseStore().editMode"
      >
        Delete
      </BaseButton>

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
        @click="useExpenseStore().createExpense()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import { useExpenseStore } from '@/stores/expense';

const initialColor = ref('#607C8A')
const selectedOption = ref(null)
const options = ref([
  { id: 1, label: 'Bank account 1' },
  { id: 2, label: 'Bank account 2' },
  { id: 3, label: 'Bank account 3' },
  { id: 4, label: 'Bank account 4' }
])

const expense = useExpenseStore().data

</script>

<style scoped>

</style>