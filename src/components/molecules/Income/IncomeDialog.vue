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

    <template v-if="useIncomeStore().addNew">
      <LvInput 
        type="text"
        v-model="useIncomeStore().income.newName"
        label="Enter a full name"
        placeholder="Your full name"
        bottom-bar
        clearable
      />

      <div class="mt-2">
        <LvInput
          type="number"
          v-model="useIncomeStore().income.newAmount"
          label="Enter monthly income (after taxes)"
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
      label="Enter monthly income (after taxes)"
      placeholder="E.g. 34,000 SEK"
      bottom-bar
      clearable 
    />

    <template #footer>
      <BaseButton 
        icon="plus" 
        class="lv-button--ml-10"
        :style="{ marginRight: 'auto !important', marginLeft: '0 !important' }"
        primary
        @click="useIncomeStore().addNew = true"
        :disabled="useIncomeStore().addNew"
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
  if ( useIncomeStore().addNew )
    return useIncomeStore().addNew = false
  
  useIncomeStore().resetDialog()
}

const amount = computed({
  get: () => useIncomeStore().calculatedTotalIncome,
  set: (value) => {
    useIncomeStore().income.amount = value
  }
})
</script>

<style scoped>

</style>