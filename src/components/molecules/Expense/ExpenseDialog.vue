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
        type="text"
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
        @click="useExpenseStore().markAsPaid()"
        success
        :style="{ marginLeft: 'auto !important' }"
        v-if="useExpenseStore().editMode"
      >
        {{ useExpenseStore().expenseIsPaid ? 'Un-mark as paid' : 'Mark as paid' }}
      </BaseButton>
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
        @click="useExpenseStore().createExpense()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue'
import LvColorpicker from 'lightvue/color-picker';
import LvDropdown from 'lightvue/dropdown';
import { useExpenseStore } from '@/stores/expense';
import LvToggleSwitch from 'lightvue/toggle-switch'
import { useCategoryStore } from '@/stores/category'

const initialColor = ref('#607C8A')

const categories = computed(() => useCategoryStore().categories)

const expense = useExpenseStore().data

</script>

<style scoped>

</style>