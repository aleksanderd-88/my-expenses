<template>
  <LvDialog 
    header="Update income" 
    v-model="useIncomeStore().incomeDialogVisible"
    :style="{ 
      width: '95%',
      maxWidth: '700px'
    }"
  >
    <template v-if="useIncomeStore().incomeList.length > 0">
      <h2 class="caption" :style="{ fontSize: '1rem' }">Added income</h2>
      <IncomeList :style="{ marginBottom: '2rem' }" />
    </template>

    <template v-if="useIncomeStore().addNew || useIncomeStore().isEditMode">
      <LvInput 
        type="text"
        v-model="useIncomeStore().income.name"
        label="Enter a name"
        placeholder="E.g. John Doe"
        bottom-bar
        clearable
      />

      <div class="mt-2">
        <LvInput
          type="number"
          v-model="useIncomeStore().income.amount"
          label="Enter net income"
          placeholder="E.g. 34,000 SEK"
          bottom-bar
          clearable 
        />
      </div>
    </template>

    <LvInput
      v-else
      type="number"
      v-model="amount"
      :label="label"
      placeholder="E.g. 34,000 SEK"
      bottom-bar
    />

    <template #footer>
      <BaseButton 
        icon="trash" 
        class="lv-button--ml-10"
        :style="{ marginRight: 'auto !important', marginLeft: '0 !important' }"
        danger
        @click="useIncomeStore().deleteIncome()"
        v-if="useIncomeStore().isEditMode"
      >
        Delete
      </BaseButton>
      <BaseButton
        v-else
        icon="plus" 
        class="lv-button--ml-10"
        :style="{ marginRight: 'auto !important', marginLeft: '0 !important' }"
        primary
        :disabled="useIncomeStore().addNew"
        @click="useIncomeStore().addNew = true"
      >
        Add income
      </BaseButton>

      <BaseButton 
        icon="x" 
        class="lv-button--ml-10"
        @click="onCancel()"
      >
        Cancel
      </BaseButton>

      <BaseButton 
        icon="check"
        class="lv-button--ml-10"
        success
        @click="useIncomeStore().createIncome()"
      >
        Save
      </BaseButton>
    </template>
  </LvDialog>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import { useIncomeStore } from '@/stores/income';
import IncomeList from './IncomeList.vue';
import { computed } from 'vue';

const onCancel = () => {
  if ( useIncomeStore().addNew || useIncomeStore().isEditMode ) {
    useIncomeStore().clearAll()
    useIncomeStore().isEditMode = false
    return useIncomeStore().addNew = false
  }
  
  useIncomeStore().resetDialog()
}

const amount = computed({
  get: () => useIncomeStore().calculatedTotalIncome,
  set: (value) => {
    useIncomeStore().income.amount = Number(value)
  }
})

const label = computed(() => {
  const incomeList = useIncomeStore().incomeList

  if (  useIncomeStore().addedIncome )
    return 'Update income'
  
  if ( incomeList.length > 0 )
    return 'Update income (Including added income)'

  return 'Enter net income'
})
</script>

<style scoped>

</style>